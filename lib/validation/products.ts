import { z } from "zod";

/**
 * Parses a raw textarea string of image URLs (newline or comma separated)
 * into a trimmed, deduplicated array of non-empty strings.
 */
function parseImageUrlsInput(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[\n,]+/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
    )
  );
}

export const productInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().optional().default(""),
  imageUrls: z
    .string()
    .transform(parseImageUrlsInput)
    .pipe(
      z
        .array(z.url({ message: "Each image URL must be a valid URL" }))
        .min(1, "At least one image URL is required")
    ),
  formatOptions: z.string().trim().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productInputSchema>;

/**
 * Parses/validates raw product input (e.g. from a Server Action form
 * submission). Returns a safeParse-style result rather than throwing, so
 * callers can surface field errors without try/catch.
 */
export function parseProductInput(raw: unknown) {
  return productInputSchema.safeParse(raw);
}
