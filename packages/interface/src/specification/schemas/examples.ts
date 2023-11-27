import { Type } from "@sinclair/typebox";
import { exampleOrReference } from "./example.js";

export const examples = Type.Object(
  {
    example: Type.Literal(true),
    examples: Type.Ref(exampleOrReference),
  },
  {
    $id: "#/$defs/examples",
  }
);
