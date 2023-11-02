import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

/**
 * This is the schema for the Eject CLI configuration file.
 */
export const configFileSchema = Type.Object(
  {
    port: Type.Number({
      title: "Port",
      description: "The port to run the Eject CLI API on.",
    }),
    command: Type.Object({
      exec: Type.String({
        title: "Program execution command.",
        description:
          "The command to run which will communicate with the interface.",
      }),
    }),
    generators: Type.Array(
      Type.Object({
        name: Type.String(),
        file: Type.String(),
        options: Type.Optional(Type.Any()),
      })
    ),
  },
  {
    title: "Eject Config File Schema",
    description: "The configuration file for the Eject CLI",
  }
);

export type ConfigFile = Static<typeof configFileSchema>;

export const compiledConfigValidator = TypeCompiler.Compile(configFileSchema);

/**
 * Default configuration which we lay user configuration on top of.
 */
export const defaultConfig: Partial<ConfigFile> = {
  port: 3734,
  generators: [
    {
      name: "eject-spec-generator",
      file: "eject-spec-generator.js",
    },
  ],
};
