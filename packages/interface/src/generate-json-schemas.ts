import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as schema from "./specification/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  fs.mkdirSync(path.join(__dirname, "..", "json"));
} catch (error) {}

Object.entries(schema).forEach(([key, value]) => {
  // Write each value to a JSON file
  fs.writeFileSync(
    path.join(__dirname, "..", "json", `${key}.json`),
    JSON.stringify(value, null, 2)
  );
});
