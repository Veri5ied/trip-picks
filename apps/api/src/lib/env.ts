import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
  SESSION_SECRET: z.string().min(16, "SESSION_SECRET must be at least 16 characters"),
});

export const env = envSchema.parse({
  ...process.env,
  SESSION_SECRET: process.env.SESSION_SECRET ?? "trip-picks-dev-secret-change-me",
});
