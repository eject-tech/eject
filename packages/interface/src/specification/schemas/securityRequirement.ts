import { Type, Static } from "@sinclair/typebox";
import { securityScheme, securitySchemeName } from "./securityScheme.js";

export const securityRequirement = Type.Record(Type.String(), Type.String(), {
  $id: "#/$defs/security-requirement",
});

export type SecurityRequirement = Static<typeof securityRequirement>;
