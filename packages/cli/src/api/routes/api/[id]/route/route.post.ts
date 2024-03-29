import type { Api } from "../../../../api.js";
import type { RouteInfo } from "@eject/fastify";
import { Type } from "@sinclair/typebox";
import {
  OpenAPIBuilder,
  pathItemName,
  method,
  operation,
} from "@eject/interface";

export default async (api: Api, details: RouteInfo) => {
  api.route({
    ...details,
    schema: {
      details: {
        description: "",
        summary: "Register a new endpoint",
      },
      body: Type.Object({
        url: pathItemName,
        method: method,
        operation: operation,
      }),
      params: Type.Object({
        id: Type.String(),
      }),
      response: {
        200: Type.Object({}),
      },
    },
    handler: async (request: any, reply: any) => {
      const openAPI = new OpenAPIBuilder(request.params.id);

      openAPI.addRoute(
        request.body.url,
        request.body.method,
        request.body.operation
      );

      reply.send();
    },
  });
};
