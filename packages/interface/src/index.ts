import path from "path";
import eject from "@eject/fastify";
import fastify from "fastify";
import {
  TypeBoxTypeProvider,
  TypeBoxValidatorCompiler,
} from "@fastify/type-provider-typebox";

// Build an API
const start = async () => {
  // Create Fastify application
  const api = fastify({
    logger: true,
    ignoreTrailingSlash: true,
  })
    .withTypeProvider<TypeBoxTypeProvider>()
    .setValidatorCompiler(TypeBoxValidatorCompiler);

  // Register Eject routes plugin
  api.register(eject.routes, {
    // prefix: "/api",
    dir: path.join(__dirname, "routes"),
  });

  api.register(eject.hooks);

  try {
    await api.listen({ port: parseInt(process.env.PORT || "3000") });
  } catch (err) {
    api.log.error(err);
    process.exit(1);
  }
};

start();
