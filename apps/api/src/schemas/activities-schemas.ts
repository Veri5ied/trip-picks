import { z } from "zod";

export const activityQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  area: z.string().trim().optional(),
  priceLevel: z.coerce.number().int().min(1).max(3).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const activityParamsSchema = z.object({
  id: z.string().min(1),
});

export type ActivityQuery = z.infer<typeof activityQuerySchema>;
