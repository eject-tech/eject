import { Type, Static } from "@sinclair/typebox";
import { callback } from "./callback.js";
import { example } from "./example.js";
import { header } from "./header.js";
import { link } from "./link.js";
import { method } from "./method.js";
import { operation } from "./operation.js";
import { parameter } from "./parameter.js";
import { pathItem } from "./pathItem.js";
import { ref } from "./ref.js";
import { requestBody } from "./requestBody.js";
import { response } from "./response.js";
import { schema } from "./schema.js";
import { securityScheme } from "./securityScheme.js";
import { server } from "./server.js";

export const componentType = Type.Union(
  [
    Type.Literal("schema"),
    Type.Literal("response"),
    Type.Literal("parameter"),
    Type.Literal("example"),
    Type.Literal("requestBody"),
    Type.Literal("header"),
    Type.Literal("securityScheme"),
    Type.Literal("link"),
    Type.Literal("callback"),
    Type.Literal("pathItem"),
  ],
  {
    $id: "#componentType",
    title: "Component Type",
  }
);

export type ComponentType = Static<typeof componentType>;

export const schemaComponent = Type.Ref(schema);
export const responseComponent = Type.Ref(response);
export const parameterComponent = Type.Ref(parameter);
export const exampleComponent = Type.Ref(example);
export const requestBodyComponent = Type.Ref(requestBody);
export const headerComponent = Type.Ref(header);
export const securitySchemeComponent = Type.Ref(securityScheme);
export const linkComponent = Type.Ref(link);
export const callbackComponent = Type.Ref(callback);
export const pathItemComponent = Type.Ref(pathItem);

export type SchemasComponent = Static<typeof schemaComponent>;
export type ResponsesComponent = Static<typeof responseComponent>;
export type ParametersComponent = Static<typeof parameterComponent>;
export type ExamplesComponent = Static<typeof exampleComponent>;
export type RequestBodyComponent = Static<typeof requestBodyComponent>;
export type HeadersComponent = Static<typeof headerComponent>;
export type SecuritySchemesComponent = Static<typeof securitySchemeComponent>;
export type LinksComponent = Static<typeof linkComponent>;
export type CallbacksComponent = Static<typeof callbackComponent>;
export type PathItemsComponent = Static<typeof pathItemComponent>;

export const component = Type.Union([
  schemaComponent,
  responseComponent,
  parameterComponent,
  exampleComponent,
  requestBodyComponent,
  headerComponent,
  securitySchemeComponent,
  linkComponent,
  callbackComponent,
  pathItemComponent,
]);

export type Component = Static<typeof component>;

export const componentName = Type.String({
  $id: "#componentName",
  format: "regex",
  pattern: "^[a-zA-Z0-9\\-\\.]+$",
});

export type ComponentName = Static<typeof componentName>;

export const components = Type.Object(
  {
    schemas: Type.Optional(Type.Record(componentName, schemaComponent)),
    responses: Type.Optional(Type.Record(componentName, responseComponent)),
    parameters: Type.Optional(Type.Record(componentName, parameterComponent)),
    examples: Type.Optional(Type.Record(componentName, exampleComponent)),
    requestBodies: Type.Optional(
      Type.Record(componentName, requestBodyComponent)
    ),
    headers: Type.Optional(Type.Record(componentName, headerComponent)),
    securitySchemes: Type.Optional(
      Type.Record(componentName, securitySchemeComponent)
    ),
    links: Type.Optional(Type.Record(componentName, linkComponent)),
    callbacks: Type.Optional(Type.Record(componentName, callbackComponent)),
    pathItems: Type.Optional(Type.Record(componentName, pathItemComponent)),
  },
  { $id: "#components", title: "Components" }
);

export type Components = Static<typeof components>;

export const componentPluralMap = {
  schema: "schemas",
  response: "responses",
  parameter: "parameters",
  example: "examples",
  requestBody: "requestBodies",
  header: "headers",
  securityScheme: "securitySchemes",
  link: "links",
  callback: "callbacks",
  pathItem: "pathItems",
} as const;

export type ComponentPluralMap = typeof componentPluralMap;
