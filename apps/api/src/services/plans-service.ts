import type { PrismaClient, Prisma } from "../generated/prisma/client.js";
import type {
  PlanInclude,
  PlanGetPayload,
} from "../generated/prisma/models/Plan.js";
import { badRequest, notFound } from "../lib/errors.js";
import { createId } from "../lib/id.js";
import type {
  CreatePlanInput,
  UpdatePlanInput,
} from "../schemas/plans-schemas.js";

const planInclude = {
  planActivities: {
    orderBy: {
      position: "asc",
    },
    include: {
      activity: true,
    },
  },
} satisfies PlanInclude;

type PlanWithActivities = PlanGetPayload<{ include: typeof planInclude }>;

export async function createPlan(prisma: PrismaClient, input: CreatePlanInput) {
  await ensureActivitiesExist(prisma, input.activityIds);

  const plan = await prisma.plan.create({
    data: {
      id: createId("plan"),
      name: input.name,
      date: new Date(input.date),
      notes: input.notes,
      planActivities: {
        create: input.activityIds.map((activityId, position) => ({
          activityId,
          position,
        })),
      },
    },
    include: planInclude,
  });

  return serializePlan(plan as PlanWithActivities);
}

export async function getPlanById(prisma: PrismaClient, id: string) {
  const plan = await prisma.plan.findUnique({
    where: {
      id,
    },
    include: planInclude,
  });

  if (!plan) {
    throw notFound("Plan not found");
  }

  return serializePlan(plan as PlanWithActivities);
}

export async function updatePlan(
  prisma: PrismaClient,
  id: string,
  input: UpdatePlanInput,
) {
  await getPlanById(prisma, id);

  if (input.activityIds) {
    await ensureActivitiesExist(prisma, input.activityIds);
  }

  const plan = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      if (input.activityIds) {
        await tx.planActivity.deleteMany({
          where: {
            planId: id,
          },
        });
      }

      return tx.plan.update({
        where: {
          id,
        },
        data: {
          name: input.name,
          date: input.date ? new Date(input.date) : undefined,
          notes: input.notes,
          planActivities: input.activityIds
            ? {
                create: input.activityIds.map((activityId, position) => ({
                  activityId,
                  position,
                })),
              }
            : undefined,
        },
        include: planInclude,
      });
    },
  );

  return serializePlan(plan as PlanWithActivities);
}

async function ensureActivitiesExist(
  prisma: PrismaClient,
  activityIds: string[],
) {
  const uniqueIds = [...new Set(activityIds)];
  const count = await prisma.activity.count({
    where: {
      id: {
        in: uniqueIds,
      },
    },
  });

  if (count !== uniqueIds.length) {
    throw badRequest("activityIds must reference existing activities");
  }
}

function serializePlan(plan: PlanWithActivities) {
  return {
    id: plan.id,
    name: plan.name,
    date: plan.date.toISOString().slice(0, 10),
    activityIds: plan.planActivities.map((item) => item.activityId),
    activities: plan.planActivities.map((item) => item.activity),
    notes: plan.notes,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}
