import type { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        description: "Health check endpoint",
        response: {
          200: {
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  status: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async () => {
      return {
        data: {
          status: "ok",
        },
      };
    },
  );
}
