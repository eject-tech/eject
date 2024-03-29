import { Type, Static } from "@sinclair/typebox";
import { header } from "./header.js";
import { ref } from "./ref.js";

export const encoding = Type.Object(
  {
    contentType: Type.Optional(Type.String({ title: "Content Type" })),
    // TODO: this breaks typebox compiler for fastify, recursion fix may resolve
    // headers: Type.Optional(
    //   Type.Record(Type.String(), Type.Union([Type.Ref(header), Type.Ref(ref)]))
    // ),
    style: Type.Optional(Type.String({ title: "Style" })),
    explode: Type.Optional(Type.Boolean({ title: "Explode" })),
    allowReserved: Type.Optional(Type.Boolean({ title: "Allow Reserved" })),
  },
  { $id: "#encoding" }
);

export type Encoding = Static<typeof encoding>;
