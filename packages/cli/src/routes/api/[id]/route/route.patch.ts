import type { Api } from "../../../../api";
import type { RouteHandler, RouteInfo } from "@eject/fastify";
import { Type } from "@sinclair/typebox";

export default (async (
  api: Api,
  details: RouteInfo
) => {}) satisfies RouteHandler;
