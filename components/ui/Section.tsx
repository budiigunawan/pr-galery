import type { ReactNode } from "react";

export interface SectionProps {
  tone?: "kraft" | "paper" | "pine-deep";
  id?: string;
  className?: string;
  children: ReactNode;
}

const TONE_CLASSES: Record<NonNullable<SectionProps["tone"]>, string> = {
  kraft: "bg-kraft",
  paper: "bg-paper",
  "pine-deep": "bg-pine-deep text-paper",
};

export default function Section({
  tone = "kraft",
  id,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={["w-full py-16 md:py-24", TONE_CLASSES[tone], className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
