import { describe, expect, it } from "vitest";
import { parseFaqInput } from "@/lib/validation/faq";

const validBase = {
  question: "Apakah bisa cetak dengan desain sendiri?",
  answer: "Tentu saja bisa!",
};

describe("parseFaqInput", () => {
  it("rejects missing question", () => {
    const result = parseFaqInput({ ...validBase, question: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing answer", () => {
    const result = parseFaqInput({ ...validBase, answer: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only question", () => {
    const result = parseFaqInput({ ...validBase, question: "   " });
    expect(result.success).toBe(false);
  });

  it("trims question and answer", () => {
    const result = parseFaqInput({
      question: "  Apakah bisa pesan satuan?  ",
      answer: "  Bisa banget!  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.question).toBe("Apakah bisa pesan satuan?");
      expect(result.data.answer).toBe("Bisa banget!");
    }
  });

  it("coerces sortOrder string to number", () => {
    const result = parseFaqInput({ ...validBase, sortOrder: "3" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortOrder).toBe(3);
    }
  });

  it("defaults sortOrder to 0 when omitted", () => {
    const result = parseFaqInput(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortOrder).toBe(0);
    }
  });
});
