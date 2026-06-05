import type { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.userId;

  if (!userId) {
    return reply.status(401).send({
      error: { code: "UNAUTHORIZED", message: "Not authenticated" },
    });
  }
}
