# Feature 01: Project Foundations & Tooling

## Overview

Establishes the dependencies, configuration, and scripts every later feature builds on: Drizzle + Neon for the database, Vitest for tests, env-var handling, and image-host config. This is a prerequisite for Features 02–07 and must be done first, sequentially, since it touches shared files (`package.json`, `.gitignore`, `next.config.ts`) that later parallel work should not also be editing.

## Requirements

- Add all runtime and dev dependencies needed by the rest of the plan (see Technical Implementation).
- Fix `.gitignore` so `.env.example` can be committed while real secrets stay ignored.
- Add `.env.example` documenting every required env var with placeholder values.
- Add `drizzle.config.ts` and `vitest.config.ts` at the repo root.
- Add npm scripts for lint, typecheck, test, and all Drizzle CLI operations.
- Update `next.config.ts` to allow `next/image` to load admin-pasted remote image URLs.
- Prompt the user to populate real values in `.env.local` (this file is not committed and cannot be created with real secrets by an agent) — implementation should pause here and confirm the user has done this before Feature 02's migration step runs against a live database.

## Technical Implementation

**Dependencies to add** (exact packages — versions should be resolved to current stable at install time):
- Runtime: `drizzle-orm`, `@neondatabase/serverless`, `zod`.
- Dev: `drizzle-kit`, `dotenv` (lets `drizzle.config.ts`, a standalone Node script, load `.env.local`; Next itself auto-loads `.env.local` for `dev`/`build` so this is CLI-only), `tsx` (runs `lib/db/seed.ts` as a script), `vitest`, `vite-tsconfig-paths` (resolves the existing `@/*` tsconfig path alias in test files).

**`drizzle.config.ts`** (repo root):
```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

**`vitest.config.ts`** (repo root):
```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: { environment: "node", include: ["**/*.test.ts"], exclude: ["node_modules", ".next"] },
});
```

**`package.json` scripts** to add: `"typecheck": "tsc --noEmit"`, `"test": "vitest run"`, `"test:watch": "vitest"`, `"db:generate": "drizzle-kit generate"`, `"db:migrate": "drizzle-kit migrate"`, `"db:seed": "tsx lib/db/seed.ts"`, `"db:studio": "drizzle-kit studio"`. Existing `dev`/`build`/`start`/`lint` scripts stay as-is.

**`.gitignore` fix**: replace the current blanket `.env*` line with explicit patterns — `.env`, `.env.local`, `.env.*.local` — so `.env.example` is not accidentally excluded (mirrors Next.js's own default template convention).

**`.env.example`** (committed, placeholder values only):
```
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
ADMIN_PASSWORD="change-me"
SESSION_SECRET="generate-with-openssl-rand-hex-32"
ADMIN_SESSION_TTL_SECONDS="604800"
```

**`next.config.ts`**: add `images: { remotePatterns: [{ protocol: "https", hostname: "**" }] }` so `next/image` can optimize product images at any admin-pasted HTTPS host.

## Dependencies

None (this is the prerequisite for all other features).

## Acceptance Criteria

- [ ] `npm install` succeeds with all new dependencies present in `package.json`.
- [ ] `npm run lint`, `npm run typecheck`, `npm run test` (empty suite is fine at this point), and `npm run build` all run without config errors.
- [ ] `.gitignore` no longer excludes `.env.example`; `git status` shows `.env.example` as trackable while a locally-created `.env.local` stays ignored.
- [ ] `.env.example` exists at repo root with all four keys documented.
- [ ] `drizzle.config.ts` and `vitest.config.ts` exist and are picked up by their respective CLIs (`npx drizzle-kit generate --help` and `npx vitest --version` both run without error).
- [ ] `next.config.ts` includes the `images.remotePatterns` entry.
- [ ] User has confirmed `.env.local` is populated with a real Neon `DATABASE_URL`, a chosen `ADMIN_PASSWORD`, and a generated `SESSION_SECRET` before Feature 02's migration step is run.
