import { Type, Static } from "@sinclair/typebox";
import { headerParameterBase } from "./parameter.js";

// TODO: fix header parameter recursion
export const header = Type.Intersect(
  [
    headerParameterBase,
    //   Type.Object({
    //     content: mediaType,
    //   }),
  ],
  { $id: "#/$defs/header" }
);

export type Header = Static<typeof header>;

export const headerOrReference = Type.Union(
  [Type.Ref(header), Type.Ref("#/$defs/header")],
  {
    $id: "#/$defs/header-or-reference",
  }
);

export type HeaderOrReference = Static<typeof headerOrReference>;
