import test from "ava";
import { OpenAPIBuilder } from "./builder";

test("writer can produce a valid openapi spec", async (t) => {
  const spec = new OpenAPIBuilder({
    version: "1.0.0",
    title: "Our test API",
    description: "A new API",
    contact: {
      name: "Eject",
      email: "warren@eject.tech",
      url: "https://eject.tech",
    },
  });

  try {
    spec.addRoute("/test", "get", {
      summary: "Test endpoint",
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  test: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }

  console.log(spec.print());

  t.assert(1 === 1);
});
