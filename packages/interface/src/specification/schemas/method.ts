import { Type, Static } from "@sinclair/typebox";

export const method = Type.Union(
  [
    Type.Literal("get"),
    Type.Literal("put"),
    Type.Literal("post"),
    Type.Literal("delete"),
    Type.Literal("options"),
    Type.Literal("head"),
    Type.Literal("patch"),
    Type.Literal("trace"),
  ],
  { $id: "#method" }
);

export type Method = Static<typeof method>;
