<p align="center" style="margin: 2rem 0;">
    <img src="./eject-logo.svg" height="128" alt="Eject logo which is a morphed eject button symbol in crayola red">
</p>

This monorepo is a collection of open-source API tools which power the Eject platform and correspondingly developed Eject applications. They encourage faster and stricter API development in accordance with our engineering mantra of "build with, not on".

Want to know more about the Eject platform and how it can help you collaboratively build best in class APIs? Head over to [eject.tech](https://eject.tech). Have questions or want to chat to us about the project? Reach out to us on Twitter [@geteject](https://twitter.com/geteject) or use our contact form [eject.tech/contact](https://eject.tech/contact).

---

**These tools are still in active development and subject to a first release, there will be ongoing breaking changes until then. Sign up to our waitlist at [eject.tech](https://eject.tech) to be notified of product updates.**

---

## Why use these API tools?

- **Language & Framework Agnostic**: Ejects tools empower you to build best in class APIs with any language and framework.
- **Enforced API Principles**: Ejects tools help you build with strong API principles such as versioning, strict validation, and more.
- **Generated Packages**: Ejects tools let you generate packages for your API consumers, such as SDKs, documentation, and more.
- **Project Starters**: Get started with Eject quickly using our range of project stubs, covering major languages and frameworks.

## Getting Started

We're working on our broader documentation which will cover integration with existing projects, writing your own generators, and more. In the meantime, you can take a look at our project stubs at [./starters/](./starters/) and our [CLI documentation](./packages/cli/README.md).

## Packages

Packages within this monorepo are separated into 4 categories; "packages", "integrations", "generators", and "starters"

## Packages

**Packages:**

Core packages for Eject tooling.

- [@eject/config](./packages/config/): Shared config files for utilisation in Eject packages; both internal and third-party.
- [@eject/cli](./packages/cli/): Command-line interface for developing and building Eject applications and publishing generated packages.
- [@eject/interface](./packages/interface/): Interface for Eject applications, used by the CLI and other packages.

**Integrations:**

Packages for integrating Eject with specific tools and frameworks.

- [@eject/fastify](./integrations/fastify/): Fastify plugin for Eject applications.

**Generators:**

Generators for outputting packages from Eject applications.

- [@eject/generate-spec](./generators/openapi/): Generator for an OpenAPI 3.1 specification.
- [@eject/generate-sdk](./generators/axios-sdk/): Generator for a typesafe Axios SDK.
- [@eject/generate-docs](./generators/docs/): Generator for a documentation site.

**Starters:**

Project starters for getting up and running with Eject quickly.

We aim to deliver on all of the following criteria with our starter kits:

- **File based routing**: Just create files, no need to register endpoints.
- **End-to-end type safety**: Where the language supports it, code should be type-safe.
- **Full use of Eject features**: Integrating with all of Eject's features, such as versioning, validation, and more.

- [TypeScript](./templates/typescript/): Stub for an Eject TypeScript project, the default when using `eject init`.

## Contributing

This monorepo is built using [turborepo](https://turborepo.org/) and uses [pnpm](https://pnpm.io) as a package manager. Please use these tools when contributing.

To run this project locally we recommend the following steps:

- Clone the repository to a local folder
- Install dependencies with `pnpm i`
- Open a terminal/shell window and run `pnpm dev` to build and watch all packages

We welcome contributions to this project, please read our [contributing guidelines](./CONTRIBUTING.md) before submitting a pull request.

Pull requests will require an accompanying [changeset](https://github.com/atlassian/changesets) to be added to the pull request. To add a changeset, run the following command:

```bash
pnpm changeset
```

If you wish to push a change which does not make any changes to packages, you can add the `--empty` flag to the command above.
