"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import type { ContactFormState } from "@/lib/actions/contact";

const INITIAL_STATE: ContactFormState = {
  errors: undefined,
  values: undefined,
  success: undefined,
};

export interface ContactFormValues {
  whatsappNumber: string;
  email: string;
  instagramHandle: string;
  shopeeUrl: string;
}

interface ContactFormProps {
  action: (prevState: ContactFormState, formData: FormData) => Promise<ContactFormState>;
  initialValues: ContactFormValues | null;
}

interface FieldConfig {
  name: keyof ContactFormValues;
  label: string;
  type: string;
  placeholder?: string;
}

const FIELDS: FieldConfig[] = [
  {
    name: "whatsappNumber",
    label: "Nomor WhatsApp",
    type: "text",
    placeholder: "08xxxxxxxxxx",
  },
  { name: "email", label: "Email", type: "email" },
  { name: "instagramHandle", label: "Instagram (tanpa @)", type: "text" },
  { name: "shopeeUrl", label: "Link Shopee", type: "text" },
];

/**
 * Singleton settings form for Feature 06's Contact-info slice. Mirrors the
 * visual structure of app/admin/login/page.tsx's useActionState form.
 */
export default function ContactForm({ action, initialValues }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  return (
    <div className="docket-edge rounded-b-card bg-paper px-8 py-8 shadow-card">
      <form action={formAction} className="flex flex-col gap-4">
        {FIELDS.map((field) => {
          const value = state.values?.[field.name] ?? initialValues?.[field.name] ?? "";
          const fieldErrors = state.errors?.[field.name];
          const errorId = `${field.name}-error`;

          return (
            <div key={field.name} className="flex flex-col gap-1.5">
              <label
                htmlFor={field.name}
                className="font-sans text-sm font-semibold text-ink"
              >
                {field.label}
              </label>
              <input
                key={value}
                id={field.name}
                name={field.name}
                type={field.type}
                defaultValue={value}
                placeholder={field.placeholder}
                aria-invalid={fieldErrors ? true : undefined}
                aria-describedby={fieldErrors ? errorId : undefined}
                className="rounded-[4px] border border-ink/20 bg-paper px-4 py-2.5 font-sans text-ink outline-none focus-visible:ring-2 focus-visible:ring-stamp"
              />
              {fieldErrors?.[0] && (
                <p id={errorId} role="alert" className="font-sans text-sm text-stamp">
                  {fieldErrors[0]}
                </p>
              )}
            </div>
          );
        })}

        {state.success && (
          <p className="font-sans text-sm text-pine">Tersimpan.</p>
        )}

        <Button type="submit" variant="primary" disabled={isPending} className="mt-2 w-full">
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
    </div>
  );
}
