import Fastify from "fastify";
import cookie from "@fastify/cookie";
import { activitiesRoutes } from "./routes/activities-routes.js";
import { healthRoutes } from "./routes/health-routes.js";
import { plansRoutes } from "./routes/plans-routes.js";
import { authRoutes } from "./routes/auth-routes.js";
import { favoritesRoutes } from "./routes/favorites-routes.js";
import { corsPlugin } from "./plugins/cors-plugin.js";
import { prismaPlugin } from "./plugins/prisma-plugin.js";
import { sensiblePlugin } from "./plugins/sensible-plugin.js";
import { swaggerPlugin } from "./plugins/swagger-plugin.js";
import { formatErrorResponse } from "./lib/errors.js";
import { env } from "./lib/env.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.setErrorHandler((error, _request, reply) => {
    const response = formatErrorResponse(error);

    reply.status(response.statusCode).send({
      error: response.error,
    });
  });

  app.addHook("onRequest", async (request) => {
    request.userId = request.cookies.userId;
  });

  await app.register(sensiblePlugin);
  await app.register(corsPlugin);
  await app.register(cookie, { secret: env.COOKIE_SECRET });
  await app.register(prismaPlugin);
  await app.register(swaggerPlugin);

  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(favoritesRoutes);
  await app.register(activitiesRoutes);
  await app.register(plansRoutes);

  return app;
}
