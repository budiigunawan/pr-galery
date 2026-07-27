"use client";

/**
 * Confirm-then-delete control. Wraps a form bound to a Server Action that
 * accepts a single hidden "id" field and deletes without further prompting
 * (the confirm step happens here, client-side, before submission).
 */
export default function DeleteButton({
  id,
  action,
  confirmMessage = "Yakin ingin menghapus item ini?",
  label = "Hapus",
}: {
  id: string;
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="font-sans text-sm font-semibold text-stamp hover:underline"
      >
        {label}
      </button>
    </form>
  );
}
