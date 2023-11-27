import { Type, Static } from "@sinclair/typebox";

export const serverVariable = Type.Object(
  {
    enum: Type.Array(Type.String({ title: "Variable Enum" })),
    default: Type.Optional(Type.String({ title: "Variable Default" })),
    description: Type.Optional(Type.String({ title: "Variable Description" })),
  },
  {
    $id: "#/$defs/server-variable",
    title: "Server Variable",
  }
);

export type ServerVariable = Static<typeof serverVariable>;
