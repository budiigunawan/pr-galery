import { db } from "../client";
import { contactInfo, type NewContactInfo, type ContactInfo } from "../schema";

export type UpsertContactInput = Omit<
  NewContactInfo,
  "id" | "updatedAt" | "singleton"
>;

export async function getContactInfo(): Promise<ContactInfo | null> {
  const rows = await db.select().from(contactInfo).limit(1);
  return rows[0] ?? null;
}

export async function upsertContactInfo(
  input: UpsertContactInput,
): Promise<ContactInfo> {
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
