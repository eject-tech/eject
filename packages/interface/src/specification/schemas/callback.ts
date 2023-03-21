import { Type } from "@sinclair/typebox";
import { expression } from "./expression";
import { pathItem } from "./pathItem";
import { ref } from "./ref";

export const callback = Type.Record(expression, Type.Union([pathItem, ref]));
