import type { FastifyInstance } from "fastify";
import { signupSchema, loginSchema } from "../schemas/auth-schemas.js";
import { signup, login, getUserById } from "../services/auth-service.js";
import { createSession, deleteSession } from "../lib/session.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/signup", async (request, reply) => {
    const body = signupSchema.parse(request.body);
    const user = await signup(app.prisma, body);
    const token = createSession(user.id);

    reply.setCookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return { data: user };
  });

  app.post("/auth/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await login(app.prisma, body);
    const token = createSession(user.id);

    reply.setCookie("session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return { data: user };
  });

  app.post("/auth/logout", async (_request, reply) => {
    const token = reply.request.cookies.session;
    if (token) deleteSession(token);
    reply.clearCookie("session", { path: "/" });
    return { data: { ok: true } };
  });

  app.get("/auth/me", async (request) => {
    const token = request.cookies.session;
    if (!token) {
      return { data: null };
    }

    const { getSession } = await import("../lib/session.js");
    const session = getSession(token);
    if (!session) {
      return { data: null };
    }

    const user = await getUserById(app.prisma, session.userId);
    return { data: user };
  });
}
