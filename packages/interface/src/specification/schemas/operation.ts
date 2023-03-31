import { Type, Static } from "@sinclair/typebox";
import { callback } from "./callback.js";
import { externalDoc } from "./externalDoc.js";
import { parameter } from "./parameter.js";
import { ref } from "./ref.js";
import { requestBody } from "./requestBody.js";
import { response } from "./response.js";
import { security } from "./security.js";
import { server } from "./server.js";

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

export type Operation = Static<typeof operation>;
