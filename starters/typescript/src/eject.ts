// This is the entrypoint Eject uses for identifying routes at run time
// This should only run load routes, not start the server

import path from "path";
import eject from "@eject/fastify";
import { api } from "./api";

// Build an API
const ejectSync = async () => {
  await api.register(eject.hooks);

  // Register Eject routes plugin
  await api.register(eject.routes, {
    // prefix: "/api",
    dir: path.join(__dirname, "routes"),
  });
};

ejectSync();
