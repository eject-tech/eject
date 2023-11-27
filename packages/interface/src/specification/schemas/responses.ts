import { Type, Static } from "@sinclair/typebox";
import { responseOrReference } from "./response.js";

export const responses = Type.Composite(
  [
    Type.Object(
      {
        default: responseOrReference,
      },
      Type.Record(Type.RegExp("^[1-5](?:[0-9]{2}|XX)$"), responseOrReference)
    ),
  ],
  { $id: "#/$defs/responses" }
);

export type Responses = Static<typeof responses>;
