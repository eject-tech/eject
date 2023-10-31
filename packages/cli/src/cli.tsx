#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./app.js";

export const commands = [
  ["start", "Start the development server in watch mode"],
  ["build", "Generate packages and specifications for production"],
] as const;

export type Commands = (typeof commands)[number][0];

export const options = {
  port: {
    description: "Port to run the Eject interface on",
    flag: {
      type: "number",
      default: 3734,
      alias: "p",
    },
  },
  exec: {
    description:
      "Command to execute which communicates with the Eject interface",
    flag: {
      type: "string",
      alias: "e",
    },
  },
} as const;

export type Options = {
  port?: number;
  exec?: string;
};

const cli = meow({
  help: `Usage
	$ eject

Commands
${commands
  .map(([command, description]) => `  ${command.padEnd(12)} ${description}`)
  .join("\n")}

  Options
${Object.entries(options)
  .map(
    ([option, { description, flag }]) =>
      `  --${(option + (flag.alias ? `, -${flag.alias}` : "")).padEnd(
        10
      )} ${description}`
  )
  .join("\n")}
`,
  importMeta: import.meta,
  flags: {
    ...Object.fromEntries(
      Object.entries(options).map(([option, { flag }]) => [option, flag])
    ),
  },
});

// Render ink app
render(<App command={cli.input[0] as Commands} options={cli.flags} />, {
  exitOnCtrlC: true,
});
