import { describe, expect, it } from "vitest";
import { parseFaqInput, safeParseFaqInput } from "./faq";

describe("faqInputSchema", () => {
  it("rejects missing question", () => {
    const result = safeParseFaqInput({
      question: "",
      answer: "Some answer",
      sortOrder: "0",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing answer", () => {
    const result = safeParseFaqInput({
      question: "Some question?",
      answer: "",
      sortOrder: "0",
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from question and answer", () => {
    const result = parseFaqInput({
      question: "  Apakah bisa cetak custom?  ",
      answer: "  Bisa banget!  ",
      sortOrder: "0",
    });
    expect(result.question).toBe("Apakah bisa cetak custom?");
    expect(result.answer).toBe("Bisa banget!");
  });

  it("rejects a whitespace-only question", () => {
    const result = safeParseFaqInput({
      question: "   ",
      answer: "Bisa banget!",
      sortOrder: "0",
    });
    expect(result.success).toBe(false);
  });

  it("coerces sortOrder from a string to a number", () => {
    const result = parseFaqInput({
      question: "Q",
      answer: "A",
      sortOrder: "5",
    });
    expect(result.sortOrder).toBe(5);
    expect(typeof result.sortOrder).toBe("number");
  });

  it("defaults sortOrder to 0 when omitted", () => {
    const result = parseFaqInput({ question: "Q", answer: "A" });
    expect(result.sortOrder).toBe(0);
  });
});
