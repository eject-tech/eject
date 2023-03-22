import { Type } from "@sinclair/typebox";
import { example } from "./examples";
import { mediaType } from "./mediaType";
import { ref } from "./ref";
import { schema } from "./schema";

export const headerParameterBase = Type.Object({
  description: Type.Optional(Type.String({ title: "Description" })),
  required: Type.Optional(Type.Boolean({ title: "Required" })),
  deprecated: Type.Optional(Type.Boolean({ title: "Deprecated" })),
  allowEmptyValue: Type.Optional(Type.Boolean({ title: "Allow Empty Value" })),
  explode: Type.Optional(Type.Boolean({ title: "Explode" })),
  allowReserved: Type.Optional(Type.Boolean({ title: "Allow Reserved" })),
  example: Type.Optional(Type.Any({ title: "Example" })),
  examples: Type.Optional(Type.Array(Type.Union([example, ref]))),
});

export const parameterBase = Type.Intersect([
  Type.Object({
    name: Type.String({ title: "Name" }),
    in: Type.Union([
      Type.Literal("query"),
      Type.Literal("header"),
      Type.Literal("path"),
      Type.Literal("cookie"),
    ]),
  }),
  headerParameterBase,
]);

export const schemaParameter = Type.Intersect([
  parameterBase,
  Type.Object({
    schema: schema,
    // @todo: these need to be dynamic based on "in" https://spec.openapis.org/oas/latest.html#style-values
    style: Type.Optional(
      Type.Union([
        Type.Literal("matrix"),
        Type.Literal("label"),
        Type.Literal("form"),
        Type.Literal("simple"),
        Type.Literal("spaceDelimited"),
        Type.Literal("pipeDelimited"),
        Type.Literal("deepObject"),
      ])
    ),
  }),
]);

// @todo: fix header parameter recursion
// Recursion from here through to mediaType -> encoding -> header -> parameter breaks typebox
// Need to account for recursion https://github.com/sinclairzx81/typebox#types-recursive
export const parameter = Type.Intersect([
  parameterBase,
  Type.Object({
    content: mediaType,
  }),
]);
