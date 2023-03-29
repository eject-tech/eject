import { createCLI } from "soly";
import path from "path";
import * as eject from "@eject/fastify";
import { api } from "./api";

(async () => {
  const cli = createCLI("eject");

  /**
   * Start the Eject common interface listener
   */
  cli.command("start", (cmd) => {
    return async () => {
      const port = parseInt(process.env.PORT || "3000");

      // Build an API
      await api.register(eject.ejectInterface, {
        version: "0.0.1",
        title: "Eject Interface API",
        ejectHost: `http://localhost:${port}`,
      });

      // Register Eject routes plugin
      await api.register(eject.routes, {
        // prefix: "/api",
        dir: path.join(__dirname, "routes"),
      });

      try {
        await api.listen({ port });
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
