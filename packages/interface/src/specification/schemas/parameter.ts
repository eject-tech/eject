import { Type, Static } from "@sinclair/typebox";
import { example } from "./example.js";
import { mediaType, mediaTypeKey } from "./mediaType.js";
import { ref } from "./ref.js";
import { schema } from "./schema.js";
import { content } from "./content.js";

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
    examples: Type.Optional(
      Type.Array(Type.Union([Type.Ref(example), Type.Ref(ref)]))
    ),
  },
  { $id: "#/$defs/headerParameterBase" }
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
  { $id: "#/$defs/parameterBase" }
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
  { $id: "#/$defs/schemaParameter" }
);

export type schemaParameter = Static<typeof schemaParameter>;

// TODO: fix header parameter recursion
// Recursion from here through to mediaType -> encoding -> header -> parameter breaks typebox
// Need to account for recursion https://github.com/sinclairzx81/typebox#types-recursive
export const parameter = Type.Intersect(
  [
    parameterBase,
    Type.Object({
      content: Type.Ref(content),
    }),
  ],
  { $id: "#/$defs/parameter" }
);

export type Parameter = Static<typeof parameter>;

export const parameterOrReference = Type.Union(
  [Type.Ref(parameter), Type.Ref(ref)],
  { $id: "#/$defs/parameterOrReference" }
);

export type ParameterOrReference = Static<typeof parameterOrReference>;
