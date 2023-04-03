// This is the entrypoint Eject uses for identifying routes at run time
// This should only run load routes, not start the server

import path from "path";
import * as eject from "@eject/fastify";
import { api } from "./api.js";

// Build an API
const ejectSync = async () => {
  await api.register(eject.ejectInterface);

  // Register Eject routes plugin
  await api.register(eject.routes, {
    // prefix: "/api",
    dir: path.join(__dirname, "routes"),
  });
};

ejectSync();
