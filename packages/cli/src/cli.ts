import { createCLI } from "soly";
import path from "path";
import eject from "@eject/fastify";
import { api } from "./api";

(async () => {
  const cli = createCLI("eject");

  /**
   * Start the Eject common interface listener
   */
  cli.command("start", (cmd) => {
    return async () => {
      // Build an API
      await api.register(eject.hooks);

      // Register Eject routes plugin
      await api.register(eject.routes, {
        // prefix: "/api",
        dir: path.join(__dirname, "routes"),
      });

      try {
        await api.listen({ port: parseInt(process.env.PORT || "3000") });
      } catch (err) {
        api.log.error(err);
        process.exit(1);
      }
    };
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
        "Unknown command, use `eject help` to see a list of available commands."
      );
    };
  });

  cli.parse();
})();
