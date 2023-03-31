import { Type, Static } from "@sinclair/typebox";
import { header } from "./header.js";
import { link } from "./link.js";
import { mediaTypeKey, mediaType } from "./mediaType.js";
import { ref } from "./ref.js";

export const response = Type.Object(
  {
    description: Type.Optional(Type.String({ title: "Description" })),
    headers: Type.Optional(
      Type.Record(Type.String(), Type.Union([Type.Ref(header), ref]))
    ),
    content: Type.Record(mediaTypeKey, Type.Ref(mediaType)),
    links: Type.Optional(
      Type.Record(Type.String(), Type.Union([Type.Ref(link), ref]))
    ),
  },
  { $id: "response" }
);

export type Response = Static<typeof response>;
