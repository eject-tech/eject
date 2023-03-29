import { Type } from "@sinclair/typebox";
import { securityScheme, securitySchemeName } from "./securityScheme";

export const security = Type.Record(
  securitySchemeName,
  Type.Ref(securityScheme),
  {
    $id: "security",
  }
);
