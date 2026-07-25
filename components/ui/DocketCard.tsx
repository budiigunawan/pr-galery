export interface DocketCardProps {
  question: string;
  answer: string;
  index?: number; // used to vary rotation per card, default 0
  className?: string;
}

const ROTATIONS = [-1, 0, 1];

export default function DocketCard({
  question,
  answer,
  index = 0,
  className,
}: DocketCardProps) {
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      className={`bg-paper docket-edge rounded-card shadow-card p-6${
        className ? ` ${className}` : ""
      }`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <span className="font-mono text-xs text-ink/40">
        Q{String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="font-display font-semibold text-lg text-ink mt-1">
        {question}
      </h3>
      <p className="font-sans text-sm text-ink/80 mt-2 leading-relaxed">
        {answer}
      </p>
    </div>
  );
}
