import { z } from "zod";

const dateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Date must be valid");

export const planParamsSchema = z.object({
  id: z.string().min(1),
});

export const createPlanSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  date: dateSchema,
  activityIds: z
    .array(z.string().min(1))
    .min(1, "At least one activity is required"),
  notes: z.string().trim().optional(),
});

export const updatePlanSchema = createPlanSchema
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required",
  );

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
