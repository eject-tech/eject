import ky from "ky-universal";
import type { Options } from "ky";
import {
  Info,
  Method,
  Operation,
  PathItemName,
  Component,
  ComponentType,
} from "@eject/interface";

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

  close = () => this.ky.post("close").json<{ success: true }>();

  api = {
    get: (key: string) => this.ky.get(`api/${key}`).json<any>(),
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

  components = {
    post: (key: string, componentType: ComponentType, component: Component) => {
      return this.ky.post(`api/${key}/components/${componentType}`, {
        json: component,
      });
    },
  };
}
