import type { FastifyInstance } from "fastify";
import { signupSchema, loginSchema } from "../schemas/auth-schemas.js";
import { signup, login, getUserById } from "../services/auth-service.js";

export async function authRoutes(app: FastifyInstance) {

  app.post("/auth/signup", async (request, reply) => {
    const body = signupSchema.parse(request.body);
    const user = await signup(app.prisma, body);

    reply.setCookie("userId", user.id, {
      signed: true,
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

    reply.setCookie("userId", user.id, {
      signed: true,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return { data: user };
  });

  app.post("/auth/logout", async (_request, reply) => {
    reply.clearCookie("userId", { path: "/" });
    return { data: { ok: true } };
  });

  app.get("/auth/me", async (request) => {
    const userId = request.userId;
    if (!userId) {
      return { data: null };
    }

    const user = await getUserById(app.prisma, userId);
    return { data: user };
  });
}
