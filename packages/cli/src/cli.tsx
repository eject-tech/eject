#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./app.js";

export const commands = [
  ["start", "Start the development server"],
  ["build", "Generate packages and specifications for production"],
] as const;

export type Commands = (typeof commands)[number][0];

export const options = {
  port: {
    description: "Port to run the development server on",
    flag: {
      type: "number",
      default: 3734,
      alias: "p",
    },
  },
} as const;

export type Options = {
  port?: number;
};

const cli = meow(
  `
  Usage
	  $ eject

	Commands
${commands
  .map(([command, description]) => `    ${command.padEnd(12)} ${description}`)
  .join("\n")}

  Options
${Object.entries(options)
  .map(
    ([option, { description, flag }]) =>
      `    --${(option + (flag.alias ? `, -${flag.alias}` : "")).padEnd(
        10
      )} ${description}`
  )
  .join("\n")}
`,
  {
    importMeta: import.meta,
    flags: {
      port: {
        type: "number",
        default: 3734,
      },
    },
  }
);

if (
  commands.map<string>(([command]) => command).includes(cli.input[0]) === false
) {
  console.log(`  Unknown command\n`, cli.help);
  process.exit();
}

// Render ink app
render(<App command={cli.input[0] as Commands} options={cli.flags} />);
