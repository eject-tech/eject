import { Type } from "@sinclair/typebox";

export const externalDocs = Type.Object({
  description: Type.Optional(
    Type.String({ title: "External Docs Description" })
  ),
  url: Type.String({ title: "External Docs URL", format: "uri" }),
});
