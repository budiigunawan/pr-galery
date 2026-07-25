import { describe, expect, it } from "vitest";
import { safeParseProductInput, parseProductInput } from "./products";

const validBase = {
  name: "Loose Leaf A5",
  description: "Isi ulang loose leaf ukuran A5.",
  imageUrls: "",
  sortOrder: "0",
};

describe("productInputSchema", () => {
  it("rejects missing name", () => {
    const result = safeParseProductInput({ ...validBase, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing description", () => {
    const result = safeParseProductInput({ ...validBase, description: "" });
    expect(result.success).toBe(false);
  });

  it("parses a valid minimal input with defaults", () => {
    const result = parseProductInput(validBase);
    expect(result.name).toBe("Loose Leaf A5");
    expect(result.category).toBe("");
    expect(result.imageUrls).toEqual([]);
    expect(result.formatOptions).toBeNull();
    expect(result.isActive).toBe(true);
  });

  it("parses imageUrls from a newline-separated textarea string, trimmed and deduped", () => {
    const result = parseProductInput({
      ...validBase,
      imageUrls:
        "https://placehold.co/800x800?text=A\nhttps://placehold.co/800x800?text=B\nhttps://placehold.co/800x800?text=A\n",
    });
    expect(result.imageUrls).toEqual([
      "https://placehold.co/800x800?text=A",
      "https://placehold.co/800x800?text=B",
    ]);
  });

  it("parses imageUrls from a comma-separated textarea string, trimmed and deduped", () => {
    const result = parseProductInput({
      ...validBase,
      imageUrls:
        "https://placehold.co/800x800?text=A, https://placehold.co/800x800?text=B ,https://placehold.co/800x800?text=A",
    });
    expect(result.imageUrls).toEqual([
      "https://placehold.co/800x800?text=A",
      "https://placehold.co/800x800?text=B",
    ]);
  });

  it("rejects invalid URLs in imageUrls", () => {
    const result = safeParseProductInput({
      ...validBase,
      imageUrls: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("coerces sortOrder from a string to a number", () => {
    const result = parseProductInput({ ...validBase, sortOrder: "3" });
    expect(result.sortOrder).toBe(3);
    expect(typeof result.sortOrder).toBe("number");
  });

  it("defaults sortOrder to 0 when omitted", () => {
    const { sortOrder, ...rest } = validBase;
    void sortOrder;
    const result = parseProductInput(rest);
    expect(result.sortOrder).toBe(0);
  });

  it("normalizes isActive from string form values", () => {
    expect(
      parseProductInput({ ...validBase, isActive: "false" }).isActive,
    ).toBe(false);
    expect(
      parseProductInput({ ...validBase, isActive: "true" }).isActive,
    ).toBe(true);
  });

  it("treats a blank formatOptions string as null", () => {
    const result = parseProductInput({ ...validBase, formatOptions: "" });
    expect(result.formatOptions).toBeNull();
  });

  it("keeps a non-empty formatOptions string", () => {
    const result = parseProductInput({
      ...validBase,
      formatOptions: "A5 / A6",
    });
    expect(result.formatOptions).toBe("A5 / A6");
  });
});
