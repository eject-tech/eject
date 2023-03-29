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
    },
  },
})
  .withTypeProvider<TypeBoxTypeProvider>()
  .setValidatorCompiler(TypeBoxValidatorCompiler);

export type Api = typeof api;
