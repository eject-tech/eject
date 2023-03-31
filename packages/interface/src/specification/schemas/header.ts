import { Type, Static } from "@sinclair/typebox";
import { headerParameterBase } from "./parameter";

// TODO: fix header parameter recursion
export const header = Type.Intersect(
  [
    headerParameterBase,
    //   Type.Object({
    //     content: mediaType,
    //   }),
  ],
  { $id: "header" }
);

export type Header = Static<typeof header>;
