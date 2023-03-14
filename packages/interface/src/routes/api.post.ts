import type { Api } from "../api";
import type { RouteHandler, RouteInfo } from "@eject/fastify";
import { Type } from "@sinclair/typebox";

// import openApiSpecs from "@apidevtools/openapi-schemas";
// const { v31 } = openApiSpecs;

export default (async (api: Api, details: RouteInfo) => {
  api.route({
    ...details,
    schema: {
      details: {
        description: "",
        summary: "Register a new API",
      },
      body: Type.Object({
        info: Type.Object(
          {
            title: Type.String({ title: "API Title" }),
            version: Type.String({ title: "API Version" }),
          },
          {
            additionalProperties: false,
            description: "API Information",
          }
        ) /* satisfies typeof v31["info"]*/,
        defaults: Type.Object({}),
      }),
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
