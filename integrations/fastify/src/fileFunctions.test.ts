import test from "ava";
import { getRouteInfoFromPath } from "./fileFunctions.js";

const tests = [
  {
    input: "routes/endpoint.post.ts",
    expected: { url: "/endpoint", method: "POST" },
  },
  {
    input: "routes/endpoint/status.head.ts",
    expected: { url: "/endpoint/status", method: "HEAD" },
  },
  {
    input: "routes/endpoint/childpath/status.ts",
    expected: { url: "/endpoint/childpath/status", method: "GET" },
  },
  {
    input: "routes/endpoint/status/status.options.ts",
    expected: { url: "/endpoint/status", method: "OPTIONS" },
  },
  {
    input: "routes/endpoint/versioned/versioned.post.1.0.0.ts",
    expected: {
      url: "/endpoint/versioned",
      method: "POST",
      constraints: { version: "1.0.0" },
    },
  },
  {
    input: "routes/endpoint/getversioned/getversioned.1.0.0.ts",
    expected: {
      url: "/endpoint/getversioned",
      method: "GET",
      constraints: { version: "1.0.0" },
    },
  },
];

for (let i = 0; i < tests.length; i++) {
  const ti = tests[i];
  test(`for endpoint ${ti.input} we expect correct route info`, (t) => {
    t.deepEqual(getRouteInfoFromPath(ti.input, "routes"), ti.expected);
  });
}
