import { Static, Type } from "@sinclair/typebox";

import { callback } from "./schemas/callback.js";
import { example } from "./schemas/example.js";
import { header } from "./schemas/header.js";
import { link } from "./schemas/link.js";
import { parameter } from "./schemas/parameter.js";
import { pathItem, pathItemName } from "./schemas/pathItem.js";
import { requestBody } from "./schemas/requestBody.js";
import { response } from "./schemas/response.js";
import { schema } from "./schemas/schema.js";
import { securityScheme } from "./schemas/securityScheme.js";
import { info } from "./schemas/info.js";
import { tags } from "./schemas/tags.js";
import { ref } from "./schemas/ref.js";
import { externalDoc } from "./schemas/externalDoc.js";
import { security } from "./schemas/security.js";
import { server } from "./schemas/server.js";

export const spec = Type.Object(
  {
    openapi: Type.Literal("3.1.0"),
    info: Type.Ref(info),
    servers: Type.Optional(
      Type.Array(Type.Ref(server), {
        title: "Servers",
        $id: "servers",
      })
    ),
    tags: Type.Optional(Type.Ref(tags)),
    externalDocs: Type.Optional(Type.Ref(externalDoc)),
    paths: Type.Record(pathItemName, Type.Ref(pathItem), {
      minProperties: 1,
    }),
    webhooks: Type.Optional(
      Type.Record(Type.String(), Type.Union([Type.Ref(pathItem), ref]))
    ),
    components: Type.Optional(
      Type.Object({
        schemas: Type.Optional(Type.Array(Type.Ref(schema))),
        responses: Type.Optional(Type.Array(Type.Ref(response))),
        parameters: Type.Optional(Type.Array(Type.Ref(parameter))),
        examples: Type.Optional(Type.Array(Type.Ref(example))),
        requestBodies: Type.Optional(Type.Array(Type.Ref(requestBody))),
        headers: Type.Optional(Type.Array(Type.Ref(header))),
        securitySchemes: Type.Optional(Type.Array(Type.Ref(securityScheme))),
        links: Type.Optional(Type.Array(Type.Ref(link))),
        callbacks: Type.Optional(Type.Array(Type.Ref(callback))),
        pathItems: Type.Optional(Type.Array(Type.Ref(pathItem))),
      })
    ),
    security: Type.Optional(Type.Ref(security)),
  },
  {
    title: "OpenAPI Specification",
    $id: "openapi",
    additionalProperties: false,
  }
);

export type Spec = Static<typeof spec>;
