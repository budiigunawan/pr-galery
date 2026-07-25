import type { ReactNode } from "react";

export type SectionTone = "kraft" | "paper" | "pine-deep";

interface SectionProps {
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  id?: string;
  children: ReactNode;
}

const TONE_CLASSES: Record<SectionTone, string> = {
  kraft: "bg-kraft text-ink",
  paper: "bg-paper text-ink",
  "pine-deep": "bg-pine-deep text-paper",
};

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Full-width page-band wrapper. Controls the background + text color for a
 * landing-page section via the `tone` prop.
 */
export default function Section({ tone = "kraft", className, containerClassName, id, children }: SectionProps) {
  return (
    <section id={id} className={cx(TONE_CLASSES[tone], className)}>
      <div className={cx("mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
