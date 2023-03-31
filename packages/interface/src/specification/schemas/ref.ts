import { Type, Static } from "@sinclair/typebox";

export const ref = Type.Object(
  {
    $ref: Type.String({ title: "Reference", format: "uri-reference" }),
    summary: Type.Optional(Type.String({ title: "Summary" })),
    description: Type.Optional(Type.String({ title: "Description" })),
  },
  {
    $id: "ref",
    title: "Reference",
    additionalProperties: false,
  }
);

export type Ref = Static<typeof ref>;
