import { Type } from "@sinclair/typebox";
import { callback } from "./callback";
import { externalDocs } from "./externalDocs";
import { parameter } from "./parameter";
import { ref } from "./ref";
import { requestBody } from "./requestBody";
import { response } from "./response";
import { security } from "./security";
import { server } from "./server";

export const operation = Type.Object({
  tags: Type.Optional(Type.Array(Type.String({ title: "Tag" }))),
  summary: Type.Optional(Type.String({ title: "Summary" })),
  description: Type.Optional(Type.String({ title: "Description" })),
  externalDocs: Type.Optional(externalDocs),
  operationId: Type.Optional(Type.String({ title: "Operation ID" })),
  parameters: Type.Optional(Type.Array(parameter)),
  requestBody: Type.Optional(requestBody),
  responses: Type.Union([ref, response]),
  callbacks: Type.Record(Type.String({ title: "Callback" }), callback),
  deprecated: Type.Optional(Type.Boolean({ title: "Deprecated" })),
  security: security,
  servers: Type.Optional(Type.Array(server)),
});
