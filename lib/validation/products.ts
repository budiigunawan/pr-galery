import { z } from "zod";

/**
 * Parses a newline- or comma-separated textarea string of image URLs into a
 * trimmed, deduplicated array. Each entry must be a valid URL.
 */
function parseImageUrls(value: unknown): string[] {
  if (Array.isArray(value)) {
    return dedupeTrimmed(value.map((v) => String(v)));
  }
  if (typeof value === "string") {
    const parts = value
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return dedupeTrimmed(parts);
  }
  return [];
}

function dedupeTrimmed(values: string[]): string[] {
  const trimmed = values.map((v) => v.trim()).filter((v) => v.length > 0);
  return Array.from(new Set(trimmed));
}

const imageUrlsSchema = z.preprocess(
  parseImageUrls,
  z.array(z.url({ message: "Each image URL must be a valid URL" })).default([]),
);

const sortOrderSchema = z.coerce
  .number({ message: "Sort order must be a number" })
  .int()
  .default(0);

/**
 * Coerces booleans arriving as native booleans or as common string
 * representations ("true"/"false", "1"/"0", "on"/"off") from HTML forms.
 * Unlike z.coerce.boolean(), the string "false" correctly parses to false.
 */
const booleanSchema = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "on", "yes"].includes(normalized)) return true;
    if (["false", "0", "off", "no", ""].includes(normalized)) return false;
  }
  return value;
}, z.boolean());

export const productInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().default(""),
  imageUrls: imageUrlsSchema,
  formatOptions: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  sortOrder: sortOrderSchema,
  isActive: booleanSchema.default(true),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export function parseProductInput(input: unknown): ProductInput {
  return productInputSchema.parse(input);
}

export function safeParseProductInput(input: unknown) {
  return productInputSchema.safeParse(input);
}
