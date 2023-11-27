import { Type, Static } from "@sinclair/typebox";
import { header } from "./header.js";
import { link } from "./link.js";
import { mediaTypeKey, mediaType } from "./mediaType.js";
import { ref } from "./ref.js";
import { content } from "./content.js";

export const response = Type.Object(
  {
    description: Type.Optional(Type.String({ title: "Description" })),
    headers: Type.Optional(
      Type.Record(Type.String(), Type.Union([Type.Ref(header), Type.Ref(ref)]))
    ),
    content: Type.Ref(content),
    links: Type.Optional(
      Type.Record(Type.String(), Type.Union([Type.Ref(link), Type.Ref(ref)]))
    ),
  },
  { $id: "#/$defs/response" }
);

export type Response = Static<typeof response>;

export const responseOrReference = Type.Union(
  [Type.Ref(response), Type.Ref(ref)],
  {
    $id: "#/$defs/response-or-reference",
  }
);

export type ResponseOrReference = Static<typeof responseOrReference>;
