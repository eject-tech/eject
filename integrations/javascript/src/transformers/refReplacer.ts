export const transformRefs = (
  obj: any,
  transformer: (ref: string) => string
) => {
  const refKey = "$ref";

  if (typeof obj === "object") {
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        transformRefs(obj[key], transformer);
      } else if (typeof obj[key] === "string" && key === refKey) {
        obj[key] = transformer(obj[key]);
      }
    }
  }

  return obj;
};
