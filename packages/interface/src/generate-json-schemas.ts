import fs from "fs";
import path from "path";
import * as schema from "./specification";

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
