// This file is specifically for running the interface and generating out specs
// for the CLI. It's not meant to be used for anything else.
import { startEjectCLIAPI } from "./api/api.js";

const api = await startEjectCLIAPI({ _internalGeneration: 3734 });

api.listen({ port: 3000 });

process.on("SIGTERM", function onSigterm() {
  api.close(() => {
    process.exit(0);
  });
});
