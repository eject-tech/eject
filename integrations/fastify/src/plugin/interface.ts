import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

// TODO: should extend schema.operation
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

// TODO: this needs to come from schema.info - does schema need moving into a package?
type EjectInterfacePluginOptions = {
  version: string;
  title: string;
  ejectHost?: string; // defaults to EJECT_HOST or localhost:3000
};

const EjectInterfacePluginCallback: FastifyPluginAsync<
  EjectInterfacePluginOptions
> = async (fastify, options) => {
  const {
    version,
    title,
    ejectHost = process.env.EJECT_HOST || "http://localhost:3000",
  } = options;
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

    // TODO: temporary hack to work around no fastify support for onListen
    setTimeout(async () => {
      const createAPI = await fetch(`${ejectHost}/api/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version,
          title,
        }),
      });

      const response = await createAPI.json();

      console.log(response);

      for await (const route of routes) {
        await fetch(`${ejectHost}/api/${response.key}/route`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: route.url,
            method: route.method.toLowerCase(),
            operation: {
              summary: route.schema?.details.summary,
              description: route.schema?.details.description,
              parameters: ,
              requestBody: ,
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
      }

      const getAPI = await fetch(`${ejectHost}/api/${response.key}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const spec = await getAPI.json();

      console.log(JSON.stringify(spec, undefined, 2));
    }, 2500);
  });
};

export const ejectInterface = fastifyPlugin(EjectInterfacePluginCallback);
