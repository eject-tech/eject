import { Type, Static } from "@sinclair/typebox";
import { mediaTypeKey, mediaType } from "./mediaType.js";

export const content = Type.Record(mediaTypeKey, Type.Ref(mediaType), {
  $id: "#/$defs/content",
});

export type Content = Static<typeof content>;
