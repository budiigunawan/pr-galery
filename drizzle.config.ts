import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// dotenv's default `dotenv/config` import only loads `.env`; Next.js's
// `.env.local` convention needs to be loaded explicitly for this
// standalone CLI config (Next itself auto-loads `.env.local` for dev/build).
config({ path: [".env.local", ".env"] });

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
