import type { Api } from "../api";
import type { RouteHandler, RouteInfo } from "@eject/fastify";
import { Type } from "@sinclair/typebox";

import { info } from "../specification/schemas/info";

export default (async (api: Api, details: RouteInfo) => {
  api.route({
    ...details,
    schema: {
      details: {
        description: "",
        summary: "Register a new API",
      },
      body: info,
      response: {
        200: Type.Object(
          {
            key: Type.String({
              title: "API Key",
              description: "Unique identifier for the API",
            }),
          },
          {
            title: "Valid request",
          }
        ),
      },
    },
    handler: async (request, reply) => {
      // Create the API in the local database
      reply.send({ key: "true" });
    },
  });
}) satisfies RouteHandler;
