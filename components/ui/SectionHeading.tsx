export type SectionHeadingTone = "light" | "dark";

interface SectionHeadingProps {
  heading: string;
  tagline?: string;
  taglinePosition?: "above" | "below";
  tone?: SectionHeadingTone;
  className?: string;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Consistent Fraunces display heading with an optional italic tagline,
 * used to open each landing-page section.
 */
export default function SectionHeading({
  heading,
  tagline,
  taglinePosition = "above",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const headingColor = tone === "dark" ? "text-paper" : "text-ink";
  const taglineColor = tone === "dark" ? "text-paper/70" : "text-pine";

  const taglineEl = tagline ? (
    <p className={cx("font-display text-lg italic", taglineColor)}>{tagline}</p>
  ) : null;

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      {taglinePosition === "above" && taglineEl}
      <h2 className={cx("font-display text-3xl font-semibold sm:text-4xl", headingColor)}>{heading}</h2>
      {taglinePosition === "below" && taglineEl}
    </div>
  );
}
