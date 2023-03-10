import path from "path";
import { promises as fs } from "fs";
import { DirentWithPath, httpMethods, HTTPMethods } from "./plugin/routes";

/**
 * Recursively search a directory for files
 * @param path Path to search for files
 * @param extension Only return files matching this extension
 */
export async function* findFiles(
  searchPath = `./`,
  extension = ".js"
): AsyncIterableIterator<DirentWithPath> {
  const entries = await fs.readdir(searchPath, { withFileTypes: true });

  for (const file of entries) {
    if (file.isDirectory()) {
      yield* findFiles(path.resolve(searchPath, file.name), extension);
    } else if (file.name.endsWith(extension)) {
      yield {
        ...file,
        path: path.resolve(searchPath, file.name),
      } as DirentWithPath;
    }
  }
}

/**
 * Infer API endpoint from file path
 * @param path filepath to infer route from
 * @returns inferred route
 */
export const filePathToEndpoint = (
  filePath: string,
  routePath: string
): string => {
  const strippedPath = reduceFileName(filePath, routePath);

  // Split path into parts, replace square bracket syntax with colon for easy param splitting
  const parts = strippedPath.replace(/\[([^\]]+)]/gm, ":$1").split("/");

  if (parts[0] === "routes") {
    parts.shift();
  }

  // Deduplicate folder/filenames
  const route = parts
    .map((part, index) => {
      // If there was a previous part, and this starts with it followed by a colon, we need to properly seperate for params to work
      if (parts[index - 1] && part.startsWith(`${parts[index - 1]}:`)) {
        return part.replace(":", "/:");
      }

      // No further parts after this, return as is
      if (!parts[index + 1]) return part;

      // If the next part starts with the current part, omit the current part (return null)
      return parts[index + 1].startsWith(part) ? null : part;
    })
    // Filter out the omitted, null parts
    .filter((part) => part !== null)
    // Reconstitute the path
    .join("/");

  // Strip the method and any parameters from the route string
  return route.replace(/\[.*?\]+/g, "").replace(/\..*$/g, "");
};

export const filePathToMethod = (
  filePath: string,
  routePath: string
): HTTPMethods => {
  // Set the default method to GET
  let method: HTTPMethods = "GET";

  const strippedPath = reduceFileName(filePath, routePath);

  // Attempt to infer method from filename eg "schema.get.ts"
  const inferredMethod = strippedPath.split(".")?.pop()?.toLocaleUpperCase();

  // If inferred method is valid, overwrite our default method
  if (httpMethods.includes(inferredMethod as HTTPMethods)) {
    method = inferredMethod as HTTPMethods;
  }
  return method;
};

const reduceFileName = (filePath: string, routePath: string): string => {
  return filePath
    .replace(path.resolve("src", routePath), "")
    .split(".")
    .slice(0, -1) // Remove extension
    .join(".");
};
