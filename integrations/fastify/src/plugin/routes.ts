import { FastifyInstance } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import { Dirent } from "node:fs";
import { findFiles, getRouteInfoFromPath } from "../fileFunctions.js";

export interface DirentWithPath extends Dirent {
  path: string;
}

export const httpMethods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
  "PROPFIND",
  "PROPPATCH",
  "MKCOL",
  "COPY",
  "MOVE",
  "LOCK",
  "UNLOCK",
  "TRACE",
] as const;

export type HTTPMethods = (typeof httpMethods)[number];

export type RouteInfo = {
  url: string;
  method: HTTPMethods;
  constraints: {
    version?: string;
    host?: string;
  };
};

export type RouteHandler = (
  api: FastifyInstance,
  details: RouteInfo
) => Promise<void | FastifyInstance>;

export const importRoutes = async (
  fastify: FastifyInstance,
  options: {
    prefix?: string;
    dir: string;
    filter?: (file: string) => boolean;
    // Function to modify routes
  }
): Promise<FastifyInstance> => {
  // When API is ready, register our routes
  const promises = [];
  const routePath = options.dir;
  try {
    for await (const file of findFiles(routePath, ".js")) {
      const plugin = await import(file.path);
      const routeInfo = getRouteInfoFromPath(file.path, routePath);

      promises.push(fastify.register(plugin, routeInfo));
    }
  } catch (error) {
    // this.logger.error("Failed to resolve endpoint", error);
  }

  await Promise.all(promises);

  return fastify;
};

export const routes = fastifyPlugin(importRoutes);
