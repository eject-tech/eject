import fs from "node:fs";
import React from "react";
import { useInput, Static, Box, Text, Newline } from "ink";
import { startEjectCLIAPI } from "./api/api.js";
import type { Commands, Options } from "./cli.js";
import { getAllBuilders } from "@eject/interface";
import childProcess from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(childProcess.exec);

type Props = {
  command: Commands;
  options?: Options;
};

const defaultPort = parseInt(process.env.PORT || "3734");

export default function App({
  command = "start",
  options = { port: defaultPort },
}: Props) {
  const [count, setCount] = React.useState<number>(0);
  const api = React.useRef<Awaited<ReturnType<typeof startEjectCLIAPI>>>();

  React.useEffect(() => {
    (async () => {
      const cliapi = await startEjectCLIAPI({ logger: false });
      api.current = cliapi;

      cliapi.addHook("onResponse", (request, reply) => {
        setCount((count) => count + 1);
      });

      cliapi.addHook("onClose", () => {
        // Write the API spec
        const specs = getAllBuilders();

        for (let specKey = 0; specKey < specs.length; specKey++) {
          const spec = specs[specKey];
          fs.writeFileSync(`eject-openapi-spec.3.1.0.json`, spec.print());
        }

        if (command === "build") {
          process.exit();
        }
      });

      await cliapi.listen({ port: options.port });

      if (options.exec) {
        try {
          const { stdout, stderr } = await exec(options.exec);
        } catch (e) {
          console.error(e); // should contain code (exit code) and signal (that caused the termination).
        }
      }
    })();

    return () => {
      api.current?.close();
    };
  }, []);

  useInput((input, key) => {
    if (input === "q") {
      // Exit program
      process.exit();
    }
  });

  return (
    <Text>
      {api.current ? (
        <>
          {/* <Static items={api.current.}>
            {(test) => (
              <Box key={test.id}>
                <Text color="green">✔ {test.title}</Text>
              </Box>
            )}
          </Static> */}
          <Text color="green">
            Eject Interface API listening on port {options.port}
          </Text>
          <Newline />
          <Text>Requests received: {count}</Text>
        </>
      ) : (
        <Text color="red">Starting development API...</Text>
      )}
    </Text>
  );
}
