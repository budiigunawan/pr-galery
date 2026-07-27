import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

/**
 * Single-shared-password admin session handling, reused by middleware.ts,
 * Server Actions (lib/actions/auth.ts), and the admin layout/pages.
 *
 * Sessions are a `base64url(JSON payload) + "." + hexSignature` string,
 * HMAC-signed with SESSION_SECRET. There is no server-side session store —
 * the cookie itself is the source of truth, verified on every request.
 */

export const SESSION_COOKIE_NAME = "pr_galeri_admin_session";

interface SessionPayload {
  exp: number;
}

function hmacDigest(value: string): Buffer {
  return crypto.createHmac("sha256", env.SESSION_SECRET).update(value).digest();
}

function hmacHex(value: string): string {
  return hmacDigest(value).toString("hex");
}

/**
 * Constant-time string comparison. Both inputs are first reduced to a
 * fixed-length HMAC digest, so this never throws on length-mismatched
 * input (unlike calling crypto.timingSafeEqual on raw buffers directly).
 */
function timingSafeStringEqual(a: string, b: string): boolean {
  return crypto.timingSafeEqual(hmacDigest(a), hmacDigest(b));
}

/**
 * Signs a fresh session token good for ADMIN_SESSION_TTL_SECONDS from now.
 */
export function signSession(): string {
  const payload: SessionPayload = {
    exp: Date.now() + env.ADMIN_SESSION_TTL_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = hmacHex(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a session token. Never throws — any malformed/tampered/expired
 * input simply returns false (fail closed).
 */
export function verifySession(token?: string): boolean {
  try {
    if (!token) return false;

    const separatorIndex = token.indexOf(".");
    if (separatorIndex === -1) return false;

    const encodedPayload = token.slice(0, separatorIndex);
    const signature = token.slice(separatorIndex + 1);
    if (!encodedPayload || !signature) return false;

    const expectedSignature = hmacHex(encodedPayload);
    if (!timingSafeStringEqual(signature, expectedSignature)) return false;

    const decoded = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload = JSON.parse(decoded) as Partial<SessionPayload>;
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) return false;

    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

/**
 * Constant-time comparison of the submitted admin password against
 * ADMIN_PASSWORD, avoiding a naive `===` string comparison.
 */
export function verifyPassword(submittedPassword: string): boolean {
  return timingSafeStringEqual(submittedPassword, env.ADMIN_PASSWORD);
}

/**
 * Server Action guard: reads the session cookie via next/headers and
 * redirects to /admin/login if it's missing/invalid/expired. Server Actions
 * in Feature 06 call this independently of the middleware (defense in
 * depth) rather than trusting the matcher alone.
 */
export async function requireSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySession(token)) {
    redirect("/admin/login");
  }
}
