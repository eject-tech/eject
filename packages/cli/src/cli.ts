import { createCLI } from "soly";

(async () => {
  const cli = createCLI("eject");

  /**
   * Start the Eject common interface listener
   */
  cli.command("start", (cmd) => {
    return async () => {};
  });

  /**
   * Run the Eject build process for an application over the common interface
   */
  cli.command("build", (cmd) => {
    return async () => {
      // Start listening on the common interface
      // Run the target application
      // Wait for "finish" API call
      // Terminate target application
      // Generate packages from information now available
    };
  });

  cli.action(() => {
    return () => {
      console.error(
        "Unknown command, use `eject help` to see a list of commands."
      );
    };
  });

  cli.parse();
})();
