import { Type } from "@sinclair/typebox";

export const contact = Type.Object({
  name: Type.Optional(Type.String({ title: "Contact Name" })),
  url: Type.Optional(Type.String({ title: "Contact URL", format: "uri" })),
  email: Type.Optional(
    Type.String({ title: "Contact Email", format: "email" })
  ),
});
