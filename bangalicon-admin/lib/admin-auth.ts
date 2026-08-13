import "server-only";

import crypto from "node:crypto";
import type { NextResponse } from "next/server";
import { cookies } from "next/headers";

export interface AdminSession {
  email: string;
  name: string;
  signedAt: number;
}

export interface AdminLoginState {
  mode: "configured" | "fallback" | "missing";
  email: string;
  name: string;
  passwordHint: string | null;
}

const ADMIN_COOKIE_NAME = "bangalicon_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function normalizeEmail(value: string | undefined) {
  return String(value || "").trim().toLowerCase();
}

function getAdminConfig() {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const configuredEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  const configuredPassword = String(process.env.ADMIN_PASSWORD || "");
  const email = configuredEmail || (isDevelopment ? "admin@bangalicon.local" : "");
  const password = configuredPassword || (isDevelopment ? "admin123" : "");
  const name = String(process.env.ADMIN_NAME || "Bangalicon Admin").trim() || "Bangalicon Admin";
  const secret =
    String(process.env.ADMIN_SESSION_SECRET || "").trim() ||
    (isDevelopment ? "bangalicon-admin-dev-secret" : "");
  const hasCredentials = Boolean(email && password && secret);

  return {
    email,
    password,
    name,
    secret,
    isDevelopment,
    hasCredentials,
    usingFallback: isDevelopment && !configuredEmail && !configuredPassword,
  };
}

function createSignature(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function encodeSession(session: AdminSession, secret: string) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createSignature(payload, secret);
  return `${payload}.${signature}`;
}

function decodeSession(token: string, secret: string): AdminSession | null {
  const [payload, signature] = String(token || "").split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = createSignature(payload, secret);
  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    if (!session || typeof session !== "object") {
      return null;
    }

    if (typeof session.email !== "string" || typeof session.name !== "string") {
      return null;
    }

    return {
      email: normalizeEmail(session.email),
      name: String(session.name).trim() || "Bangalicon Admin",
      signedAt: Number(session.signedAt || Date.now()),
    };
  } catch {
    return null;
  }
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

export function getAdminLoginState(): AdminLoginState {
  const config = getAdminConfig();

  if (!config.hasCredentials) {
    return {
      mode: "missing",
      email: "",
      name: config.name,
      passwordHint: null,
    };
  }

  if (config.usingFallback) {
    return {
      mode: "fallback",
      email: config.email,
      name: config.name,
      passwordHint: config.password,
    };
  }

  return {
    mode: "configured",
    email: config.email,
    name: config.name,
    passwordHint: null,
  };
}

export async function getAdminSession() {
  const config = getAdminConfig();

  if (!config.hasCredentials) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decodeSession(token, config.secret);
}

export function verifyAdminCredentials(email: string, password: string) {
  const config = getAdminConfig();

  if (!config.hasCredentials) {
    return { ok: false as const, reason: "missing_config" as const };
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    return { ok: false as const, reason: "invalid" as const };
  }

  const emailMatches = safeCompare(normalizedEmail, config.email);
  const passwordMatches = safeCompare(String(password), config.password);

  if (!emailMatches || !passwordMatches) {
    return { ok: false as const, reason: "invalid" as const };
  }

  const session: AdminSession = {
    email: config.email,
    name: config.name,
    signedAt: Date.now(),
  };

  return {
    ok: true as const,
    session,
  };
}

export function applyAdminSessionCookie(response: NextResponse, session: AdminSession) {
  const config = getAdminConfig();
  const token = encodeSession(session, config.secret);

  response.cookies.set(ADMIN_COOKIE_NAME, token, getCookieOptions());
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    ...getCookieOptions(),
    maxAge: 0,
  });
}
