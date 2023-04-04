import { fastify } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as eject from "@eject/fastify";
import * as interfaceSchema from "@eject/interface";
import { TSchema, Type } from "@sinclair/typebox";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const startEjectCLIAPI = async (
  options: any = {} // TODO: How do we type this as fastify opts?
) => {
  // Create Fastify application
  const api = fastify({
    logger: true,
    ignoreTrailingSlash: true,
    ajv: {
      customOptions: {
        removeAdditional: true,
        uriResolver: undefined,
      },
    },
    ...options,
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Add the schema refs to the API
  for (const schema of Object.values(interfaceSchema)) {
    if (!(schema as TSchema)["$id"]) {
      continue;
    }

    api.addSchema(Type.Strict(schema as TSchema));
  }

  // Build an API
  if (process.env.EJECT_INTERNAL_GENERATION) {
    await api.register(eject.ejectInterface, {
      version: "0.0.1",
      title: "Eject Interface API",
      ejectHost: `http://localhost:${process.env.EJECT_INTERNAL_GENERATION}`,
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
