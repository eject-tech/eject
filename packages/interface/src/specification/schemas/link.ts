import { Type, Static } from "@sinclair/typebox";
import { expression } from "./expression.js";
import { server } from "./server.js";

export const link = Type.Object(
  {
    operationRef: Type.Optional(Type.String({ title: "Operation Reference" })),
    operationId: Type.Optional(Type.String({ title: "Operation ID" })),
    parameters: Type.Optional(
      Type.Record(
        Type.String({ title: "Parameter" }),
        Type.Union([Type.Any(), Type.Ref(expression)], {
          title: "Parameter Value",
        })
      )
    ),
    requestBody: Type.Optional(
      Type.Union([Type.Any(), Type.Ref(expression)], { title: "Request Body" })
    ),
    description: Type.Optional(Type.String({ title: "Description" })),
    server: Type.Optional(Type.Ref(server)),
  },
  { $id: "#link" }
);

export type Link = Static<typeof link>;
