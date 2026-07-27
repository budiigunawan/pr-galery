"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { SESSION_COOKIE_NAME, signSession, verifyPassword } from "@/lib/auth/session";

export interface LoginActionState {
  error?: string;
}

/**
 * Bound to app/admin/login/page.tsx's form via useActionState. On success,
 * sets the signed session cookie and redirects into the admin area; on
 * failure, returns an inline Indonesian error and leaves the user on the
 * login page (no redirect, no cookie).
 */
export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const submittedPassword = formData.get("password");

  if (typeof submittedPassword !== "string" || !verifyPassword(submittedPassword)) {
    return { error: "Password salah" };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, signSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: env.ADMIN_SESSION_TTL_SECONDS,
  });

  redirect("/admin/products");
}

/**
 * Clears the session cookie and returns the admin back to the login page.
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
