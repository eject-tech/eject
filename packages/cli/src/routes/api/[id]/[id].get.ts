import { Api } from "../../../api.js";
import type { RouteHandler, RouteInfo } from "@eject/fastify";
import { Type } from "@sinclair/typebox";

import { OpenAPIBuilder, schema } from "@eject/interface";

export default (async (api: Api, details: RouteInfo) => {
  api.route({
    ...details,
    schema: {
      details: {
        description: "",
        summary: "Get the specification for you API",
      },
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        200: Type.String(),
      },
    },
    handler: async (request, reply) => {
      // Create the API in the local database
      const openAPI = new OpenAPIBuilder(request.params.id);

      // Return the spec
      reply.send(openAPI.print());
    },
  });
}) satisfies RouteHandler;
