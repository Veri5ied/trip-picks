import type { FastifyInstance } from "fastify";
import {
  createPlanSchema,
  planParamsSchema,
  updatePlanSchema,
} from "../schemas/plans-schemas.js";
import {
  createPlan,
  getPlanById,
  updatePlan,
} from "../services/plans-service.js";

const activityRef = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    category: { type: "string" },
    area: { type: "string" },
    durationMinutes: { type: "integer" },
    priceLevel: { type: "integer" },
    rating: { type: "number" },
    imageUrl: { type: "string" },
    description: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
  },
};

const planResponseSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    date: { type: "string" },
    activityIds: {
      type: "array",
      items: { type: "string" },
    },
    activities: {
      type: "array",
      items: activityRef,
    },
    notes: { type: "string", nullable: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const idParamSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

const createPlanBodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    date: { type: "string", format: "date" },
    activityIds: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    },
    notes: { type: "string" },
  },
  required: ["name", "date", "activityIds"],
};

const updatePlanBodySchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    date: { type: "string", format: "date" },
    activityIds: {
      type: "array",
      items: { type: "string" },
    },
    notes: { type: "string" },
  },
};

export async function plansRoutes(app: FastifyInstance) {
  app.post(
    "/plans",
    {
      schema: {
        tags: ["Plans"],
        description: "Create a new day plan",
        body: createPlanBodySchema,
        response: {
          201: {
            type: "object",
            properties: {
              data: planResponseSchema,
            },
          },
        },
      },
    },
    async (request, reply) => {
      const body = createPlanSchema.parse(request.body);
      const plan = await createPlan(app.prisma, body);

      reply.status(201);

      return {
        data: plan,
      };
    },
  );

  app.get(
    "/plans/:id",
    {
      schema: {
        tags: ["Plans"],
        description: "Get a plan by ID",
        params: idParamSchema,
        response: {
          200: {
            type: "object",
            properties: {
              data: planResponseSchema,
            },
          },
          404: {
            type: "object",
            properties: {
              error: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async (request) => {
      const params = planParamsSchema.parse(request.params);
      const plan = await getPlanById(app.prisma, params.id);

      return {
        data: plan,
      };
    },
  );

  app.patch(
    "/plans/:id",
    {
      schema: {
        tags: ["Plans"],
        description: "Update a plan (partial update)",
        params: idParamSchema,
        body: updatePlanBodySchema,
        response: {
          200: {
            type: "object",
            properties: {
              data: planResponseSchema,
            },
          },
        },
      },
    },
    async (request) => {
      const params = planParamsSchema.parse(request.params);
      const body = updatePlanSchema.parse(request.body);
      const plan = await updatePlan(app.prisma, params.id, body);

      return {
        data: plan,
      };
    },
  );
}
