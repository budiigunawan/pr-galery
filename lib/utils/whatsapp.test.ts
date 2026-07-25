import { describe, expect, it } from "vitest";
import { toWhatsAppLink } from "@/lib/utils/whatsapp";

describe("toWhatsAppLink", () => {
  it("converts a local-format Indonesian number to a wa.me link", () => {
    expect(toWhatsAppLink("085117046472")).toBe("https://wa.me/6285117046472");
  });

  it("passes through an already-international number unchanged", () => {
    expect(toWhatsAppLink("6285117046472")).toBe("https://wa.me/6285117046472");
  });

  it("strips formatting characters from an international number with a plus sign", () => {
    expect(toWhatsAppLink("+62 851-1704-6472")).toBe("https://wa.me/6285117046472");
  });

  it("strips spaces/dashes from a local-format number", () => {
    expect(toWhatsAppLink("0851-1704-6472")).toBe("https://wa.me/6285117046472");
  });

  it("throws for an empty string", () => {
    expect(() => toWhatsAppLink("")).toThrow();
  });

  it("throws for garbage input with no digits", () => {
    expect(() => toWhatsAppLink("abc")).toThrow();
  });
});
