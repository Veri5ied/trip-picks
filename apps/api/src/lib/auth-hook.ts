import type { FastifyReply, FastifyRequest } from "fastify";
import { getSession } from "./session.js";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.session;
  if (!token) {
    return reply.status(401).send({
      error: { code: "UNAUTHORIZED", message: "Not authenticated" },
    });
  }

  const session = getSession(token);
  if (!session) {
    return reply.status(401).send({
      error: { code: "UNAUTHORIZED", message: "Session expired" },
    });
  }

  request.userId = session.userId;
}
