import { Static, Type } from "@sinclair/typebox";

import { pathItem, pathItemName } from "./schemas/pathItem.js";
import { info } from "./schemas/info.js";
import { tags } from "./schemas/tags.js";
import { ref } from "./schemas/ref.js";
import { externalDoc } from "./schemas/externalDoc.js";
import { security } from "./schemas/security.js";
import { server } from "./schemas/server.js";
import { components } from "./schemas/component.js";

export const spec = Type.Object(
  {
    openapi: Type.Literal("3.1.0"),
    info: Type.Ref(info),
    servers: Type.Optional(
      Type.Array(Type.Ref(server), {
        title: "Servers",
        $id: "#servers",
      })
    ),
    tags: Type.Optional(Type.Ref(tags)),
    externalDocs: Type.Optional(Type.Ref(externalDoc)),
    paths: Type.Record(pathItemName, Type.Ref(pathItem), {
      minProperties: 1,
    }),
    webhooks: Type.Optional(
      Type.Record(
        Type.String(),
        Type.Union([Type.Ref(pathItem), Type.Ref(ref)])
      )
    ),
    components: Type.Optional(Type.Ref(components)),
    security: Type.Optional(Type.Ref(security)),
  },
  {
    title: "OpenAPI Specification",
    additionalProperties: false,
  }
);

export type Spec = Static<typeof spec>;
