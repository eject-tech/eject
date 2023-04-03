import { Type, Static } from "@sinclair/typebox";
import { license } from "./license.js";
import { contact } from "./contact.js";

export const info = Type.Object(
  {
    version: Type.String({ title: "API Version" }),
    title: Type.String({ title: "API Title" }),
    description: Type.Optional(Type.String({ title: "API Description" })),
    termsOfService: Type.Optional(
      Type.String({ title: "API Terms of Service", format: "uri" })
    ),
    contact: Type.Optional(Type.Ref(contact)),
    license: Type.Optional(Type.Ref(license)),
  },
  {
    $id: "#info",
    title: "API Information",
    additionalProperties: false,
  }
);

export type Info = Static<typeof info>;
