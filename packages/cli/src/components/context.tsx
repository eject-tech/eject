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
import { getAllBuilders } from "@eject/interface";
import { execaCommand } from "execa";
import { startEjectCLIAPI } from "../api/api.js";
import { theme } from "../theme.js";
import { Commands, Options } from "../cli.js";

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

export const CLIContextProvider = ({
  children,
  options,
  command = "start",
}: CLIProviderProps) => {
  const { exit } = useApp();

  const api = useRef<EjectCLIAPI>();
  const [loading, setLoading] = useState<false | string>(false);
  const [actions, updateActions] = useState<CLIContext["actions"]>([
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
      key: "listening",
      state: "pending",
      message: "Listening for initial specification details",
    },
    // {
    //   key: "build",
    //   state: "pending",
    //   message: "Executing client build command",
    // },
    // {
    //   key: "start",
    //   state: "pending",
    //   message: "Executing client start command",
    // },
    // {
    //   key: "spec",
    //   state: "pending",
    //   message: "Generating initial OpenAPI specification",
    // },
  ]);

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
          message: "Configuration file is invalid: " + errors[0].message,
        });

        return exit();
      }

      // If the config is valid, set it
      setConfig(combinedConfig);

      updateAction("config", {
        state: "success",
      });
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
      });

      cliapi.addHook("onClose", () => {
        // Write the API spec
        const specs = getAllBuilders();

        for (let specKey = 0; specKey < specs.length; specKey++) {
          const spec = specs[specKey];
          fs.writeFileSync(`eject-openapi-spec.3.1.0.json`, spec.print());
        }

        updateAction("listening", {
          state: "success",
          message: `Processed ${endpoints} endpoints`,
        });

        // Trigger generators from here, pass the builder in to local state?

        if (command === "build") {
          return exit();
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
        try {
          await execaCommand(config.command.exec);
          // TODO: surface logs to CLI tool
        } catch (e) {
          let message = `${e}`;

          if (e instanceof Error) {
            message = e.message;
          }

          updateAction("api", {
            state: "error",
            message: `Failed to execute command "${config.command.exec}": with error ${message}`,
          });

          return exit();
        }
      }
    })();

    return () => {
      updateAction("api", {
        state: "loading",
      });

      api.current?.close();
    };
  }, [config]);

  if (actions.length > 0) {
    return (
      <Layout>
        {actions.map(({ key, state, message }) => {
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
                    dimColor={actions
                      .slice(actions.findIndex((a) => a.key === key))
                      .some((a) => a.state !== "pending")}
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
