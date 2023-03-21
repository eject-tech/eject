import { Type } from "@sinclair/typebox";
import { externalDocs } from "./externalDocs";

export const tags = Type.Object(
  {
    name: Type.String({ title: "API Tag Name" }),
    description: Type.Optional(Type.String({ title: "API Tag Description" })),
    externalDocs: Type.Optional(externalDocs),
  },
  {
    title: "API Tags",
    $id: "tags",
    additionalProperties: false,
  }
);
