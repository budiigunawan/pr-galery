"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import type { ProductFormState } from "@/lib/actions/products";

const INITIAL_STATE: ProductFormState = { errors: undefined, values: undefined };

interface ProductFormInitialValues {
  name: string;
  description: string;
  category: string;
  imageUrls: string[];
  formatOptions: string | null;
  isActive: boolean;
}

interface ProductFormProps {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  initialValues?: ProductFormInitialValues;
  submitLabel: string;
}

/**
 * Shared create/edit form for admin products. On a validation error,
 * text/textarea fields are redisplayed from `state.values`; the checkbox
 * falls back to `initialValues`/true since FormData doesn't round-trip a
 * checked state reliably through defaultChecked on re-render.
 */
export default function ProductForm({ action, initialValues, submitLabel }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  const inputClasses =
    "rounded-[4px] border border-ink/20 bg-paper px-4 py-2.5 font-sans text-ink outline-none focus-visible:ring-2 focus-visible:ring-stamp";
  const labelClasses = "font-sans text-sm font-semibold text-ink";
  const errorClasses = "font-sans text-sm text-stamp";

  return (
    <div className="docket-edge rounded-b-card bg-paper px-8 py-8 shadow-card">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={labelClasses}>
            Nama
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={state.values?.name ?? initialValues?.name ?? ""}
            className={inputClasses}
          />
          {state.errors?.name?.[0] && <p className={errorClasses}>{state.errors.name[0]}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className={labelClasses}>
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={state.values?.description ?? initialValues?.description ?? ""}
            className={inputClasses}
          />
          {state.errors?.description?.[0] && (
            <p className={errorClasses}>{state.errors.description[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className={labelClasses}>
            Kategori
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={state.values?.category ?? initialValues?.category ?? ""}
            className={inputClasses}
          />
          {state.errors?.category?.[0] && (
            <p className={errorClasses}>{state.errors.category[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="imageUrls" className={labelClasses}>
            Image URLs (satu per baris atau dipisah koma)
          </label>
          <textarea
            id="imageUrls"
            name="imageUrls"
            rows={4}
            defaultValue={state.values?.imageUrls ?? initialValues?.imageUrls.join("\n") ?? ""}
            className={inputClasses}
          />
          {state.errors?.imageUrls?.[0] && (
            <p className={errorClasses}>{state.errors.imageUrls[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="formatOptions" className={labelClasses}>
            Ukuran / Format (opsional)
          </label>
          <input
            id="formatOptions"
            name="formatOptions"
            type="text"
            defaultValue={state.values?.formatOptions ?? initialValues?.formatOptions ?? ""}
            className={inputClasses}
          />
          {state.errors?.formatOptions?.[0] && (
            <p className={errorClasses}>{state.errors.formatOptions[0]}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            defaultChecked={initialValues ? initialValues.isActive : true}
            className="h-4 w-4 rounded border-ink/20 accent-pine"
          />
          <label htmlFor="isActive" className={labelClasses}>
            Aktif (tampil di halaman publik)
          </label>
        </div>
        {state.errors?.isActive?.[0] && <p className={errorClasses}>{state.errors.isActive[0]}</p>}

        <Button type="submit" disabled={isPending} className="mt-2 w-full">
          {isPending ? "Menyimpan..." : submitLabel}
        </Button>
      </form>
    </div>
  );
}
