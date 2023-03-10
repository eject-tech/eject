import path from "path";
import { api, loadRoutes } from "./api";

// Build an API
const start = async () => {
  // Change plugin to own package
  api.register(loadRoutes, {
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
