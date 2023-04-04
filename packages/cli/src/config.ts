export type EjectGeneratorConfig = {};

export type EjectSpecGeneratorConfig = {
  name: "eject-spec-generator";
  file: string;
} & EjectGeneratorConfig;

// TODO: finalise full support for CLI config
export interface EjectCLIConfig {
  /**
   * The command to run which will communicate with the interface.
   */
  command: {
    exec: string;
  };

  // TODO: expand to support generator expansion
  generators: EjectSpecGeneratorConfig[];
}
