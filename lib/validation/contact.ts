import { z } from "zod";

export const contactInputSchema = z.object({
  whatsappNumber: z.string().trim().min(1, "WhatsApp number is required"),
  email: z.email({ message: "Invalid email address" }),
  // Normalize by stripping any leading "@" so storage is consistent
  // (e.g. "@prgaleri" and "prgaleri" both store as "prgaleri").
  instagramHandle: z
    .string()
    .trim()
    .min(1, "Instagram handle is required")
    .transform((val) => val.replace(/^@+/, "")),
  shopeeUrl: z
    .url({ message: "Shopee URL must be a valid URL" })
    .refine((val) => val.startsWith("https://"), {
      message: "Shopee URL must use https://",
    }),
});

export type ContactInput = z.infer<typeof contactInputSchema>;

/**
 * Parses/validates raw contact-info input. Returns a safeParse-style result
 * rather than throwing, so callers can surface field errors without
 * try/catch.
 */
export function parseContactInput(raw: unknown) {
  return contactInputSchema.safeParse(raw);
}
