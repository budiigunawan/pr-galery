interface CatalogTagProps {
  label: string;
  className?: string;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Small monospace pill label used for catalog/utility copy, e.g. "NO. 01 · A5".
 * Stamp red is used only as a border/text accent here, never as a fill.
 */
export default function CatalogTag({ label, className }: CatalogTagProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border border-stamp bg-paper px-3 py-1 font-mono text-xs uppercase tracking-wide text-stamp",
        className,
      )}
    >
      {label}
    </span>
  );
}
