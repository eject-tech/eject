import { Type, Static } from "@sinclair/typebox";
import { encoding } from "./encoding.js";
import { example } from "./example.js";
import { ref } from "./ref.js";
import { schema } from "./schema.js";

export const mediaTypeKey = Type.String({
  $id: "#mediaTypeKey",
  title: "Media Type",
  format: "media-type",
});

export type MediaTypeKey = Static<typeof mediaTypeKey>;

export const mediaType = Type.Object(
  {
    schema: Type.Ref(schema),
    example: Type.Optional(Type.Any({ title: "Example" })),
    examples: Type.Optional(
      Type.Array(Type.Union([Type.Ref(example), Type.Ref(ref)]))
    ),
    encoding: Type.Optional(Type.Record(Type.String(), Type.Ref(encoding))),
  },
  { $id: "#mediaType" }
);

export type MediaType = Static<typeof mediaType>;
