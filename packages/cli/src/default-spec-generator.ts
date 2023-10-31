import fs from "node:fs";

type SpecGeneratorOptions = {
  output: string;
};

export default function specGeneratorGenerator(
  { output }: SpecGeneratorOptions = { output: "eject-openapi-spec.json" }
) {
  return async function specGenerator(builders: any[]) {
    for (let specKey = 0; specKey < builders.length; specKey++) {
      const spec = builders[specKey];
      fs.writeFileSync(output, spec.print());
    }

    return true;
  };
}
