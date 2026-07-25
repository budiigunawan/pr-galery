import { db } from "@/lib/db/client";
import { contactInfo } from "@/lib/db/schema";

export type ContactInfoRow = typeof contactInfo.$inferSelect;
export type NewContactInfo = typeof contactInfo.$inferInsert;

/** Returns the singleton contact-info row, or `null` if it hasn't been seeded yet. Never throws. */
export async function getContactInfo() {
  const rows = await db.select().from(contactInfo).limit(1);
  return rows[0] ?? null;
}

/**
 * Creates or updates the singleton contact-info row in a single upsert.
 * The unique constraint on `singleton` (always `true`) is what makes this
 * safe to call repeatedly without ever producing a second row.
 */
export async function upsertContactInfo(
  input: Omit<NewContactInfo, "id" | "singleton" | "updatedAt">
) {
  const rows = await db
    .insert(contactInfo)
    .values({ ...input, singleton: true })
    .onConflictDoUpdate({
      target: contactInfo.singleton,
      set: { ...input, updatedAt: new Date() },
    })
    .returning();
  return rows[0];
}
