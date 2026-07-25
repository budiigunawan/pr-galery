import { describe, expect, it } from "vitest";
import { toWhatsAppLink } from "./whatsapp";

describe("toWhatsAppLink", () => {
  it("converts a local-format Indonesian number to a wa.me link", () => {
    expect(toWhatsAppLink("085117046472")).toBe("https://wa.me/6285117046472");
  });

  it("passes through an already-international number", () => {
    expect(toWhatsAppLink("6285117046472")).toBe("https://wa.me/6285117046472");
  });

  it("strips non-digit characters (spaces, dashes, plus sign)", () => {
    expect(toWhatsAppLink("+62 851-1704-6472")).toBe(
      "https://wa.me/6285117046472",
    );
    expect(toWhatsAppLink("0851-1704-6472")).toBe(
      "https://wa.me/6285117046472",
    );
  });

  it("throws on empty input instead of returning a broken link", () => {
    expect(() => toWhatsAppLink("")).toThrow("Invalid WhatsApp number");
  });

  it("throws on garbage (non-numeric) input", () => {
    expect(() => toWhatsAppLink("abc")).toThrow("Invalid WhatsApp number");
    expect(() => toWhatsAppLink("   ")).toThrow("Invalid WhatsApp number");
  });

  it("prepends 62 for a number with no country code and no leading 0", () => {
    expect(toWhatsAppLink("85117046472")).toBe("https://wa.me/6285117046472");
  });
});
