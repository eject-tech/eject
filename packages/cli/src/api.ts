import fastify from "fastify";
import {
  TypeBoxTypeProvider,
  TypeBoxValidatorCompiler,
} from "@fastify/type-provider-typebox";

// Create Fastify application
export const api = fastify({
  logger: true,
  ignoreTrailingSlash: true,
  ajv: {
    customOptions: {
      removeAdditional: true,
      uriResolver: undefined,
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();
// .setValidatorCompiler(TypeBoxValidatorCompiler);
// TODO: The above line breaks schema validation/derefencing. Do we need it? Remove?
export type Api = typeof api;
