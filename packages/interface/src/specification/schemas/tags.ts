import { Type, Static } from "@sinclair/typebox";
import { externalDoc } from "./externalDoc";

export const tags = Type.Object(
  {
    name: Type.String({ title: "API Tag Name" }),
    description: Type.Optional(Type.String({ title: "API Tag Description" })),
    externalDocs: Type.Optional(externalDoc),
  },
  {
    $id: "tags",
    title: "API Tags",
    additionalProperties: false,
  }
);

export type Tags = Static<typeof tags>;
