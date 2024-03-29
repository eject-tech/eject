import { Type, Static } from "@sinclair/typebox";
import { externalDoc } from "./externalDoc.js";

export const tags = Type.Object(
  {
    name: Type.String({ title: "API Tag Name" }),
    description: Type.Optional(Type.String({ title: "API Tag Description" })),
    externalDocs: Type.Optional(Type.Ref(externalDoc)),
  },
  {
    $id: "#tags",
    title: "API Tags",
    additionalProperties: false,
  }
);

export type Tags = Static<typeof tags>;
