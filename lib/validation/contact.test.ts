import { describe, expect, it } from "vitest";
import { parseContactInput, safeParseContactInput } from "./contact";

const validBase = {
  whatsappNumber: "085117046472",
  email: "pr.galeri@gmail.com",
  instagramHandle: "prgaleri",
  shopeeUrl: "https://shopee.co.id/prgaleri",
};

describe("contactInputSchema", () => {
  it("rejects an empty whatsapp number", () => {
    const result = safeParseContactInput({ ...validBase, whatsappNumber: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email format", () => {
    const result = safeParseContactInput({
      ...validBase,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid email format", () => {
    const result = parseContactInput(validBase);
    expect(result.email).toBe("pr.galeri@gmail.com");
  });

  it("normalizes an Instagram handle by stripping a leading @", () => {
    const result = parseContactInput({
      ...validBase,
      instagramHandle: "@prgaleri",
    });
    expect(result.instagramHandle).toBe("prgaleri");
  });

  it("leaves an Instagram handle without a leading @ unchanged", () => {
    const result = parseContactInput({
      ...validBase,
      instagramHandle: "prgaleri",
    });
    expect(result.instagramHandle).toBe("prgaleri");
  });

  it("rejects an empty Instagram handle", () => {
    const result = safeParseContactInput({
      ...validBase,
      instagramHandle: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid https Shopee URL", () => {
    const result = parseContactInput(validBase);
    expect(result.shopeeUrl).toBe("https://shopee.co.id/prgaleri");
  });

  it("rejects a non-URL Shopee value", () => {
    const result = safeParseContactInput({
      ...validBase,
      shopeeUrl: "not a url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-https Shopee URL", () => {
    const result = safeParseContactInput({
      ...validBase,
      shopeeUrl: "http://shopee.co.id/prgaleri",
    });
    expect(result.success).toBe(false);
  });
});
