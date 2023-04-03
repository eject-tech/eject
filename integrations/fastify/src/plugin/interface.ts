import {
  FastifyPluginAsync,
  RouteOptions,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RouteGenericInterface,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import { EjectInterfaceAPI } from "@eject/javascript-sdk";
import { TSchema } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

interface EjectSpecDetails {
  description: string;
  summary: string;
  tags?: string[];
}

// Enforce schema requirements on routes for spec generation
declare module "fastify" {
  interface FastifySchema {
    details: EjectSpecDetails;
  }
}

type EjectInterfacePluginOptions = Parameters<
  EjectInterfaceAPI["api"]["post"]
>[0] & {
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

  type EjectRouteOption = RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression,
    RouteGenericInterface,
    unknown,
    TSchema & { details: EjectSpecDetails },
    TypeBoxTypeProvider
  >;

  const routes: EjectRouteOption[] = [];

  const interfaceApi = new EjectInterfaceAPI({
    prefixUrl: ejectHost,
  });

  // Use this hook to fire off our schemas etc
  fastify.addHook("onRoute", (routeOptions: EjectRouteOption) => {
    routes.push(routeOptions);
    console.log("Route registered: ", routeOptions.url, routeOptions.method);
  });

  // Use this hook to compile schemas once the API starts listening
  fastify.addHook("onReady", async () => {
    // Compile schemas

    // TODO: Hack to work around no fastify support for onListen, raise PR?
    setTimeout(async () => {
      const { key } = await interfaceApi.api.post({ version, title });

      for await (const route of routes) {
        for await (const method of [
          ...(typeof route.method === "string" ? [route.method] : route.method),
        ]) {
          console.log(route);

          await interfaceApi.route.post(key, {
            url: route.url,
            method: method.toLowerCase() as Parameters<
              typeof interfaceApi.route.post
            >[1]["method"],
            operation: {
              summary: route.schema?.details.summary,
              description: route.schema?.details.description,
              // parameters: [
              //   ...route.schema?.params,
              // ],
              // requestBody: ,
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
          });
        }
      }
    }, 2500);
  });
};

export const ejectInterface = fastifyPlugin(EjectInterfacePluginCallback);
