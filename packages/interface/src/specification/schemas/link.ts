import { Type } from "@sinclair/typebox";
import { expression } from "./expression";
import { server } from "./server";

export const link = Type.Object({
  operationRef: Type.Optional(Type.String({ title: "Operation Reference" })),
  operationId: Type.Optional(Type.String({ title: "Operation ID" })),
  parameters: Type.Optional(
    Type.Record(
      Type.String({ title: "Parameter" }),
      Type.Union([Type.Any(), expression], { title: "Parameter Value" })
    )
  ),
  requestBody: Type.Optional(
    Type.Union([Type.Any(), expression], { title: "Request Body" })
  ),
  description: Type.Optional(Type.String({ title: "Description" })),
  server: Type.Optional(server),
});
