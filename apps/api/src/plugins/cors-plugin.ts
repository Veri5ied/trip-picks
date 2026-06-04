import cors from "@fastify/cors";
import fp from "fastify-plugin";
import { env } from "../lib/env.js";

export const corsPlugin = fp(async (app) => {
  await app.register(cors, {
    origin: env.WEB_ORIGIN,
  });
});
