import type { Api } from "../../api";
import type { RouteHandler, RouteInfo } from "@eject/fastify";

export default (async (api: Api, details: RouteInfo) => {
  api.route({
    ...details,
    schema: {
      details: {
        description: "",
        summary: "Register a new endpoint",
      },
    },
    handler: async (request, reply) => {
      reply.send({ key: "true" });
    },
  });
}) satisfies RouteHandler;
