import type { PrismaClient } from "../generated/prisma/client.js";
import { notFound } from "../lib/errors.js";
import type { ActivityQuery } from "../schemas/activities-schemas.js";

export async function listActivities(
  prisma: PrismaClient,
  filters: ActivityQuery,
) {
  const q = filters.q?.trim();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const skip = (page - 1) * limit;

  const where = {
    category: filters.category
      ? { equals: filters.category, mode: "insensitive" as const }
      : undefined,
    area: filters.area
      ? { equals: filters.area, mode: "insensitive" as const }
      : undefined,
    priceLevel: filters.priceLevel ?? undefined,
    OR: q
      ? [
          { title: { contains: q, mode: "insensitive" as const } },
          { category: { contains: q, mode: "insensitive" as const } },
          { area: { contains: q, mode: "insensitive" as const } },
          { tags: { has: q.toLowerCase() } },
        ]
      : undefined,
  };

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      orderBy: { title: "asc" },
      skip,
      take: limit,
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    data: activities,
    meta: {
      count: activities.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getActivityById(prisma: PrismaClient, id: string) {
  const activity = await prisma.activity.findUnique({
    where: {
      id,
    },
  });

  if (!activity) {
    throw notFound("Activity not found");
  }

  return activity;
}
