"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { upsertContactInfo } from "@/lib/db/queries/contact";
import { safeParseContactInput } from "@/lib/validation/contact";

export interface ContactFormState {
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
  success?: boolean;
}

/**
 * Bound to components/admin/ContactForm.tsx via useActionState. Unlike the
 * Products/FAQ slices, this is a singleton settings form — on success it
 * does NOT redirect, it just re-renders the same page with a "Tersimpan"
 * confirmation and the just-saved values.
 */
export async function upsertContactAction(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  await requireSession();

  const raw = {
    whatsappNumber: formData.get("whatsappNumber"),
    email: formData.get("email"),
    instagramHandle: formData.get("instagramHandle"),
    shopeeUrl: formData.get("shopeeUrl"),
  };

  const parsed = safeParseContactInput(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values: {
        whatsappNumber: String(raw.whatsappNumber ?? ""),
        email: String(raw.email ?? ""),
        instagramHandle: String(raw.instagramHandle ?? ""),
        shopeeUrl: String(raw.shopeeUrl ?? ""),
      },
    };
  }

  await upsertContactInfo(parsed.data);
  revalidatePath("/admin/contact");
  revalidatePath("/");

  return { success: true, values: parsed.data };
}
