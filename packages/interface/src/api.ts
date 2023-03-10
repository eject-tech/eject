import Fastify, { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

import {
  TypeBoxTypeProvider,
  TypeBoxValidatorCompiler,
} from "@fastify/type-provider-typebox";
import {
  findFiles,
  filePathToMethod,
  filePathToEndpoint,
  HTTPMethods,
} from "./route-loader";

// =-=-=-=-=-=[ EJECT PLUGIN ]=-=-=-=-=-=-= //
type SpecDetails = {
  description: string;
  summary: string;
  tags?: string[];
};

// Enforce schema requirements on routes for spec generation
declare module "fastify" {
  interface FastifySchema {
    details: SpecDetails;
  }
}

const EjectPluginCallback: FastifyPluginAsync = async (fastify, options) => {
  const routes: any[] = [];
  // Use this hook to fire off our schemas etc
  fastify.addHook("onRoute", (routeOptions) => {
    routes.push(routeOptions);
    console.log("Route registered: ", routeOptions.url, routeOptions.method);
  });

  // Use this hook to compile schemas once the API starts listening
  fastify.addHook("onReady", async () => {
    // Compile schemas
    console.log("Compiling schemas...");
    console.log(routes);
  });
};

const EjectPlugin = fastifyPlugin(EjectPluginCallback);
// =-=-=-=-=[ END EJECT PLUGIN ]=-=-=-=-=-= //

// Create Fastify application
export const api = Fastify({
  logger: true,
  ignoreTrailingSlash: true,
})
  .withTypeProvider<TypeBoxTypeProvider>()
  .setValidatorCompiler(TypeBoxValidatorCompiler);

export type Api = typeof api;
export type RouteInfo = {
  url: string;
  method: HTTPMethods;
  constraints: {
    version?: string;
    host?: string;
  };
};

export type RouteHandler = (
  api: Api,
  details: RouteInfo
) => Promise<void | Api>;

export const loadRoutes = async (
  fastify: Api,
  options: {
    prefix?: string;
    dir: string;
    filter?: (file: string) => boolean;
    // Function to modify routes
  }
): Promise<Api> => {
  await fastify.register(EjectPlugin);

  // When API is ready, register our routes
  const promises = [];
  const routePath = options.dir;
  try {
    for await (const file of findFiles(routePath, ".js")) {
      const plugin = await import(file.path);
      const details: RouteInfo = {
        url: [options.prefix, filePathToEndpoint(file.path, routePath)]
          .filter(String)
          .join("/"),
        method: filePathToMethod(file.path, routePath),
        constraints: {
          version: "1.0.0",
        },
      } as const;

      promises.push(fastify.register(plugin, details));
    }
  } catch (error) {
    // this.logger.error("Failed to resolve endpoint", error);
  }

  await Promise.all(promises);

  return fastify;
};
