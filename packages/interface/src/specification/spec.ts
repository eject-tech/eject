import { Type } from "@sinclair/typebox";

import { callback } from "./schemas/callback";
import { example } from "./schemas/examples";
import { header } from "./schemas/header";
import { link } from "./schemas/link";
import { parameter } from "./schemas/parameter";
import { pathItem, pathItemName } from "./schemas/pathItem";
import { requestBody } from "./schemas/requestBody";
import { response } from "./schemas/response";
import { schema } from "./schemas/schema";
import { securityScheme } from "./schemas/securityScheme";
import { info } from "./schemas/info";
import { tags } from "./schemas/tags";
import { ref } from "./schemas/ref";
import { externalDocs } from "./schemas/externalDocs";
import { security } from "./schemas/security";
import { server } from "./schemas/server";

export const spec = Type.Object(
  {
    info: Type.Required(info),
    servers: Type.Optional(
      Type.Array(server, {
        title: "Servers",
        $id: "servers",
      })
    ),
    tags: Type.Optional(tags),
    externalDocs: Type.Optional(externalDocs),
    paths: Type.Record(pathItemName, pathItem, {
      minProperties: 1,
    }),
    webhooks: Type.Record(Type.String(), Type.Union([pathItem, ref])),
    components: Type.Optional(
      Type.Object({
        schemas: Type.Optional(Type.Array(schema)),
        responses: Type.Optional(Type.Array(response)),
        parameters: Type.Optional(Type.Array(parameter)),
        examples: Type.Optional(Type.Array(example)),
        requestBodies: Type.Optional(Type.Array(requestBody)),
        headers: Type.Optional(Type.Array(header)),
        securitySchemes: Type.Optional(Type.Array(securityScheme)),
        links: Type.Optional(Type.Array(link)),
        callbacks: Type.Optional(Type.Array(callback)),
        pathItems: Type.Optional(Type.Array(pathItem)),
      })
    ),
    security: Type.Optional(security),
  },
  {
    title: "OpenAPI Specification",
    $id: "openapi",
    additionalProperties: false,
  }
);
