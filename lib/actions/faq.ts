"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { safeParseFaqInput } from "@/lib/validation/faq";
import {
  createFaqItem,
  deleteFaqItem,
  listFaqItems,
  reorderFaqItems,
  updateFaqItem,
} from "@/lib/db/queries/faq";

export interface FaqFormState {
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
}

/**
 * Bound to the "FAQ Baru" form via useActionState. sortOrder is deliberately
 * not read from the form — new FAQ entries always append to the end of the
 * existing list, ordering is only ever adjusted afterwards via
 * reorderFaqAction on the list page.
 */
export async function createFaqAction(
  _prevState: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  await requireSession();

  const raw = {
    question: formData.get("question"),
    answer: formData.get("answer"),
  };

  const parsed = safeParseFaqInput(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values: {
        question: String(formData.get("question") ?? ""),
        answer: String(formData.get("answer") ?? ""),
      },
    };
  }

  const existing = await listFaqItems();
  await createFaqItem({ ...parsed.data, sortOrder: existing.length });

  revalidatePath("/admin/faq");
  revalidatePath("/");
  redirect("/admin/faq");
}

/**
 * Bound to the "Edit FAQ" form via `updateFaqAction.bind(null, id)` before
 * being passed to useActionState — the standard Next.js pattern for
 * parameterized Server Actions used with useActionState. sortOrder is
 * stripped from the parsed data so editing a FAQ's text never resets its
 * position in the list.
 */
export async function updateFaqAction(
  id: string,
  _prevState: FaqFormState,
  formData: FormData,
): Promise<FaqFormState> {
  await requireSession();

  const raw = {
    question: formData.get("question"),
    answer: formData.get("answer"),
  };

  const parsed = safeParseFaqInput(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values: {
        question: String(formData.get("question") ?? ""),
        answer: String(formData.get("answer") ?? ""),
      },
    };
  }

  const { sortOrder, ...updateFields } = parsed.data;
  void sortOrder;
  await updateFaqItem(id, updateFields);

  revalidatePath("/admin/faq");
  revalidatePath("/");
  redirect("/admin/faq");
}

/**
 * Called directly as a list-page row's form action (not via useActionState).
 */
export async function deleteFaqAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await deleteFaqItem(id);

  revalidatePath("/admin/faq");
  revalidatePath("/");
}

/**
 * Called directly by SortOrderControls' up/down forms. Re-derives the full
 * ordered id list server-side, swaps the target row with its neighbor, and
 * persists the new order.
 */
export async function reorderFaqAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = formData.get("id");
  const direction = formData.get("direction");
  if (typeof id !== "string" || !id) return;
  if (direction !== "up" && direction !== "down") return;

  const items = await listFaqItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= items.length) return;

  const ids = items.map((item) => item.id);
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];
  await reorderFaqItems(ids);

  revalidatePath("/admin/faq");
  revalidatePath("/");
}
