import { Type } from "@sinclair/typebox";
import { parameter } from "./parameter";

export const header = Type.Omit(parameter, ["in", "name"]);
