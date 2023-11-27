import { Type, Static } from "@sinclair/typebox";
import { serverVariable } from "./serverVariable.js";

export const server = Type.Object(
  {
    url: Type.String({ title: "Server URL", format: "uri" }),
    description: Type.Optional(Type.String({ title: "Server Description" })),
    variables: Type.Optional(
      Type.Record(
        Type.String({ title: "Variable Name" }),
        Type.Ref(serverVariable)
      )
    ),
  },
  {
    $id: "#/$defs/server",
    title: "Server Variables",
  }
);

export type Server = Static<typeof server>;
