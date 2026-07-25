import { z } from "zod";

/**
 * Zod-validated environment accessor.
 *
 * Parsing `process.env` here (at module import time) means misconfiguration
 * fails fast with a clear error message, instead of surfacing later as a
 * cryptic runtime error inside `lib/db/client.ts` or `lib/auth/session.ts`.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  ADMIN_PASSWORD: z.string().min(1),
  SESSION_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
