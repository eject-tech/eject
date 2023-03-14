import test from "ava";
import { filePathToEndpoint, filePathToMethod } from "./fileFunctions";

test("file path to endpoint returns valid simple paths", (t) => {
  t.assert(
    "endpoint" === filePathToEndpoint("routes/endpoint.post.ts", "routes")
  );
  t.assert(
    "endpoint/status" ===
      filePathToEndpoint("routes/endpoint/status.head.ts", "routes")
  );
  t.assert(
    "endpoint/childpath/status" ===
      filePathToEndpoint("routes/endpoint/childpath/status.ts", "routes")
  );
});

test("file path to endpoint returns valid deduplicated paths", (t) => {
  t.assert(
    "endpoint" ===
      filePathToEndpoint("routes/endpoint/endpoint.put.ts", "routes")
  );
  t.assert(
    "endpoint/status" ===
      filePathToEndpoint("routes/endpoint/status/status.options.ts", "routes")
  );
  t.assert(
    "endpoint/childpath/status" ===
      filePathToEndpoint(
        "routes/endpoint/childpath/childpath/status.ts",
        "routes"
      )
  );
});

test("file path to method returns valid method", (t) => {
  t.assert(
    "POST" === filePathToMethod("routes/endpoint/endpoint.post.ts", "routes")
  );

  t.assert(
    "GET" === filePathToMethod("routes/endpoint/endpoint.get.ts", "routes")
  );
});

test("file path to method returns default method", (t) => {
  t.assert("GET" === filePathToMethod("routes/endpoint/endpoint.ts", "routes"));
});

test("file path to method returns default method on invalid", (t) => {
  t.assert(
    "GET" ===
      filePathToMethod("routes/endpoint/endpoint.invalidmethod.ts", "routes")
  );
});
