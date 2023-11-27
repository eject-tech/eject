import { Type, Static } from "@sinclair/typebox";
import { securityScheme, securitySchemeName } from "./securityScheme.js";

export const security = Type.Record(
  securitySchemeName,
  Type.Ref(securityScheme),
  {
    $id: "#/$defs/security",
  }
);

export type Security = Static<typeof security>;
