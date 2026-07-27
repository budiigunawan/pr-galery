interface TicketStepProps {
  step: number;
  title: string;
  description: string;
  className?: string;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Small perforated ticket stub used to lay out a sequential process step,
 * echoing DocketCard's `No. 0X` mono/stamp numbering treatment.
 */
export default function TicketStep({ step, title, description, className }: TicketStepProps) {
  return (
    <div
      className={cx(
        "docket-edge rounded-b-card bg-paper px-6 pb-6 pt-6 shadow-card",
        className,
      )}
    >
      <p className="font-mono text-xs uppercase tracking-wide text-stamp">No. {String(step).padStart(2, "0")}</p>
      <h3 className="mt-2 font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 font-sans text-sm text-ink/70">{description}</p>
    </div>
  );
}
