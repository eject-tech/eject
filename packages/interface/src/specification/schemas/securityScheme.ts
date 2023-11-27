import { Type, Static } from "@sinclair/typebox";
import { type } from "os";
import { ref } from "./ref.js";

export const securitySchemeType = Type.Union(
  [
    Type.Literal("apiKey"),
    Type.Literal("http"),
    Type.Literal("oauth2"),
    Type.Literal("openIdConnect"),
  ],
  { $id: "#/$defs/securitySchemeType" }
);

export type SecuritySchemeType = Static<typeof securitySchemeType>;

export const securitySchemeName = Type.String({
  $id: "#/$defs/securitySchemeName",
  title: "Security Scheme Name",
});

export type SecuritySchemeName = Static<typeof securitySchemeName>;

export const apiKeySecuritySchema = Type.Object(
  {
    type: Type.Literal("apiKey"),
    in: Type.Union([
      Type.Literal("query"),
      Type.Literal("header"),
      Type.Literal("cookie"),
    ]),
  },
  { $id: "#/$defs/apiKeySecuritySchema" }
);

export type ApiKeySecuritySchema = Static<typeof apiKeySecuritySchema>;

export const httpSecurityScheme = Type.Object(
  {
    type: Type.Literal("http"),
    scheme: Type.Union([
      Type.Literal("basic"),
      Type.Literal("bearer"),
      Type.Literal("digest"),
      Type.Literal("hoba"),
      Type.Literal("mutual"),
      Type.Literal("negotiate"),
      Type.Literal("oauth"),
      Type.Literal("scram-sha-1"),
      Type.Literal("scram-sha-256"),
      Type.Literal("vapid"),
    ]),
    bearerFormat: Type.Optional(Type.String({ title: "Bearer Format" })), // TODO: Should also be conditional on scheme being "bearer"
  },
  { $id: "#/$defs/httpSecurityScheme" }
);

export type HttpSecurityScheme = Static<typeof httpSecurityScheme>;

export const oauthSecurityScheme = Type.Object(
  {
    type: Type.Literal("oauth2"),
    flows: Type.Object({
      implicit: Type.Optional(
        Type.Object({
          authorizationUrl: Type.String({
            title: "Authorization URL",
            format: "uri",
          }),
          refreshUrl: Type.Optional(
            Type.String({ title: "Refresh URL", format: "uri" })
          ),
          scopes: Type.Record(Type.String(), Type.String({ title: "Scope" })),
        })
      ),
      password: Type.Optional(
        Type.Object({
          tokenUrl: Type.String({ title: "Token URL", format: "uri" }),
          refreshUrl: Type.Optional(
            Type.String({ title: "Refresh URL", format: "uri" })
          ),
          scopes: Type.Record(Type.String(), Type.String({ title: "Scope" })),
        })
      ),
      clientCredentials: Type.Optional(
        Type.Object({
          tokenUrl: Type.String({ title: "Token URL", format: "uri" }),
          refreshUrl: Type.Optional(
            Type.String({ title: "Refresh URL", format: "uri" })
          ),
          scopes: Type.Record(Type.String(), Type.String({ title: "Scope" })),
        })
      ),
      authorizationCode: Type.Optional(
        Type.Object({
          authorizationUrl: Type.String({
            title: "Authorization URL",
            format: "uri",
          }),
          tokenUrl: Type.String({ title: "Token URL", format: "uri" }),
          refreshUrl: Type.Optional(
            Type.String({ title: "Refresh URL", format: "uri" })
          ),
          scopes: Type.Record(Type.String(), Type.String({ title: "Scope" })),
        })
      ),
    }),
  },
  { $id: "#/$defs/oauthSecurityScheme" }
);

export type OauthSecurityScheme = Static<typeof oauthSecurityScheme>;

export const openIdConnectSecurityScheme = Type.Object(
  {
    type: Type.Literal("openIdConnect"),
    openIdConnectUrl: Type.String({
      title: "OpenID Connect URL",
      format: "uri",
    }),
  },
  { $id: "#/$defs/openIdConnectSecurityScheme" }
);

export type OpenIdConnectSecurityScheme = Static<
  typeof openIdConnectSecurityScheme
>;

export const securitySchemeBase = Type.Object(
  {
    type: securitySchemeType,
    description: Type.Optional(Type.String({ title: "Description" })),
  },
  { $id: "#/$defs/securitySchemeBase" }
);

export type SecuritySchemeBase = Static<typeof securitySchemeBase>;

export const securityScheme = Type.Union(
  [
    securitySchemeBase,
    Type.Union([
      apiKeySecuritySchema,
      httpSecurityScheme,
      oauthSecurityScheme,
      openIdConnectSecurityScheme,
    ]),
  ],
  { $id: "#/$defs/securityScheme" }
);

export type SecurityScheme = Static<typeof securityScheme>;

export const securitySchemeOrReference = Type.Union(
  [Type.Ref(securityScheme), Type.Ref(ref)],
  {
    $id: "#/$defs/securitySchemeOrReference",
  }
);

export type SecuritySchemeOrReference = Static<
  typeof securitySchemeOrReference
>;
