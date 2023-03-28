import { Static } from "@sinclair/typebox";
import * as schema from "./specification";

import crypto from "crypto";

// Create an internal queue of file operations to ensure that only one operation is happening at a time
// type OmitPrivateActions = "get" | "create" | "process";
// const specQueue: Record<
//   string,
//   (typeof engine)[keyof Omit<typeof engine, OmitPrivateActions>]
// > = {};

const specifications: Record<string, Static<typeof schema.spec>> = {};

export class OpenAPIBuilder {
  protected uniqueID: string;

  protected specification: Static<typeof schema.spec>;

  constructor(specIDOrInfo: string | Static<typeof schema.info>) {
    if (typeof specIDOrInfo === "string") {
      if (!specifications[specIDOrInfo]) {
        throw new Error("Valid spec ID is required");
      }

      this.uniqueID = specIDOrInfo;
      this.specification = specifications[specIDOrInfo];

      return this;
    }

    // Create a unique ID for this spec file
    this.uniqueID = crypto.randomUUID();

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
    specifications[this.uniqueID] = this.specification;
  }

  print() {
    return JSON.stringify(this.specification, null, 2);
  }

  public addPath(
    url: Static<typeof schema.pathItemName>,
    routeMethod: Static<typeof schema.method>,
    details?: Static<typeof schema.operation>
  ) {
    if (!this.specification.paths[url]) {
      this.specification.paths[url] = {};
    }

    this.specification.paths[url] = {
      ...this.specification.paths[url],
      [routeMethod]: details,
    };

    return this;
  }
}
