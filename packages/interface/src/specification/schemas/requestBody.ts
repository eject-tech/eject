import { Type } from "@sinclair/typebox";
import { mediaType, mediaTypeKey } from "./mediaType";

export const requestBody = Type.Object({
  description: Type.Optional(Type.String({ title: "Description" })),
  required: Type.Optional(Type.Boolean({ title: "Required", default: false })),
  content: Type.Record(mediaTypeKey, mediaType),
});
