import { describe, expect, it } from "vitest";
import { parseProductInput } from "@/lib/validation/products";

const validBase = {
  name: "Loose Leaf A5",
  description: "Isi ulang loose leaf ukuran A5.",
  imageUrls: "https://placehold.co/800x800?text=1",
};

describe("parseProductInput", () => {
  it("rejects missing name", () => {
    const result = parseProductInput({ ...validBase, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing description", () => {
    const result = parseProductInput({ ...validBase, description: "" });
    expect(result.success).toBe(false);
  });

  it("rejects when name is not provided at all", () => {
    const result = parseProductInput({
      description: validBase.description,
      imageUrls: validBase.imageUrls,
    });
    expect(result.success).toBe(false);
  });

  it("parses the imageUrls textarea string into a deduplicated array", () => {
    const result = parseProductInput({
      ...validBase,
      imageUrls: "http://a.com/1.jpg, http://a.com/1.jpg\nhttp://a.com/2.jpg",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.imageUrls).toEqual([
        "http://a.com/1.jpg",
        "http://a.com/2.jpg",
      ]);
    }
  });

  it("rejects invalid URLs in imageUrls", () => {
    const result = parseProductInput({
      ...validBase,
      imageUrls: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a mix of valid and invalid URLs", () => {
    const result = parseProductInput({
      ...validBase,
      imageUrls: "http://a.com/1.jpg\nnot-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when imageUrls resolves to an empty array", () => {
    const result = parseProductInput({
      ...validBase,
      imageUrls: "   \n , ,,  ",
    });
    expect(result.success).toBe(false);
  });

  it("coerces sortOrder string to number", () => {
    const result = parseProductInput({ ...validBase, sortOrder: "5" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortOrder).toBe(5);
    }
  });

  it("defaults sortOrder to 0 and isActive to true when omitted", () => {
    const result = parseProductInput(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sortOrder).toBe(0);
      expect(result.data.isActive).toBe(true);
      expect(result.data.category).toBe("");
    }
  });
});
