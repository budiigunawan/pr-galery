import { z } from "zod";

/**
 * Validated environment accessor. Fails fast at import time with a clear
 * zod error if required env vars are missing/invalid, rather than a
 * cryptic runtime error later (e.g. in lib/db/client.ts or lib/auth/session.ts).
 */
export const env = z
  .object({
    DATABASE_URL: z.url(),
    ADMIN_PASSWORD: z.string().min(1),
    SESSION_SECRET: z.string().min(32),
  })
  .parse(process.env);
