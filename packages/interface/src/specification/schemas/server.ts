import { Type } from "@sinclair/typebox";

export const server = Type.Object(
  {
    url: Type.String({ title: "Server URL", format: "uri" }),
    description: Type.Optional(Type.String({ title: "Server Description" })),
    variables: Type.Optional(
      Type.Enum(
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
    title: "Server Variables",
  }
);

export const servers = Type.Array(server, {
  title: "Servers",
  $id: "servers",
});
