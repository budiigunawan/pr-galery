"use client";

/**
 * Up/down controls to nudge a row's sortOrder. Bound to a Server Action that
 * accepts hidden "id" and "direction" ("up" | "down") fields and re-derives
 * the full ordered id list server-side before persisting.
 */
export default function SortOrderControls({
  id,
  action,
  isFirst,
  isLast,
}: {
  id: string;
  action: (formData: FormData) => void | Promise<void>;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="up" />
        <button
          type="submit"
          disabled={isFirst}
          aria-label="Pindahkan ke atas"
          className="rounded border border-ink/20 px-2 py-1 font-sans text-xs text-ink disabled:opacity-30"
        >
          ↑
        </button>
      </form>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="direction" value="down" />
        <button
          type="submit"
          disabled={isLast}
          aria-label="Pindahkan ke bawah"
          className="rounded border border-ink/20 px-2 py-1 font-sans text-xs text-ink disabled:opacity-30"
        >
          ↓
        </button>
      </form>
    </div>
  );
}
