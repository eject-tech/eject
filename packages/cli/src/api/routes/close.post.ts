import type { Api } from "../api.js";
import type { RouteInfo } from "@eject/fastify";
import { Type } from "@sinclair/typebox";

import * as schema from "@eject/interface";

export default async (api: Api, details: RouteInfo) => {
  api.route({
    ...details,
    schema: {
      details: {
        description: "",
        summary: "Close the Eject API Interfaces",
      },
      response: {
        200: Type.Object(
          {
            success: Type.Literal(true),
          },
          {
            title: "Interface close received",
          }
        ),
      },
    },
    handler: async (request, reply) => {
      await reply.send({ success: true });
      api.close();
    },
  });
};
