import { fileURLToPath } from "node:url";
import path from "node:path";
import * as eject from "@eject/fastify";
import { api } from "./api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
