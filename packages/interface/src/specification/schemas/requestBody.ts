import { Type, Static } from "@sinclair/typebox";
import { mediaType, mediaTypeKey } from "./mediaType.js";
import { ref } from "./ref.js";
import { content } from "./content.js";

export const requestBody = Type.Object(
  {
    description: Type.Optional(Type.String({ title: "Description" })),
    required: Type.Optional(
      Type.Boolean({ title: "Required", default: false })
    ),
    content: Type.Ref(content),
  },
  { $id: "#/$defs/request-body" }
);

export type RequestBody = Static<typeof requestBody>;

export const requestBodyOrReference = Type.Union(
  [Type.Ref(requestBody), Type.Ref(ref)],
  {
    $id: "#/$defs/request-body-or-reference",
  }
);

export type RequestBodyOrReference = Static<typeof requestBodyOrReference>;
