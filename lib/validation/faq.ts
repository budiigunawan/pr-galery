import { z } from "zod";

export const faqInputSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  sortOrder: z.coerce.number().default(0),
});

export type FaqInput = z.infer<typeof faqInputSchema>;

/**
 * Parses/validates raw FAQ input. Returns a safeParse-style result rather
 * than throwing, so callers can surface field errors without try/catch.
 */
export function parseFaqInput(raw: unknown) {
  return faqInputSchema.safeParse(raw);
}
