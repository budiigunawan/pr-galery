import { z } from "zod";

/** Strips any leading "@" so Instagram handles are stored consistently. */
function normalizeInstagramHandle(value: string): string {
  return value.trim().replace(/^@+/, "");
}

const shopeeUrlSchema = z
  .string()
  .trim()
  .min(1, "Shopee URL is required")
  .refine(
    (value) => {
      try {
        const url = new URL(value);
        return url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Shopee URL must be a valid https:// URL" },
  );

export const contactInputSchema = z.object({
  whatsappNumber: z.string().trim().min(1, "WhatsApp number is required"),
  email: z.email({ message: "A valid email address is required" }),
  instagramHandle: z
    .string()
    .trim()
    .min(1, "Instagram handle is required")
    .transform(normalizeInstagramHandle),
  shopeeUrl: shopeeUrlSchema,
});

export type ContactInput = z.infer<typeof contactInputSchema>;

export function parseContactInput(input: unknown): ContactInput {
  return contactInputSchema.parse(input);
}

export function safeParseContactInput(input: unknown) {
  return contactInputSchema.safeParse(input);
}
