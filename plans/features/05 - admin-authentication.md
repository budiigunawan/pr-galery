# Feature 05: Admin Authentication

## Overview

Protects the `/admin` area with a single shared password, without a full auth library or user-accounts table. Implements session signing/verification, the auth-gating middleware, and the login/logout flow that Feature 06's CMS pages sit behind.

## Requirements

- A single shared secret (`ADMIN_PASSWORD` env var) is the only credential — no usernames, no per-user accounts.
- Visiting any `/admin/*` route without a valid session redirects to `/admin/login`.
- `/admin/login` itself must remain reachable without a session (not gated by the same check it enforces).
- On correct password: set an `httpOnly`, signed session cookie and redirect to `/admin/products`.
- On incorrect password: show an inline Indonesian error message ("Password salah") and remain on the login page — no redirect, no session cookie set.
- Sessions expire after a configurable TTL (`ADMIN_SESSION_TTL_SECONDS`, default 7 days / 604800 seconds); an expired session is treated the same as no session (bounced to login).
- A logout action clears the session cookie and redirects to `/admin/login`.
- Session verification must never throw on malformed/tampered input — it should fail closed (treated as "not authenticated") rather than erroring the request.
- Password and signature comparisons must be constant-time (not vulnerable to timing attacks via naive `===`/string comparison).
- Server Actions in Feature 06 must independently verify the session (defense in depth), not rely solely on the middleware matcher being correctly configured.

## Technical Implementation

**Env vars** (added to `.env.example` in Feature 01, populated by the user in `.env.local`): `ADMIN_PASSWORD` (plaintext shared secret), `SESSION_SECRET` (random 32-byte hex, e.g. generated via `openssl rand -hex 32`), `ADMIN_SESSION_TTL_SECONDS`.

**`lib/auth/session.ts`** — single module reused by middleware, Server Actions, and admin layouts:
- `SESSION_COOKIE_NAME = "pr_galeri_admin_session"`.
- `signSession(): string` — payload `{ exp: Date.now() + ttl }`, base64url-encoded, signed with `crypto.createHmac("sha256", SESSION_SECRET)`; cookie value is `payload + "." + signature`.
- `verifySession(token?: string): boolean` — splits on `.`, recomputes the HMAC, compares using `crypto.timingSafeEqual` on fixed-length buffers, checks `exp > Date.now()`. Returns `false` (never throws) on any malformed input.
- Password check: compare `HMAC(submittedPassword)` vs `HMAC(ADMIN_PASSWORD)` using `timingSafeEqual`, rather than `===`, to avoid timing leaks and `timingSafeEqual`'s length-mismatch throw on raw unequal-length strings.
- `requireSession(): void | redirect` — helper called at the top of every Server Action in Feature 06; reads the cookie via `next/headers`, redirects to `/admin/login` if invalid.

**`middleware.ts`**:
```ts
export const runtime = "nodejs"; // needed for crypto.createHmac / timingSafeEqual
export const config = { matcher: ["/admin/:path*"] };

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySession(token)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}
```
Explicitly set `runtime = "nodejs"` — Next 16 supports the Node.js middleware runtime, needed because the default Edge runtime lacks `crypto.createHmac`/`timingSafeEqual`. This avoids maintaining a separate Web Crypto (`SubtleCrypto`) implementation just for middleware.

**`lib/actions/auth.ts`** ("use server"):
- `loginAction(prevState, formData)` — bound via `useActionState` on `app/admin/login/page.tsx`'s form. Validates the submitted password, sets the cookie with `cookies().set(SESSION_COOKIE_NAME, signSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_TTL_SECONDS })` on success, redirects to `/admin/products`. Returns `{ error: "Password salah" }` on mismatch.
- `logoutAction()` — deletes the session cookie, redirects to `/admin/login`.

**Routes**: `app/admin/login/page.tsx` (form bound to `loginAction`, not covered by the middleware's redirect target), `app/admin/layout.tsx` (admin chrome/nav, only reached once middleware has passed).

## Dependencies

Depends on Feature 01 (env vars, `SESSION_SECRET` present in `.env.local`). Can be built in parallel with Feature 04 once Feature 01 is done. Feature 06 depends on this feature.

## Acceptance Criteria

- [ ] Visiting `/admin/products` while logged out redirects to `/admin/login`.
- [ ] `/admin/login` itself loads without redirect looping.
- [ ] Submitting the wrong password shows "Password salah" inline and stays on `/admin/login`; no cookie is set.
- [ ] Submitting the correct password sets an `httpOnly` cookie and redirects to `/admin/products`.
- [ ] After logging in, navigating directly to any `/admin/*` route succeeds without re-prompting for login.
- [ ] Manually clearing the session cookie (or waiting past a temporarily shortened `ADMIN_SESSION_TTL_SECONDS`) causes the next `/admin/*` visit to bounce back to login.
- [ ] A tampered cookie value (e.g. flipping a character in the signature portion) is rejected — `verifySession` returns `false`, not a thrown error, and the request is redirected to login.
- [ ] Logout action clears the cookie and redirects to `/admin/login`; a subsequent `/admin/*` visit is bounced.
- [ ] `lib/auth/session.test.ts` passes: sign/verify round-trip succeeds; tampered signature fails; expired token fails; malformed token (no `.` separator, or garbage input) returns `false` without throwing.
