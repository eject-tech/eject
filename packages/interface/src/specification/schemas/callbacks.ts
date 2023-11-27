import { Static, Type } from "@sinclair/typebox";
import { expression } from "./expression.js";
import { pathItemOrReference } from "./pathItem.js";
import { ref } from "./ref.js";

export const callbacks = Type.Record(expression, pathItemOrReference, {
  $id: "#/$defs/callbacks",
});

export type Callbacks = Static<typeof callbacks>;

export const callbacksOrReference = Type.Union(
  [Type.Ref(ref), Type.Ref(callbacks)],
  {
    $id: "#/$defs/callbacks-or-reference",
  }
);
