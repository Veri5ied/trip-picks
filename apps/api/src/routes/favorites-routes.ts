import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../lib/auth-hook.js";

const activityIdParamSchema = {
  type: "object",
  properties: {
    activityId: { type: "string" },
  },
  required: ["activityId"],
};

const addFavoriteSchema = z.object({
  activityId: z.string().min(1),
});

export async function favoritesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/favorites", async (request) => {
    const favorites = await app.prisma.favorite.findMany({
      where: { userId: request.userId! },
      include: { activity: true },
      orderBy: { activity: { title: "asc" } },
    });

    return { data: favorites.map((f) => f.activity) };
  });

  app.post("/favorites", async (request, reply) => {
    const body = addFavoriteSchema.parse(request.body);

    await app.prisma.favorite.upsert({
      where: {
        userId_activityId: {
          userId: request.userId!,
          activityId: body.activityId,
        },
      },
      update: {},
      create: {
        userId: request.userId!,
        activityId: body.activityId,
      },
    });

    reply.status(201);
    return { data: { ok: true } };
  });

  app.delete("/favorites/:activityId", async (request, reply) => {
    const params = z.object({ activityId: z.string() }).parse(request.params);

    await app.prisma.favorite.deleteMany({
      where: {
        userId: request.userId!,
        activityId: params.activityId,
      },
    });

    return { data: { ok: true } };
  });
}
