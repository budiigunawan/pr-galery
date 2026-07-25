/**
 * Normalizes an Indonesian phone number (local or international format)
 * into a valid https://wa.me/... link.
 *
 * - Strips all non-digit characters.
 * - If the number starts with "0" (local format), the leading "0" is
 *   replaced with the "62" (Indonesia) country code.
 * - If the number already starts with "62" (international format), it is
 *   passed through unchanged.
 * - Throws a clear validation Error for empty/garbage input (no digits at
 *   all) rather than returning a broken link. This is a normal thrown
 *   Error, not an unhandled exception — callers are expected to catch it.
 */
export function toWhatsAppLink(rawNumber: string): string {
  const digits = (rawNumber ?? "").replace(/\D/g, "");

  if (digits.length === 0) {
    throw new Error("Invalid WhatsApp number");
  }

  let normalized: string;
  if (digits.startsWith("62")) {
    normalized = digits;
  } else if (digits.startsWith("0")) {
    normalized = `62${digits.slice(1)}`;
  } else {
    normalized = `62${digits}`;
  }

  return `https://wa.me/${normalized}`;
}
