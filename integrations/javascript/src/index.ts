import ky from "ky-universal";
import type {Options} from "ky";
import {
  Info,
  Method,
  Operation,
  PathItemName,
  schema,
} from "@eject/interface";

schema.apiKeySecuritySchema;

type KyOptionsKeys =
  | "headers"
  | "parseJson"
  | "prefixUrl"
  | "retry"
  | "timeout"
  | "hooks"
  | "throwHttpErrors";

export class EjectInterfaceAPI {
  private ky: typeof ky;

  constructor(options: Partial<Pick<Options, KyOptionsKeys>>) {
    this.ky = ky.create(options);
    return this;
  }

  api = {
    get: () => this.ky.get("api"),
    post: (info: Info) =>
      this.ky.post(`api`, { json: info }).json<{ key: string }>(),
  };

  route = {
    post: (
      key: string,
      routeDetails: {
        url: PathItemName;
        method: Method;
        operation: Operation;
      }
    ) => this.ky.post(`api/${key}/route`, { json: routeDetails }),
  };
}
