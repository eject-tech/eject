import test, { ExecutionContext } from "ava";
import { spec } from "./spec.js";

test("compare official 3.1 specification with our typebox generated spec", async (t) => {
  // Download the open api spec schema.json
  const officialSpec = await fetch(
    "https://github.com/OAI/OpenAPI-Specification/raw/main/schemas/v3.1/schema.json"
  ).then((res) => res.json());

  const ejectSpecProperties = spec.properties;
  const ejectSpecDefs = spec.$defs;

  // Compare properties in the root of the specification
  for (const [key, value] of Object.entries(officialSpec.properties)) {
    // @ts-ignore
    if (!ejectSpecProperties[key]) {
      t.fail(`Key ${key} is missing from the root of our spec`);
      return;
    }

    // @ts-ignore
    compareProperty(t, value, ejectSpecProperties[key], key);
  }

  // Compare properties in the defs of the specification
  for (const [key, value] of Object.entries(officialSpec.$defs)) {
    // @ts-ignore
    if (!ejectSpecDefs[key]) {
      t.fail(`Key ${key} is missing from the defs of our spec`);
      return;
    }

    // @ts-ignore
    compareProperty(t, value, ejectSpecDefs[key], key);
  }

  // Ensure required rules match
  t.deepEqual(officialSpec.required, spec.required);
  t.deepEqual(officialSpec.anyOf, spec.anyOf);
});

const compareProperty = (
  t: ExecutionContext<unknown>,
  official: Record<string, any>,
  ours: Record<string, any>,
  path: string = ""
) => {
  for (const [key, value] of Object.entries(official)) {
    // Skip comments for now
    if (
      key === "$comment" ||
      key === "$ref" ||
      key === "unevaluatedProperties"
    ) {
      continue;
    }

    if (!ours[key]) {
      t.fail(`Key ${key} is missing from our spec at path ${path}`);
      return;
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      compareProperty(t, value, ours[key], `${path}.${key}`);
      continue;
    }

    if (Array.isArray(value)) {
      // for each item in the array, check if it exists in ours
      for (const item of value) {
        // Find this item in ours with loose matching for objects
        if (typeof item === "object") {
          const found = ours[key].find((i: any) => {
            for (const [k, v] of Object.entries(i)) {
              if (v === item[k]) {
                return true;
              }
            }
            return false;
          });

          if (!found) {
            t.fail(`Key ${key} is missing from our spec at path ${path}`);
            return;
          }

          continue;
        }

        // console.log(item, ours[key]);
        if (!ours[key].includes(item)) {
          t.fail(`Key ${key} is missing from our spec at path ${path}`);
          return;
        }
      }

      // check array length
      if (value.length !== ours[key].length) {
        t.fail(`Key ${key} is missing from our spec at path ${path}`);
        return;
      }

      continue;
    }

    // console.log(key, value, ours[key]);
    t.deepEqual(value, ours[key]);
  }
};
