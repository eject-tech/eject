import { promises as fs } from "node:fs";
import {
  FastifyPluginAsync,
  RouteOptions,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RouteGenericInterface,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import { EjectInterfaceAPI, transformRefs } from "@eject/javascript-sdk";
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
    ejectHost = process.env.EJECT_HOST || "http://localhost:3734",
    ...apiOptions
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
  });

  // Use this hook to compile schemas once the API starts listening
  fastify.addHook("onReady", async () => {
    // TODO: Hack to work around no fastify support for onListen, raise PR?
    setTimeout(async () => {
      const { key } = await interfaceApi.api.post(apiOptions);

      // Add registered schemas to components
      const registeredSchemas = fastify.getSchemas();
      for await (const schema of Object.entries(registeredSchemas)) {
        const [schemaKey, schemaValue] = schema;
        await interfaceApi.components.post(key, "schema", {
          name: schemaKey.replace("#", ""),
          component: transformRefs(
            schemaValue,
            (ref) => `#/components/schemas/${ref.replace("#", "")}`
          ),
        });
      }

      const mapFunction =
        (target: "query" | "header" | "path" | "cookie") =>
        ([key, value]: any) => ({
          name: key,
          in: target,
          required: value.required || target === "path" ? true : false,
          description: value?.description,
          content: {
            "application/json": {
              schema: transformRefs(
                value,
                (ref) => `#/components/schemas/${ref.replace("#", "")}`
              ),
            },
          },
        });

      for await (const route of routes) {
        for await (const method of [
          ...(typeof route.method === "string" ? [route.method] : route.method),
        ]) {
          await interfaceApi.route.post(key, {
            url: route.url,
            method: method.toLowerCase() as Parameters<
              typeof interfaceApi.route.post
            >[1]["method"],
            operation: {
              summary: route.schema?.details.summary,
              description: route.schema?.details.description,
              parameters: [
                ...Object.entries(
                  route.schema?.querystring?.properties || {}
                ).map(mapFunction("query")),
                ...Object.entries(route.schema?.header?.properties || {}).map(
                  mapFunction("header")
                ),
                ...Object.entries(route.schema?.cookie?.properties || {}).map(
                  mapFunction("cookie")
                ),
                ...Object.entries(
                  // TODO: why is this not typing correctly?
                  (route.schema as any)?.params?.properties || {}
                ).map(mapFunction("path")),
              ],
              ...(!route.schema?.body
                ? {}
                : {
                    requestBody: {
                      content: {
                        "application/json": {
                          schema: transformRefs(
                            route.schema?.body,
                            (ref) =>
                              `#/components/schemas/${ref.replace("#", "")}`
                          ),
                        },
                      },
                    },
                  }),
              responses: {
                ...Object.assign(
                  {},
                  ...Object.entries(route.schema?.response || {}).map(
                    ([key, value]: any) => ({
                      [key]: {
                        description: value.title,
                        content: {
                          "application/json": {
                            schema: transformRefs(
                              value,
                              (ref) =>
                                `#/components/schemas/${ref.replace("#", "")}`
                            ),
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

      await interfaceApi.close();
    }, 2500);
  });
};

export const ejectInterface = fastifyPlugin(EjectInterfacePluginCallback);
