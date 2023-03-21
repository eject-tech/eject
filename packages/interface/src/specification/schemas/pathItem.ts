import { Type } from "@sinclair/typebox";
import { method } from "./method";
import { parameter } from "./parameter";
import { ref } from "./ref";
import { server } from "./server";

export const pathItemName = Type.String({ title: "Path URI", format: "uri" });

export const pathItemOperations = Type.Record(method, Type.Object({}));

export const pathItem = Type.Intersect([
  Type.Object({
    $ref: Type.Optional(Type.String({ title: "Reference" })),
    summary: Type.Optional(Type.String({ title: "Summary" })),
    description: Type.Optional(Type.String({ title: "Description" })),
    servers: Type.Optional(Type.Array(server)),
    parameters: Type.Optional(Type.Union([parameter, ref])),
  }),
  pathItemOperations,
]);
