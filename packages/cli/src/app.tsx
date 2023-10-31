import React from "react";
import { Text } from "ink";
import type { Commands, Options } from "./cli.js";
import { Layout } from "./components/layout.js";
import { CLIContextProvider } from "./components/context.js";

type Props = {
  command: Commands;
  options?: Options;
};

const defaultPort = parseInt(process.env.PORT || "3734");

export default function App({
  command = "start",
  options = { port: defaultPort },
}: Props) {
  return (
    <CLIContextProvider options={options}>
      <Layout>
        <Text>Everything is running!</Text>
      </Layout>
    </CLIContextProvider>
  );
}
