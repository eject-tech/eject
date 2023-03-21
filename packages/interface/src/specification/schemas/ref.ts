import { Type } from "@sinclair/typebox";

export const ref = Type.Object(
  {
    $ref: Type.String({ title: "Reference", format: "uri-reference" }),
    summary: Type.Optional(Type.String({ title: "Summary" })),
    description: Type.Optional(Type.String({ title: "Description" })),
  },
  {
    title: "Reference",
    additionalProperties: false,
  }
);
