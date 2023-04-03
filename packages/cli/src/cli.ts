// import { createCLI } from "soly";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as eject from "@eject/fastify";
import * as interfaceSchema from "@eject/interface";
import { api } from "./api.js";
import { TSchema, Type } from "@sinclair/typebox";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = parseInt(process.env.PORT || "3000");

// Add the schema refs to the API
for (const schema of Object.values(interfaceSchema)) {
  if (!(schema as TSchema)["$id"]) {
    continue;
  }

  api.addSchema(Type.Strict(schema as TSchema));
}

// Build an API
if (process.env.EJECT_INTERNAL_GENERATION) {
  await api.register(eject.ejectInterface, {
    version: "0.0.1",
    title: "Eject Interface API",
    ejectHost: `http://localhost:${port}`,
  });
}

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

// (async () => {
//   const cli = createCLI("eject");

//   /**
//    * Start the Eject common interface listener
//    */
//   cli.command("start", (cmd) => {
//     return async () => {
//     };
//   });

//   /**
//    * Run the Eject build process for an application over the common interface
//    */
//   cli.command("build", (cmd) => {
//     return async () => {
//       // Start listening on the common interface
//       // Run the target application
//       // Wait for "finish" API call
//       // Terminate target application
//       // Generate packages from information now available
//     };
//   });

//   cli.action(() => {
//     return () => {
//       console.error(
//         "Unknown command, use `eject help` to see a list of available commands."
//       );
//     };
//   });

//   cli.parse();
// })();
