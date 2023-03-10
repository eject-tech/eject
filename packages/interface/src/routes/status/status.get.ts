import type { Api } from "../../api";
import type { RouteHandler, RouteInfo } from "@eject/fastify";
import { Type } from "@sinclair/typebox";

export default (async (api: Api, details: RouteInfo) => {
  api.route({
    ...details,
    schema: {
      details: {
        description: "",
        tags: ["status"],
        summary: "Get the status of the Eject interface API",
      },
      querystring: Type.Object({
        succint: Type.Boolean({}),
      }),
      response: {
        200: Type.Object(
          {
            status: Type.String(),
            uptime: Type.Number(),
          },
          {
            title: "Valid request",
            description: "This is the response for a valid request",
            examples: [
              {
                status: "Available",
                uptime: 0,
              },
            ],
          }
        ),
      },
    },
    handler: (request, reply) => {
      reply.send({ status: "Available", uptime: process.uptime() });
    },
  });
}) satisfies RouteHandler;
