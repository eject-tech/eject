import { Type } from "@sinclair/typebox";
import { header } from "./header";
import { ref } from "./ref";

export const encoding = Type.Object({
  contentType: Type.Optional(Type.String({ title: "Content Type" })),
  headers: Type.Optional(Type.Record(Type.String(), Type.Union([header, ref]))),
  style: Type.Optional(Type.String({ title: "Style" })),
  explode: Type.Optional(Type.Boolean({ title: "Explode" })),
  allowReserved: Type.Optional(Type.Boolean({ title: "Allow Reserved" })),
});