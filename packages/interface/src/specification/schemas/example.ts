import { Type, Static } from "@sinclair/typebox";
import { ref } from "./ref.js";

export const example = Type.Object(
  {
    summary: Type.Optional(Type.String({ title: "Summary" })),
    description: Type.Optional(Type.String({ title: "Description" })),
    value: Type.Optional(Type.Any({ title: "Value" })),
    externalValue: Type.Optional(Type.String({ title: "External Value" })),
  },
  { $id: "#/$defs/example" }
);

export type Example = Static<typeof example>;

export const exampleOrReference = Type.Union(
  [Type.Ref(example), Type.Ref(ref)],
  { $id: "#/$defs/example-or-reference" }
);

export type ExampleOrReference = Static<typeof exampleOrReference>;
