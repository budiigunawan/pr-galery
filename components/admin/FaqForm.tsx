"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import type { FaqFormState } from "@/lib/actions/faq";

const INITIAL_STATE: FaqFormState = { errors: undefined, values: undefined };

/**
 * Shared create/edit form for FAQ entries. The `action` prop is either
 * createFaqAction directly, or updateFaqAction pre-bound with an id via
 * `updateFaqAction.bind(null, id)` (see app/admin/(dashboard)/faq/[id]/edit).
 */
export default function FaqForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (prevState: FaqFormState, formData: FormData) => Promise<FaqFormState>;
  initialValues?: { question: string; answer: string };
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  const questionValue = state.values?.question ?? initialValues?.question ?? "";
  const answerValue = state.values?.answer ?? initialValues?.answer ?? "";
  const questionError = state.errors?.question?.[0];
  const answerError = state.errors?.answer?.[0];

  return (
    <div className="docket-edge rounded-b-card bg-paper px-8 py-8 shadow-card">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="question" className="font-sans text-sm font-semibold text-ink">
            Pertanyaan
          </label>
          <input
            id="question"
            name="question"
            type="text"
            required
            defaultValue={questionValue}
            aria-invalid={questionError ? true : undefined}
            aria-describedby={questionError ? "question-error" : undefined}
            className="rounded-[4px] border border-ink/20 bg-paper px-4 py-2.5 font-sans text-ink outline-none focus-visible:ring-2 focus-visible:ring-stamp"
          />
          {questionError && (
            <p id="question-error" role="alert" className="text-sm text-stamp">
              {questionError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="answer" className="font-sans text-sm font-semibold text-ink">
            Jawaban
          </label>
          <textarea
            id="answer"
            name="answer"
            required
            rows={5}
            defaultValue={answerValue}
            aria-invalid={answerError ? true : undefined}
            aria-describedby={answerError ? "answer-error" : undefined}
            className="rounded-[4px] border border-ink/20 bg-paper px-4 py-2.5 font-sans text-ink outline-none focus-visible:ring-2 focus-visible:ring-stamp"
          />
          {answerError && (
            <p id="answer-error" role="alert" className="text-sm text-stamp">
              {answerError}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" disabled={isPending} className="mt-2 w-full">
          {isPending ? "Menyimpan..." : submitLabel}
        </Button>
      </form>
    </div>
  );
}
