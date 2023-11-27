import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Text, useApp } from "ink";
import Spinner from "ink-spinner";
import { Layout } from "./layout.js";
import { Loading } from "./loading.js";

import {
  compiledConfigValidator,
  ConfigFile,
  defaultConfig,
} from "../config.js";
import { cosmiconfig } from "cosmiconfig";

import fs from "node:fs";
import { getAllBuilders, OpenAPIBuilder } from "@eject/interface";
import { execaCommand, ExecaChildProcess } from "execa";
import { startEjectCLIAPI } from "../api/api.js";
import { theme } from "../theme.js";
import { Commands, Options } from "../cli.js";
import path from "node:path";

type ActionList = {
  key: string;
  state: "pending" | "loading" | "success" | "error";
  message: string;
}[];

type EjectCLIAPI = Awaited<ReturnType<typeof startEjectCLIAPI>>;

type CLIContext = {
  api: EjectCLIAPI;
  loading: false | string;
  setLoading: React.Dispatch<React.SetStateAction<false | string>>;
  actions: ActionList;
  updateActions: React.Dispatch<React.SetStateAction<ActionList>>;
  updateAction: (key: string, updatedItem: Partial<ActionList[number]>) => void;
  config: ConfigFile;
};

export const CLIContext = createContext<CLIContext>({} as CLIContext);
export const useCLIContext = () => useContext(CLIContext);

type CLIProviderProps = {
  children: React.ReactNode;
  options: Options;
  command: Commands;
};

type ResolvedGenerator = {
  name: string;
  generator: (builders: OpenAPIBuilder[]) => Promise<boolean>; //EjectGenerator;
  options: Record<string, unknown>;
};

const initialActions = [
  {
    key: "config",
    state: "pending",
    message: "Loading configuration",
  },
  {
    key: "loading-generators",
    state: "pending",
    message: "Loading generators",
  },
  {
    key: "api",
    state: "pending",
    message: "Starting Eject API",
    // message: "Failed to start Eject API; port 3374 already in use",
  },
  {
    key: "client",
    state: "pending",
    message: "Executing client command",
  },
  {
    key: "listening",
    state: "pending",
    message: "Listening for initial specification details",
  },
  // {
  //   key: "spec",
  //   state: "pending",
  //   message: "Generating initial OpenAPI specification",
  // },
] satisfies CLIContext["actions"];

export const CLIContextProvider = ({
  children,
  options,
  command = "start",
}: CLIProviderProps) => {
  const { exit } = useApp();

  const api = useRef<EjectCLIAPI>();
  const clientProcess = useRef<ExecaChildProcess<string>>();

  const [loading, setLoading] = useState<false | string>(false);
  const [actions, updateActions] =
    useState<CLIContext["actions"]>(initialActions);

  const [generators, setGenerators] = useState<ResolvedGenerator[]>([]);

  const updateAction = (
    key: string,
    updatedItem: Partial<ActionList[number]>
  ) => {
    updateActions((current) =>
      current.map((item) => {
        if (item.key === key) {
          return { ...item, ...updatedItem };
        }

        return item;
      })
    );
  };

  const [config, setConfig] = useState<ConfigFile | null>(null);

  // First thing the application has to do is load the config
  useEffect(() => {
    (async () => {
      // Use cosmiconfig to find and load the config
      const configResult = await cosmiconfig("eject").search();

      if (
        !configResult ||
        !configResult.config ||
        configResult.isEmpty === true
      ) {
        updateAction("config", {
          state: "error",
          message: "Unable to find a configuration file",
        });

        return;
      }

      const combinedConfig = {
        ...defaultConfig,
        ...(configResult?.config as ConfigFile),
        ...(options ? options : {}),
      };

      // Validate the config against the schema
      const errors = [...compiledConfigValidator.Errors(combinedConfig)];

      // If the config is invalid, show the error and exit
      if (errors.length > 0) {
        updateAction("config", {
          state: "error",
          message: `Configuration file is invalid: ${errors[0].path} ${errors[0].message}`,
        });

        return exit();
      }

      updateAction("config", {
        state: "success",
        message: `Loaded configuration from ${configResult.filepath}`,
      });

      // If there are generators, load them recursively
      if (combinedConfig.generators) {
        updateAction("loading-generators", {
          state: "loading",
          message: `Loading ${combinedConfig.generators.length} generator${
            combinedConfig.generators.length === 0 ? "s" : ""
          }`,
        });

        try {
          const resolvedGenerators: ResolvedGenerator[] = await Promise.all(
            combinedConfig.generators.map(async ({ name, file, options }) => {
              const module = await import(path.join(process.cwd(), file));
              const generator = module.default(options);

              return { name, generator, options };
            })
          );

          setGenerators(resolvedGenerators);
        } catch (error) {
          updateAction("loading-generators", {
            state: "error",
            message: `Failed to load generators: ${error}`,
          });

          return exit();
        }

        updateAction("loading-generators", {
          state: "success",
          message: `Loaded ${combinedConfig.generators.length} generator${
            combinedConfig.generators.length === 0 ? "s" : ""
          }`,
        });

        // Add an action for processing generators
        updateActions((current) => [
          ...current,
          {
            key: "generators",
            state: "pending",
            message: `Running ${combinedConfig.generators.length} generator${
              combinedConfig.generators.length === 0 ? "s" : ""
            }`,
          },
        ]);
      } else {
        updateAction("loading-generators", {
          state: "success",
          message: `Loaded 0 generators`,
        });
      }

      // Set the config, which will trigger the next useEffect
      setConfig(combinedConfig);
    })();
  }, []);

  // Startup the Eject API once we have a config
  useEffect(() => {
    (async () => {
      if (!config) {
        return;
      }

      updateAction("api", {
        state: "loading",
      });

      const cliapi = await startEjectCLIAPI();
      api.current = cliapi;

      updateAction("listening", {
        state: "loading",
      });

      let endpoints = 0;

      cliapi.addHook("onResponse", (request, reply) => {
        endpoints += 1;

        updateAction("listening", {
          state: "loading",
          message: `Processed ${endpoints} endpoints`,
        });
      });

      cliapi.addHook("onClose", async () => {
        updateAction("listening", {
          state: "success",
          message: `Received ${endpoints} endpoints`,
        });

        // Run the generators
        if (generators.length > 0) {
          updateAction("generators", {
            state: "loading",
          });

          try {
            const results = await Promise.all(
              generators.map(({ name, generator, options }) =>
                generator(getAllBuilders())
              )
            );

            const success = results.every((result) => result === true);

            updateAction("generators", {
              state: success ? "success" : "error",
              message: `Ran ${generators.length} generator${
                generators.length === 0 ? "s" : ""
              }`,
            });
          } catch (error) {
            updateAction("generators", {
              state: "error",
              message: `Failed to run generators: ${error}`,
            });

            return exit();
          }
        }

        // Trigger generators from here, pass the builder in to local state?
        if (command === "build") {
          // Manually close the API, and kill the spawned process
          cliapi.close();

          setTimeout(() => {
            clientProcess.current?.kill("SIGTERM", {
              forceKillAfterTimeout: 2000,
            });
          }, 1000);
        }
      });

      try {
        await cliapi.listen({ port: config.port });
      } catch (error: unknown) {
        let message = `${error}`;

        if (error instanceof Error) {
          message = error.message;
        }

        updateAction("api", {
          state: "error",
          message: `Failed to start Eject API; ${message}`,
        });
      }

      updateAction("api", {
        state: "success",
      });

      // This should run off config instead
      if (config.command.exec) {
        // Instead of waiting for the entire process to finish, we should pipe it to a stream
        // When that stream receives data, we should update our internal logging
        // execaCommand(config.command.exec).pipeAll()

        updateAction("client", {
          state: "loading",
        });

        const execaProcess = execaCommand(config.command.exec);
        clientProcess.current = execaProcess;

        // TODO: surface logs to CLI tool as per above comments
        execaProcess.stdout?.on("data", (data) => {
          console.log("stdout", data.toString());
        });

        execaProcess.all?.on("data", (data) => {
          console.log("all", data.toString());
        });

        execaProcess.then(() => {
          updateAction("client", {
            state: "success",
          });
        });

        execaProcess.catch((e) => {
          let message = `${e}`;

          if (e instanceof Error) {
            message = e.message;
          }

          updateAction("client", {
            state: "error",
            message: `Failed to execute command "${config.command.exec}": with error ${message}`,
          });

          return exit();
        });
      }
    })();

    return () => {
      // Close the API
      if (api.current) {
        api.current.close();
      }
    };
  }, [config]);

  if (actions.length > 0) {
    return (
      <Layout>
        {actions.map(({ key, state, message }, index) => {
          const nextActions = actions.slice(index + 1);

          const text = (() => {
            switch (state) {
              case "pending":
                return (
                  <Text dimColor>
                    {"  "}
                    {message}
                  </Text>
                );
              case "loading":
                return (
                  <Text>
                    <Spinner type="dots" /> {message}
                  </Text>
                );
              case "success":
                return (
                  <Text
                    color={theme.colors.mint}
                    dimColor={
                      !!nextActions.length &&
                      nextActions.some((a) => a.state !== "pending")
                    }
                  >
                    ✓ {message}
                  </Text>
                );
              case "error":
                return <Text color={theme.colors.crayola}>⨯ {message}</Text>;
            }
          })();

          return <Text key={key}>{text}</Text>;
        })}
      </Layout>
    );
  }

  // Simple loading state
  if (loading) {
    return (
      <Layout>
        <Loading>{loading}</Loading>
      </Layout>
    );
  }

  // Bail if no API or config (should be present at this point or rendered actions)
  if (!api.current || !config) {
    return null;
  }

  return (
    <CLIContext.Provider
      value={{
        api: api.current,
        loading,
        setLoading,
        actions,
        updateActions,
        updateAction,
        config,
      }}
    >
      {children}
    </CLIContext.Provider>
  );
};
