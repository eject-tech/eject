import { Type, Static } from "@sinclair/typebox";

export const server = Type.Object(
  {
    url: Type.String({ title: "Server URL", format: "uri" }),
    description: Type.Optional(Type.String({ title: "Server Description" })),
    variables: Type.Optional(
      Type.Record(
        Type.String({ title: "Variable Name" }),
        Type.Object({
          enum: Type.Array(Type.String({ title: "Variable Enum" })),
          default: Type.Optional(Type.String({ title: "Variable Default" })),
          description: Type.Optional(
            Type.String({ title: "Variable Description" })
          ),
        })
      )
    ),
  },
  {
    $id: "server",
    title: "Server Variables",
  }
);

export type Server = Static<typeof server>;
