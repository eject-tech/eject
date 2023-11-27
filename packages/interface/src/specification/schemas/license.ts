import { Type, Static } from "@sinclair/typebox";

export const license = Type.Object(
  {
    name: Type.String({ title: "License Name" }),
    identifier: Type.Optional(Type.String({ title: "License Identifier" })),
    url: Type.Optional(Type.String({ title: "License URL", format: "uri" })),
  },
  { $id: "#/$defs/license" }
);

export type License = Static<typeof license>;
