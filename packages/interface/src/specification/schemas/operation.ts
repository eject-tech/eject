import { Type } from "@sinclair/typebox";
import { callback } from "./callback";
import { externalDoc } from "./externalDoc";
import { parameter } from "./parameter";
import { ref } from "./ref";
import { requestBody } from "./requestBody";
import { response } from "./response";
import { security } from "./security";
import { server } from "./server";

export const operation = Type.Object(
  {
    tags: Type.Optional(Type.Array(Type.String({ title: "Tag" }))),
    summary: Type.Optional(Type.String({ title: "Summary" })),
    description: Type.Optional(Type.String({ title: "Description" })),
    externalDocs: Type.Optional(Type.Ref(externalDoc)),
    operationId: Type.Optional(Type.String({ title: "Operation ID" })),
    parameters: Type.Optional(Type.Array(Type.Ref(parameter))),
    requestBody: Type.Optional(Type.Ref(requestBody)),
    responses: Type.Record(
      Type.Number(),
      Type.Union([Type.Ref(response), ref])
    ),
    // TODO: recursive issue
    // callbacks: Type.Record(
    //   Type.String({ title: "Callback" }),
    //   Type.Ref(callback)
    // ),
    deprecated: Type.Optional(Type.Boolean({ title: "Deprecated" })),
    security: Type.Optional(Type.Ref(security)),
    servers: Type.Optional(Type.Array(Type.Ref(server))),
  },
  { $id: "operation" }
);
