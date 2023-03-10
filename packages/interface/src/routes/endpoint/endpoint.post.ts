import type { Api, RouteHandler, RouteInfo } from "../../api";

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
