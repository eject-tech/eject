import { Type, Static } from "@sinclair/typebox";
import { method } from "./method";
import { operation } from "./operation";
import { parameter } from "./parameter";
import { ref } from "./ref";
import { server } from "./server";

// TODO: fix formats issue
export const pathItemName = Type.String({
  $id: "pathItemName",
  title: "Path URI" /*, format: "uri"*/,
});

export type PathItemName = Static<typeof pathItemName>;

export const pathItemOperations = Type.Optional(
  Type.Record(method, Type.Optional(Type.Ref(operation)))
);

export type PathItemOperations = Static<typeof pathItemOperations>;

export const pathItem = Type.Intersect(
  [
    Type.Object({
      $ref: Type.Optional(Type.String({ title: "Reference" })),
      summary: Type.Optional(Type.String({ title: "Summary" })),
      description: Type.Optional(Type.String({ title: "Description" })),
      servers: Type.Optional(Type.Array(Type.Ref(server))),
      parameters: Type.Optional(Type.Union([Type.Ref(parameter), ref])),
    }),
    pathItemOperations,
  ],
  { $id: "pathItem" }
);

export type PathItem = Static<typeof pathItem>;
