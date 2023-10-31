// This file is specifically for running the interface and generating out specs
// for the CLI. It's not meant to be used for anything else.
import { startEjectCLIAPI } from "./api/api.js";
const cliapi = await startEjectCLIAPI({ _internalGeneration: 3734 });
cliapi.listen({ port: 3000 });
