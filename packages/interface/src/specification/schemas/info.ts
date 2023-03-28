import { Type } from "@sinclair/typebox";
import { license } from "./license";
import { contact } from "./contact";

export const info = Type.Object(
  {
    version: Type.String({ title: "API Version" }),
    title: Type.String({ title: "API Title" }),
    description: Type.Optional(Type.String({ title: "API Description" })),
    termsOfService: Type.Optional(
      Type.String({ title: "API Terms of Service", format: "uri" })
    ),
    contact: Type.Optional(contact),
    license: Type.Optional(license),
  },
  {
    title: "API Information",
    $id: "info",
    additionalProperties: false,
  }
);
