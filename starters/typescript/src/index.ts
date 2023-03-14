import path from "path";
import eject from "@eject/fastify";
import { api } from "./api";

// Build an API
const start = async () => {
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

start();
