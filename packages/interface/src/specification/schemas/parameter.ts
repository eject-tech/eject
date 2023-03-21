import { Type } from "@sinclair/typebox";

export const parameter = Type.Object({
  name: Type.String({ title: "Name" }),
  in: Type.Union([
    Type.Literal("query"),
    Type.Literal("header"),
    Type.Literal("path"),
    Type.Literal("cookie"),
  ]),
  description: Type.Optional(Type.String({ title: "Description" })),
  required: Type.Optional(Type.Boolean({ title: "Required" })),
  deprecated: Type.Optional(Type.Boolean({ title: "Deprecated" })),
  allowEmptyValue: Type.Optional(Type.Boolean({ title: "Allow Empty Value" })),
  // @todo: https://spec.openapis.org/oas/latest.html#parameter-object
  /*
  For more complex scenarios, the content property can define the media type and
  schema of the parameter. A parameter MUST contain either a schema property, or a
  content property, but not both. When example or examples are provided in conjunction
  with the schema object, the example MUST follow the prescribed serialization strategy
  for the parameter.
  */
});
