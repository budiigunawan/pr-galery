import { z } from "zod";

const sortOrderSchema = z.coerce
  .number({ message: "Sort order must be a number" })
  .int()
  .default(0);

export const faqInputSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  sortOrder: sortOrderSchema,
});

export type FaqInput = z.infer<typeof faqInputSchema>;

export function parseFaqInput(input: unknown): FaqInput {
  return faqInputSchema.parse(input);
}

export function safeParseFaqInput(input: unknown) {
  return faqInputSchema.safeParse(input);
}
