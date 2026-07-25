import { describe, expect, it } from "vitest";
import { parseContactInput } from "@/lib/validation/contact";

const validBase = {
  whatsappNumber: "085117046472",
  email: "pr.galeri@gmail.com",
  instagramHandle: "prgaleri",
  shopeeUrl: "https://shopee.co.id/prgaleri",
};

describe("parseContactInput", () => {
  it("normalizes an Instagram handle with a leading @", () => {
    const result = parseContactInput({ ...validBase, instagramHandle: "@prgaleri" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.instagramHandle).toBe("prgaleri");
    }
  });

  it("leaves an Instagram handle without a leading @ unchanged", () => {
    const result = parseContactInput({ ...validBase, instagramHandle: "prgaleri" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.instagramHandle).toBe("prgaleri");
    }
  });

  it("accepts a valid https Shopee URL", () => {
    const result = parseContactInput({
      ...validBase,
      shopeeUrl: "https://shopee.co.id/prgaleri",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-https Shopee URL", () => {
    const result = parseContactInput({
      ...validBase,
      shopeeUrl: "http://shopee.co.id/prgaleri",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed Shopee URL", () => {
    const result = parseContactInput({
      ...validBase,
      shopeeUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = parseContactInput({ ...validBase, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid email address", () => {
    const result = parseContactInput({ ...validBase, email: "pr.galeri@gmail.com" });
    expect(result.success).toBe(true);
  });

  it("rejects a missing WhatsApp number", () => {
    const result = parseContactInput({ ...validBase, whatsappNumber: "" });
    expect(result.success).toBe(false);
  });
});
