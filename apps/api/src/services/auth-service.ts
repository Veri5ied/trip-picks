import bcrypt from "bcryptjs";
import type { PrismaClient } from "../generated/prisma/client.js";
import { createId } from "../lib/id.js";
import { badRequest, notFound } from "../lib/errors.js";
import type { SignupInput, LoginInput } from "../schemas/auth-schemas.js";

export async function signup(prisma: PrismaClient, input: SignupInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw badRequest("Email already in use");
  }

  const password = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      id: createId("user"),
      email: input.email,
      password,
    },
  });

  return { id: user.id, email: user.email };
}

export async function login(prisma: PrismaClient, input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw badRequest("Invalid email or password");
  }

  const valid = await bcrypt.compare(input.password, user.password);

  if (!valid) {
    throw badRequest("Invalid email or password");
  }

  return { id: user.id, email: user.email };
}

export async function getUserById(prisma: PrismaClient, id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, createdAt: true },
  });

  if (!user) {
    throw notFound("User not found");
  }

  return user;
}
