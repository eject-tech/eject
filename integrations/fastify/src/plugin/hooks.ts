import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
// import { fetch } from "undici";

type SpecDetails = {
  description: string;
  summary: string;
  tags?: string[];
};

// Enforce schema requirements on routes for spec generation
declare module "fastify" {
  interface FastifySchema {
    details: SpecDetails;
  }
}

const EjectPluginCallback: FastifyPluginAsync = async (fastify, options) => {
  const routes: any[] = [];

  // Use this hook to fire off our schemas etc
  fastify.addHook("onRoute", (routeOptions) => {
    routes.push(routeOptions);
    console.log("Route registered: ", routeOptions.url, routeOptions.method);
  });

  // Use this hook to compile schemas once the API starts listening
  fastify.addHook("onReady", async () => {
    // Compile schemas
    console.log("Compiling schemas...");
    console.log(routes);

    const createAPI = await fetch(`http://localhost:3000/api/`, {
      method: "POST",
      body: JSON.stringify({
        version: "1.0.0",
        title: "Our brand spanking new API",
      }),
    });

    const response = await createAPI.json();

    routes.forEach(async (route) => {
      await fetch(`http://localhost:3000/api/${response.key}/route`, {
        method: "POST",
        body: JSON.stringify({
          url: route.url,
          method: route.method,
          operation: {
            summary: route.schema?.details.summary,
            description: route.schema?.details.description,
            responses: {
              ...Object.assign(
                {},
                ...Object.entries(route.schema?.response || {}).map(
                  ([key, value]: any) => ({
                    [key]: {
                      description: value.title,
                      content: {
                        "application/json": {
                          schema: value,
                        },
                      },
                    },
                  })
                )
              ),
            },
          },
        }),
      });
    });
  });
};

export const hooks = fastifyPlugin(EjectPluginCallback);
