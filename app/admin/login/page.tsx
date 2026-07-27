"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import { loginAction, type LoginActionState } from "@/lib/actions/auth";

const INITIAL_STATE: LoginActionState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);

  return (
    <main className="flex min-h-screen items-center justify-center bg-kraft px-4 py-16">
      <div className="docket-edge w-full max-w-sm -rotate-1 rounded-b-card bg-paper px-8 pb-8 pt-8 shadow-card">
        <p className="font-mono text-xs uppercase tracking-wide text-stamp">Admin</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
          Masuk ke Panel Admin
        </h1>
        <p className="mt-1 font-sans text-sm text-ink/60">
          Masukkan kata sandi admin untuk melanjutkan.
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-sans text-sm font-semibold text-ink">
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              aria-invalid={state.error ? true : undefined}
              aria-describedby={state.error ? "password-error" : undefined}
              className="rounded-[4px] border border-ink/20 bg-paper px-4 py-2.5 font-sans text-ink outline-none focus-visible:ring-2 focus-visible:ring-stamp"
            />
          </div>

          {state.error && (
            <p id="password-error" role="alert" className="font-sans text-sm text-stamp">
              {state.error}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={isPending} className="mt-2 w-full">
            {isPending ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </div>
    </main>
  );
}
