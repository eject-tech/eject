import path from "path";
import * as eject from "@eject/fastify";
import { api } from "./api.js";

// Build an API
const start = async () => {
  await api.register(eject.ejectInterface);

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

start();
