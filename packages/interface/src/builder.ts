import { Static } from "@sinclair/typebox";
import * as schema from "./specification/index.js";

import crypto from "crypto";
import { Spec } from "./specification/index.js";
import {
  Component,
  componentPluralMap,
  ComponentType,
} from "./specification/schemas/component.js";

// Create an internal queue of file operations to ensure that only one operation is happening at a time
// type OmitPrivateActions = "get" | "create" | "process";
// const specQueue: Record<
//   string,
//   (typeof engine)[keyof Omit<typeof engine, OmitPrivateActions>]
// > = {};

const specifications: Record<string, Static<typeof schema.spec>> = {};

export class OpenAPIBuilder {
  public readonly key: string;
  public readonly specification: Static<typeof schema.spec>;

  constructor(specIDOrInfo: string | Static<typeof schema.info>) {
    if (typeof specIDOrInfo === "string") {
      if (!specifications[specIDOrInfo]) {
        throw new Error("Valid spec ID is required");
      }

      this.key = specIDOrInfo;
      this.specification = specifications[specIDOrInfo];

      return this;
    }

    // Create a unique ID for this spec file
    this.key = crypto.randomUUID();

    this.specification = {
      openapi: "3.1.0",
      info: specIDOrInfo,
      paths: {},
    };

    // return the unique ID
    return this;
  }

  save() {
    // Write the info to a new OpenAPI spec
    specifications[this.key] = this.specification;
  }

  spec() {
    return this.specification;
  }

  print() {
    return JSON.stringify(this.specification, null, 2);
  }

  public addRoute(
    url: Static<typeof schema.pathItemName>,
    routeMethod: Static<typeof schema.method>,
    details?: Static<typeof schema.operation>
  ) {
    if (!this.specification.paths) {
      this.specification.paths = {};
    }

    if (!this.specification.paths[url]) {
      this.specification.paths[url] = {};
    }

    this.specification.paths[url] = {
      ...this.specification.paths[url],
      [routeMethod]: details,
    };

    return this;
  }

  public addComponent(
    componentType: ComponentType,
    name: string,
    component: Component
  ) {
    if (!this.specification.components) {
      this.specification.components = {} as const;
    }

    const pluralisedType = componentPluralMap[componentType];

    if (!this.specification.components[pluralisedType]) {
      this.specification.components[pluralisedType] = {};
    }

    if (this.specification.components[pluralisedType]) {
      // TODO: resolve this ts-ignore issue
      //@ts-ignore
      this.specification.components[pluralisedType][name] = component;
    }

    return `#/components/${componentType}/${name}`;
  }
}

export const getAllBuilders: () => OpenAPIBuilder[] = () => {
  return Object.keys(specifications).map((spec) => new OpenAPIBuilder(spec));
};
