import type { Api } from "../../../../../api.js";
import type { RouteInfo } from "@eject/fastify";
import { Type } from "@sinclair/typebox";

import {
  OpenAPIBuilder,
  component,
  componentName,
  componentType,
} from "@eject/interface";

export default async (api: Api, details: RouteInfo) => {
  api.route({
    ...details,
    schema: {
      details: {
        description: "",
        summary: "Define a component for reuse in your API",
      },
      params: Type.Object({
        id: Type.String(),
        componentType: componentType,
      }),
      body: Type.Object({ name: componentName, component: component }),
      response: {
        200: Type.Object({
          path: Type.String(),
        }),
      },
    },
    handler: async (request, reply) => {
      if (!request.body.component.$id) {
        throw new Error("Component must have an $id");
      }

      const openAPI = new OpenAPIBuilder(request.params.id);

      // Add the component
      const path = openAPI.addComponent(
        request.params.componentType,
        request.body.name,
        request.body.component
      );

      // Return the spec
      reply.send({
        path,
      });
    },
  });
};
