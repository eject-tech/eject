import React from "react";
import test from "ava";
import { render } from "ink-testing-library";
import App from "./app.js";

test("cli runs", (t) => {
  const { lastFrame } = render(<App command={"start"} />);

  t.truthy(lastFrame());
});
