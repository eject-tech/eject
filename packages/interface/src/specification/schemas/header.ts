import { Type } from "@sinclair/typebox";
import { headerParameterBase } from "./parameter";

// @todo: fix header parameter recursion
export const header = Type.Intersect([
  headerParameterBase,
  //   Type.Object({
  //     content: mediaType,
  //   }),
]);
