import { Type } from "@sinclair/typebox";

import { callbacks } from "./schemas/components/callbacks";
import { examples } from "./schemas/components/examples";
import { headers } from "./schemas/components/headers";
import { links } from "./schemas/components/links";
import { parameters } from "./schemas/components/parameters";
import { pathItems } from "./schemas/components/pathItems";
import { requestBodies } from "./schemas/components/requestBodies";
import { responses } from "./schemas/components/responses";
import { schemas } from "./schemas/components/schemas";
import { securitySchemes } from "./schemas/components/securitySchemes";
import { info } from "./schemas/info";
import { servers } from "./schemas/server";
import { tags } from "./schemas/tags";

export const spec = Type.Object(
  {
    info: Type.Required(info),
    servers: Type.Optional(servers),
    tags: Type.Optional(tags),
    components: Type.Optional(
      Type.Object({
        schemas: Type.Optional(schemas),
        responses: Type.Optional(responses),
        parameters: Type.Optional(parameters),
        examples: Type.Optional(examples),
        requestBodies: Type.Optional(requestBodies),
        headers: Type.Optional(headers),
        securitySchemes: Type.Optional(securitySchemes),
        links: Type.Optional(links),
        callbacks: Type.Optional(callbacks),
        pathItems: Type.Optional(pathItems),
      })
    ),
    paths: Type.Required(pathItems),
  },
  {
    title: "OpenAPI Specification",
    $id: "openapi",
    additionalProperties: false,
  }
);
