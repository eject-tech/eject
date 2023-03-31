import { Static, Type } from "@sinclair/typebox";
import { expression } from "./expression.js";
import { pathItem } from "./pathItem.js";
import { ref } from "./ref.js";

export const callback = Type.Record(
  expression,
  Type.Union([Type.Ref(pathItem), ref]),
  {
    $id: "callback",
  }
);

export type Callback = Static<typeof callback>;
