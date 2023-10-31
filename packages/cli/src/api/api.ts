import { fastify } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as eject from "@eject/fastify";
import * as interfaceSchema from "@eject/interface";
import { TSchema, Type } from "@sinclair/typebox";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type EjectCLIAPIOptions = {
  _internalGeneration?: number;
};

const ejectCLIAPIDefaults: EjectCLIAPIOptions = {};

export const startEjectCLIAPI = async (
  userOptions: EjectCLIAPIOptions = {}
) => {
  const options = { ...ejectCLIAPIDefaults, ...userOptions };

  // Create Fastify application
  const api = fastify({
    logger: false,
    ignoreTrailingSlash: true,
    ajv: {
      customOptions: {
        removeAdditional: true,
        uriResolver: undefined,
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Add the schema refs to the API
  for (const schema of Object.values(interfaceSchema)) {
    if (!(schema as TSchema)["$id"]) {
      continue;
    }

    api.addSchema(Type.Strict(schema as TSchema));
  }

  // Build an API
  if (options._internalGeneration) {
    await api.register(eject.ejectInterface, {
      version: process.env.npm_package_version,
      title: "Eject Interface API",
      ejectHost: `http://localhost:${options._internalGeneration}`,
    });
  }

  // Register Eject routes plugin
  await api.register(eject.routes, {
    // prefix: "/api",
    dir: path.join(__dirname, "routes"),
  });

  return api;
};

export type Api = Awaited<ReturnType<typeof startEjectCLIAPI>>;
