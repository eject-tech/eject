import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

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

export const EjectPlugin = fastifyPlugin(EjectPluginCallback);
