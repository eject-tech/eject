<p align="center" style="margin: 2rem 0;">
    <img src="./eject-logo.svg" height="128" alt="Eject logo depicting a sketched eject button icon and typeface">
</p>

This monorepo is a collection of open-source API tools which power the Eject platform and correspondingly developed Eject applications. They encourage faster and stricter API development in accordance with our engineering mantra of "build with, not on".

Want to know more about the Eject platform and how it can help you build best in class APIs? Head over to [geteject.com](https://geteject.com). Have questions or want to chat to us about the project? Reach out to us on Twitter at [@geteject](https://twitter.com/geteject).

<hr />

## Why use these API tools?

- **Language & Framework Agnostic**: Ejects CLI tools enable you to build best in class APIs with any language and framework.
- **Enforced API Principles**: Ejects CLI tools let you enforce strong API principles such as versioning, strict validation, and more.
- **Generated Packages**: Ejects CLI tools let you generate packages for your API consumers, such as SDKs, documentation, and more.
- **Project Starters**: Get started with Eject quickly using our range of project stubs, covering major languages and frameworks.

## Getting Started

Want to know more about Eject, setup or integrate a project, or browse our documentation? Head over to the dedicated site at [cli.geteject.com](https://cli.geteject.com/) or click one of the links below.

- [About Eject](https://cli.geteject.com/about)
- [Building your first project](https://cli.geteject.com/getting-started)
- [Project starters](https://cli.geteject.com/starters)
- [Writing generators](https://cli.geteject.com/generators)

## Packages

Packages within this monorepo are separated into 4 categories; "packages", "integrations", "generators", and "starters". Packages contains everything core to Eject such as the CLI and interface, whilst generators has Eject maintained output generators, and starters help you to get up and running with Eject quickly.

## Packages

**Packages:**

- [@eject/config](./packages/config/): Shared config files for utilisation in Eject packages; both internal and third-party.
- [@eject/cli](./packages/cli/): Command-line interface for developing and building Eject applications and publishing generated packages.
- [@eject/interface](./packages/interface/): Interface for Eject applications, used by the CLI and other packages.

**Integrations:**

- [@eject/fastify](./integrations/fastify/): Fastify plugin for Eject applications.

**Generators:**

- [@eject/generate-spec](./generators/openapi/): Generator for an OpenAPI 3.1 specification.
- [@eject/generate-sdk](./generators/axios-sdk/): Generator for a typesafe Axios SDK.
- [@eject/generate-docs](./generators/docs/): Generator for a documentation site.

**Starters:**
We aim to deliver on all of the following criteria with our starter kits:

- **File based routing**: Just create files, no need to register endpoints.
- **End-to-end type safety**: Typescript first validation for end-to-end type safety, thanks to [zod](https://github.com/colinhacks/zod).
- **Full use of Eject features**: Integrating with all of Eject's features, such as versioning, validation, and more.
- [TypeScript](./templates/typescript/): Stub for an Eject TypeScript project, the default when using `eject init`.

## Contributing

This monorepo is built using [turborepo](https://turborepo.org/) and uses [pnpm](https://pnpm.io) as a package manager. Please use these tools when contributing.

To run this project locally we recommend the following steps:

- Clone the repository to a local folder
- Install dependencies with `pnpm i`
- Open a terminal/shell window and run `pnpm dev` to build and watch all packages

## Tools

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
