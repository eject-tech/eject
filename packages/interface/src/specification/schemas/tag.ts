import { Type, Static } from "@sinclair/typebox";
import { externalDoc } from "./externalDoc.js";

export const tag = Type.Object(
  {
    name: Type.String({ title: "API Tag Name" }),
    description: Type.Optional(Type.String({ title: "API Tag Description" })),
    externalDocs: Type.Optional(Type.Ref(externalDoc)),
  },
  {
    $id: "#/$defs/tag",
    title: "API Tag",
    additionalProperties: false,
  }
);

export type Tag = Static<typeof tag>;
