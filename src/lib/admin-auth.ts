import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/prisma";

const COOKIE_NAME = "anadi_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing SESSION_SECRET environment variable.");
  }
  return secret;
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function encodeSession(userId: string, expiresAt: number) {
  const payload = `${userId}.${expiresAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function decodeSession(token: string) {
  const [userId, expiresAt, signature] = token.split(".");
  if (!userId || !expiresAt || !signature) {
    return null;
  }
  const payload = `${userId}.${expiresAt}`;
  if (sign(payload) !== signature) {
    return null;
  }
  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || Date.now() > expiry) {
    return null;
  }
  return { userId };
}

export async function bootstrapAdminUser() {
  const prisma = getPrisma();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      role: "admin",
    },
  });
}

export async function authenticateAdmin(email: string, password: string) {
  const prisma = getPrisma();
  await bootstrapAdminUser();
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return null;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return null;
  }
  return user;
}

export async function createAdminSession(userId: string) {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const token = encodeSession(userId, expiresAt);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentAdminUser() {
  const prisma = getPrisma();
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  const decoded = decodeSession(token);
  if (!decoded) {
    return null;
  }
  return prisma.adminUser.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true },
  });
}

export async function requireAdminUser() {
  const user = await getCurrentAdminUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}
