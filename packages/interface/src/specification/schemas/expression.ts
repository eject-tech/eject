import { Type, Static } from "@sinclair/typebox";

// TODO: https://spec.openapis.org/oas/latest.html#runtimeExpression
export const expression = Type.String({
  $id: "#expression",
  title: "Patterned expression",
});

export type Expression = Static<typeof expression>;
