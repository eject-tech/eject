import { Static, Type } from "@sinclair/typebox";

export const mapOfStrings = Type.Record(Type.String(), Type.String(), {
  $id: "#/$defs/map-of-strings",
  title: "Map of Strings",
});

export type MapOfStrings = Static<typeof mapOfStrings>;
