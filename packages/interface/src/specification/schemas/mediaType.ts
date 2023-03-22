import { Type } from "@sinclair/typebox";
import { encoding } from "./encoding";
import { example } from "./examples";
import { ref } from "./ref";
import { schema } from "./schema";

export const mediaTypeKey = Type.String({
  title: "Media Type",
  format: "media-type",
});

export const mediaType = Type.Object({
  schema: schema,
  example: Type.Optional(Type.Any({ title: "Example" })),
  examples: Type.Optional(Type.Array(Type.Union([example, ref]))),
  encoding: Type.Optional(Type.Record(Type.String(), encoding)),
});
