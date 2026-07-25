/**
 * Normalizes an Indonesian phone number (local or international format)
 * into a `https://wa.me/<digits>` deep link.
 *
 * - Local format (leading "0") has the "0" stripped and "62" prepended,
 *   e.g. "085117046472" -> "https://wa.me/6285117046472".
 * - International format (already starting with "62") passes through
 *   as-is, e.g. "6285117046472" -> "https://wa.me/6285117046472".
 * - Empty or non-numeric input throws instead of returning a broken link.
 */
export function toWhatsAppLink(rawNumber: string): string {
  const digits = rawNumber.replace(/\D/g, "");

  if (digits.length === 0) {
    throw new Error("Invalid WhatsApp number");
  }

  const normalized = digits.startsWith("0")
    ? `62${digits.slice(1)}`
    : digits.startsWith("62")
      ? digits
      : `62${digits}`;

  return `https://wa.me/${normalized}`;
}
