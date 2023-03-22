import { Type } from "@sinclair/typebox";
// import { externalDocs } from "./externalDocs";

// Type this is any, given the input should be any valid JSON Schema
// Then run directly through the JSON Schema validator as is
export const schema = Type.Any({ title: "Schema" });

// export const schema = Type.Object({
//   //   discriminator: Type.Optional(Type.String({ title: "Discriminator" })),
//   externalDocs: Type.Optional(externalDocs),
//   example: Type.Optional(Type.Any({ title: "Example" })),
// });
