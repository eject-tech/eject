import { Type } from "@sinclair/typebox";

export const example = Type.Object(
  {
    summary: Type.Optional(Type.String({ title: "Summary" })),
    description: Type.Optional(Type.String({ title: "Description" })),
    value: Type.Optional(Type.Any({ title: "Value" })),
    externalValue: Type.Optional(Type.String({ title: "External Value" })),
  },
  { $id: "example" }
);
