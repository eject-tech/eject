export default {
  port: 3734,
  command: {
    exec: "node ./build/eject.js",
  },
  generators: [
    {
      name: "OpenAPI Specification Generator",
      file: "./build/default-spec-generator.js",
      options: {
        output: "build/eject-cli-spec.json",
      },
    },
  ],
};
