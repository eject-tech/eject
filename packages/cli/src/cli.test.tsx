import React from "react";
import chalk from "chalk";
import test from "ava";
import { render } from "ink-testing-library";
import App from "./app.js";

test("cli runs", (t) => {
  const { lastFrame } = render(<App command={"start"} />);

  t.truthy(lastFrame());
});
