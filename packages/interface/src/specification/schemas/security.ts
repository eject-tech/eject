import { Type } from "@sinclair/typebox";

import { securitySchemeName } from "./components/securityScheme";

export const security = Type.Record(Type.String(), securitySchemeName);
