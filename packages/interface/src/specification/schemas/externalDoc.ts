import { Type, Static } from "@sinclair/typebox";

export const externalDoc = Type.Object(
  {
    description: Type.Optional(
      Type.String({ title: "External Doc Description" })
    ),
    url: Type.String({ title: "External Doc URL", format: "uri" }),
  },
  { $id: "externalDoc" }
);

export type ExternalDoc = Static<typeof externalDoc>;
