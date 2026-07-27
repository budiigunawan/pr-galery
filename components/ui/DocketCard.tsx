interface DocketCardProps {
  question: string;
  answer: string;
  index: number;
  className?: string;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * FAQ entry styled as a torn receipt/docket stub — perforated top edge via
 * the `docket-edge` utility, with a slight alternating rotation per index.
 */
export default function DocketCard({ question, answer, index, className }: DocketCardProps) {
  const rotationClass = index % 2 === 0 ? "-rotate-1" : "rotate-1";

  return (
    <div
      className={cx(
        "docket-edge rounded-b-card bg-paper px-6 pb-6 pt-6 shadow-card transition-transform duration-200 ease-out [@media(hover:hover)]:hover:rotate-0",
        rotationClass,
        className,
      )}
    >
      <p className="font-mono text-xs uppercase tracking-wide text-stamp">No. {String(index + 1).padStart(2, "0")}</p>
      <h3 className="mt-2 font-display text-lg font-semibold text-ink">{question}</h3>
      <p className="mt-2 font-sans text-sm text-ink/70">{answer}</p>
    </div>
  );
}
