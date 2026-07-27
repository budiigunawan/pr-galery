import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/auth/session";

// Node.js runtime is required here (not the default Edge runtime) because
// lib/auth/session.ts uses crypto.createHmac / crypto.timingSafeEqual,
// which aren't available in the Edge runtime.
export const runtime = "nodejs";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!verifySession(token)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}
