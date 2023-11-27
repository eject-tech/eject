import { Type, Static } from "@sinclair/typebox";
import { pathItemName, pathItem } from "./pathItem.js";

export const paths = Type.Record(pathItemName, Type.Ref(pathItem), {
  minProperties: 1,
  $id: "#/$defs/paths",
});

export type Paths = Static<typeof paths>;
