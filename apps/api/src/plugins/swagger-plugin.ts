import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export const swaggerPlugin = fp(async (app) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Trip Picks API",
        description:
          "API for browsing Lagos activities, saving picks, and creating day plans",
        version: "0.1.0",
      },
      servers: [{ url: "http://localhost:4000", description: "Development" }],
      tags: [
        { name: "Activities", description: "Browse and search activities" },
        { name: "Plans", description: "Create and manage day plans" },
        { name: "Health", description: "Health check" },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });
});
