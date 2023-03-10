import { FastifyInstance } from "fastify";
import fastifyPlugin = require("fastify-plugin");
import { Dirent } from "fs";
import {
  findFiles,
  filePathToEndpoint,
  filePathToMethod,
} from "../fileFunctions";

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
  // Load in the Eject plugin for registering schemas over the interface
  // await fastify.register(EjectPlugin);

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

export const routes = fastifyPlugin(importRoutes);
