import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import type { AuthTokenPayload, User } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "flego_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const AUTH_COOKIE_NAME = "flego_token";
export const SALT_ROUNDS = 10;

export function signToken(user: Pick<User, "id" | "email" | "name">): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Reads the JWT from either the httpOnly cookie (browser flow) or an
 * `Authorization: Bearer <token>` header (server-to-server / mobile-client
 * flow), verifies it, and returns the decoded payload — or null if missing
 * or invalid. Route handlers use this instead of touching cookies/headers
 * directly.
 */
export function getAuthUser(request: NextRequest): AuthTokenPayload | null {
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const token = cookieToken || headerToken;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
