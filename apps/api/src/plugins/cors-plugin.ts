import cors from "@fastify/cors";
import fp from "fastify-plugin";

export const corsPlugin = fp(async (app) => {
  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
});
