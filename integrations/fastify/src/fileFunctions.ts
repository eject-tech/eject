import path from "path";
import { promises as fs } from "fs";
import {
  DirentWithPath,
  httpMethods,
  HTTPMethods,
  RouteInfo,
} from "./plugin/routes";

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

// @todo: refactor this, it can be more readable
export const getRouteInfoFromPath = (
  filePath: string,
  routePath: string
): RouteInfo => {
  let info = {
    url: "",
    method: "GET",
  } as RouteInfo;

  // Reduce path to hierarchy less the route path and extension
  let strippedPath = filePath
    .replace(path.resolve(routePath), "")
    .split(".")
    .slice(0, -1)
    .join(".");

  const fileNameSplit: string[] =
    strippedPath.split("/").pop()?.split(".") || [];

  // Find the index of the method within the last part of the path after splitting as array
  // @ts-ignore @types/node not yet up to date with Node 18?
  const methodIndex = fileNameSplit?.findLastIndex((part: string) =>
    httpMethods.includes(part.toLocaleUpperCase() as HTTPMethods)
  );

  // If method does not exist, we can assume everything after the first part is a version constraint
  if (methodIndex === -1 && fileNameSplit?.length > 0) {
    const constraint = fileNameSplit.slice(1, fileNameSplit.length).join(".");

    if (constraint) {
      info.constraints = { version: constraint };
    }

    strippedPath =
      (strippedPath.split("/").slice(0, -1) || "").join("/") +
      "/" +
      fileNameSplit.slice(0, 1).join(".");
  }
  // If method is not last we may have constraints on the URL also
  else if (
    (methodIndex === -1 && fileNameSplit?.length > 0) ||
    methodIndex !== fileNameSplit?.length - 1
  ) {
    // If we have a method, we can assume the last part is a version constraint
    const constraint = fileNameSplit
      .slice(methodIndex + 1, fileNameSplit.length)
      .join(".");

    info.constraints = { version: constraint };
    info.method = fileNameSplit[methodIndex].toLocaleUpperCase() as HTTPMethods;

    // Join what we have back together with the method removed
    strippedPath =
      (strippedPath.split("/").slice(0, -1) || "").join("/") +
      "/" +
      fileNameSplit.slice(0, methodIndex).join(".");
  }

  // Attempt to infer method from filename eg "schema.get.ts"
  const maybeMethod = strippedPath.split(".")?.pop();
  const inferredMethod = maybeMethod?.toLocaleUpperCase();

  // If inferred method is valid, overwrite our default method
  if (httpMethods.includes(inferredMethod as HTTPMethods)) {
    info.method = inferredMethod as HTTPMethods;
    strippedPath = strippedPath.replace(`.${maybeMethod}`, "");
  }

  // Split path into parts, replace square bracket syntax with colon for easy param splitting
  const parts = strippedPath.replace(/\[([^\]]+)]/gm, ":$1").split("/");

  if (parts[0] === "routes") {
    parts.shift();
  }

  // Deduplicate folder/filenames
  info.url =
    "/" +
    parts
      .map((part, index) => {
        // If there was a previous part, and this starts with it followed by a colon, we need to properly separate for params to work
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

  return info;
};
