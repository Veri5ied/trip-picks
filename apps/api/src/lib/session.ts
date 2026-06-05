import { randomUUID } from "node:crypto";

interface Session {
  userId: string;
  createdAt: number;
}

const store = new Map<string, Session>();

const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

setInterval(() => {
  const now = Date.now();
  for (const [token, session] of store) {
    if (now - session.createdAt > SESSION_TTL) {
      store.delete(token);
    }
  }
}, 60_000);

export function createSession(userId: string) {
  const token = randomUUID();
  store.set(token, { userId, createdAt: Date.now() });
  return token;
}

export function getSession(token: string) {
  const session = store.get(token);
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_TTL) {
    store.delete(token);
    return null;
  }
  return session;
}

export function deleteSession(token: string) {
  store.delete(token);
}
