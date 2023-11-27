import { Static, Type } from "@sinclair/typebox";

import { info } from "./schemas/info.js";
import { tag } from "./schemas/tag.js";
import { externalDoc } from "./schemas/externalDoc.js";
import { server } from "./schemas/server.js";
import { components } from "./schemas/component.js";
import { paths } from "./schemas/paths.js";
import { securityRequirement } from "./schemas/securityRequirement.js";
import { contact } from "./schemas/contact.js";
import { license } from "./schemas/license.js";
import { serverVariable } from "./schemas/serverVariable.js";
import { pathItem, pathItemOrReference } from "./schemas/pathItem.js";
import { operation } from "./schemas/operation.js";
import { parameter, parameterOrReference } from "./schemas/parameter.js";
import { requestBody, requestBodyOrReference } from "./schemas/requestBody.js";
import { mediaType } from "./schemas/mediaType.js";
import { encoding } from "./schemas/encoding.js";
import { response, responseOrReference } from "./schemas/response.js";
import { responses } from "./schemas/responses.js";
import { callbacks, callbacksOrReference } from "./schemas/callbacks.js";
import { example, exampleOrReference } from "./schemas/example.js";
import { link, linkOrReference } from "./schemas/link.js";
import { header, headerOrReference } from "./schemas/header.js";
import { ref } from "./schemas/ref.js";
import { schema } from "./schemas/schema.js";
import {
  securityScheme,
  securitySchemeOrReference,
} from "./schemas/securityScheme.js";
import { content } from "./schemas/content.js";
import { examples } from "./schemas/examples.js";
import { mapOfStrings } from "./schemas/mapOfStrings.js";

const defs = {
  info,
  contact,
  license,
  server,
  "server-variable": serverVariable,
  components,
  paths,
  "path-item": pathItem,
  "path-item-or-reference": pathItemOrReference,
  operation,
  "external-documentation": externalDoc,
  parameter,
  "parameter-or-reference": parameterOrReference,
  requestBody,
  "request-body-or-reference": requestBodyOrReference,
  content,
  mediaType,
  encoding,
  responses,
  response,
  "response-or-reference": responseOrReference,
  callbacks,
  "callbacks-or-reference": callbacksOrReference,
  example,
  "example-or-reference": exampleOrReference,
  link,
  "link-or-reference": linkOrReference,
  header,
  "header-or-reference": headerOrReference,
  tag,
  reference: ref,
  schema,
  "security-scheme": securityScheme,
  "security-schema-or-reference": securitySchemeOrReference,
  // "oauth-flows": oauthFlows,
  "security-requirement": securityRequirement,
  // "specification-extensions": specificationExtensions,
  examples: examples,
  "map-of-strings": mapOfStrings,
  // "styles-for-form": stylesForForm,
};

export const spec = Type.Object(
  {
    openapi: Type.String({
      title: "OpenAPI Version",
      pattern: "^3\\.1\\.\\d+(-.+)?$",
      examples: ["3.1.0"],
    }),
    info: Type.Ref(info),
    jsonSchemaDialect: Type.Optional(
      Type.String({
        title: "JSON Schema Dialect",
        format: "uri",
        default: "https://spec.openapis.org/oas/3.1/dialect/base",
      })
    ),
    servers: Type.Optional(
      Type.Array(Type.Ref(server), {
        title: "Servers",
        default: [{ url: "/" }],
        $id: "#/$defs/servers",
      })
    ),
    tags: Type.Optional(Type.Array(Type.Ref(tag))),
    externalDocs: Type.Optional(Type.Ref(externalDoc)),
    paths: Type.Optional(Type.Ref(paths)),
    webhooks: Type.Optional(
      Type.Object(
        {},
        {
          additionalProperties: Type.Ref(pathItemOrReference),
        }
      )
    ),
    components: Type.Optional(Type.Ref(components)),
    security: Type.Optional(Type.Array(Type.Ref(securityRequirement))),
  },
  {
    title: "OpenAPI Specification",
    additionalProperties: false,
    unevaluatedProperties: false,
    anyOf: [
      {
        required: ["paths"],
      },
      {
        required: ["components"],
      },
      {
        required: ["webhooks"],
      },
    ],
    $ref: "#/$defs/specification-extensions",
    $defs: defs,
  }
);

export type Spec = Static<typeof spec>;
