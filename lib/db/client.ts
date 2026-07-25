import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import * as schema from "./schema";

// Neon HTTP driver (stateless) — nothing in this app needs multi-statement
// transactions, so we avoid the WebSocket `Pool` variant.
const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
