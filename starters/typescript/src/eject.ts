// This is the entrypoint Eject uses for identifying routes at run time
// This should only run load routes, not start the server
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as eject from "@eject/fastify";
import { api } from "./api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Build an API
await api.register(eject.ejectInterface, {
  version: "0.0.1",
  title: "TypeScript Starter API",
});

// Register Eject routes plugin
await api.register(eject.routes, {
  // prefix: "/api",
  dir: path.join(__dirname, "routes"),
});

await api.ready();
