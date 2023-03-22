import { Type } from "@sinclair/typebox";
import { header } from "./header";
import { link } from "./link";
import { mediaTypeKey, mediaType } from "./mediaType";
import { ref } from "./ref";

export const response = Type.Object({
  description: Type.Optional(Type.String({ title: "Description" })),
  headers: Type.Optional(Type.Record(Type.String(), Type.Union([header, ref]))),
  content: Type.Record(mediaTypeKey, mediaType),
  links: Type.Optional(Type.Record(Type.String(), Type.Union([link, ref]))),
});
