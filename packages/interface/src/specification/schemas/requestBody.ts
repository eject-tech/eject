import { Type, Static } from "@sinclair/typebox";
import { mediaType, mediaTypeKey } from "./mediaType.js";

export const requestBody = Type.Object(
  {
    description: Type.Optional(Type.String({ title: "Description" })),
    required: Type.Optional(
      Type.Boolean({ title: "Required", default: false })
    ),
    content: Type.Record(mediaTypeKey, Type.Ref(mediaType)),
  },
  { $id: "requestBody" }
);

export type RequestBody = Static<typeof requestBody>;
