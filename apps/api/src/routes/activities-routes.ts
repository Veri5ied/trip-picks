import type { FastifyInstance } from "fastify";
import {
  activityParamsSchema,
  activityQuerySchema,
} from "../schemas/activities-schemas.js";
import {
  getActivityById,
  listActivities,
} from "../services/activities-service.js";

const activityResponseSchema = {
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
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const listQuerySchema = {
  type: "object",
  properties: {
    q: { type: "string" },
    category: { type: "string" },
    area: { type: "string" },
    priceLevel: { type: "integer" },
    page: { type: "integer", minimum: 1, default: 1 },
    limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
  },
};

export async function activitiesRoutes(app: FastifyInstance) {
  app.get(
    "/activities",
    {
      schema: {
        tags: ["Activities"],
        description:
          "List activities with optional search, filters, and pagination",
        querystring: listQuerySchema,
        response: {
          200: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: activityResponseSchema,
              },
              meta: {
                type: "object",
                properties: {
                  count: { type: "integer" },
                  total: { type: "integer" },
                  page: { type: "integer" },
                  limit: { type: "integer" },
                  totalPages: { type: "integer" },
                },
              },
            },
          },
        },
      },
    },
    async (request) => {
      const query = activityQuerySchema.parse(request.query);
      return listActivities(app.prisma, query);
    },
  );

  app.get(
    "/activities/:id",
    {
      schema: {
        tags: ["Activities"],
        description: "Get a single activity by ID",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              data: activityResponseSchema,
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
      const params = activityParamsSchema.parse(request.params);
      const activity = await getActivityById(app.prisma, params.id);

      return {
        data: activity,
      };
    },
  );
}
