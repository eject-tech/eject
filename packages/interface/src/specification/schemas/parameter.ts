import { Type, Static } from "@sinclair/typebox";
import { example } from "./example";
import { mediaType, mediaTypeKey } from "./mediaType";
import { ref } from "./ref";
import { schema } from "./schema";

export const headerParameterBase = Type.Object(
  {
    description: Type.Optional(Type.String({ title: "Description" })),
    required: Type.Optional(Type.Boolean({ title: "Required" })),
    deprecated: Type.Optional(Type.Boolean({ title: "Deprecated" })),
    allowEmptyValue: Type.Optional(
      Type.Boolean({ title: "Allow Empty Value" })
    ),
    explode: Type.Optional(Type.Boolean({ title: "Explode" })),
    allowReserved: Type.Optional(Type.Boolean({ title: "Allow Reserved" })),
    example: Type.Optional(Type.Any({ title: "Example" })),
    examples: Type.Optional(Type.Array(Type.Union([Type.Ref(example), ref]))),
  },
  { $id: "headerParameterBase" }
);

export type HeaderParameterBase = Static<typeof headerParameterBase>;

export const parameterBase = Type.Intersect(
  [
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
  ],
  { $id: "parameterBase" }
);

export type ParameterBase = Static<typeof parameterBase>;

export const schemaParameter = Type.Intersect(
  [
    parameterBase,
    Type.Object({
      schema: Type.Ref(schema),
      // TODO: these need to be dynamic based on "in" https://spec.openapis.org/oas/latest.html#style-values
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
  ],
  { $id: "schemaParameter" }
);

export type schemaParameter = Static<typeof schemaParameter>;

// TODO: fix header parameter recursion
// Recursion from here through to mediaType -> encoding -> header -> parameter breaks typebox
// Need to account for recursion https://github.com/sinclairzx81/typebox#types-recursive
export const parameter = Type.Intersect(
  [
    parameterBase,
    Type.Object({
      content: Type.Record(mediaTypeKey, Type.Ref(mediaType)),
    }),
  ],
  { $id: "parameter" }
);

export type Parameter = Static<typeof parameter>;
