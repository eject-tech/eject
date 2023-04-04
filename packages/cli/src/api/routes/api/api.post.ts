import type { Api } from "../../api.js";
import type { RouteInfo } from "@eject/fastify";
import { Type } from "@sinclair/typebox";

import * as schema from "@eject/interface";
import { OpenAPIBuilder } from "@eject/interface";

export default async (api: Api, details: RouteInfo) => {
  api.route({
    ...details,
    schema: {
      details: {
        description: "",
        summary: "Register a new API",
      },
      body: schema.info,
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
      const openAPI = new OpenAPIBuilder(request.body);

      openAPI.save();

      // Return the ID of the API
      reply.send({ key: openAPI.key });
    },
  });
};
