export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  tagline?: string;
  align?: "left" | "center";
  tone?: "default" | "inverted";
  className?: string;
}

const ALIGN_CLASSES: Record<NonNullable<SectionHeadingProps["align"]>, string> = {
  left: "text-left items-start",
  center: "text-center items-center",
};

const TITLE_TONE_CLASSES: Record<NonNullable<SectionHeadingProps["tone"]>, string> = {
  default: "text-ink",
  inverted: "text-paper",
};

const TAGLINE_TONE_CLASSES: Record<NonNullable<SectionHeadingProps["tone"]>, string> = {
  default: "text-ink/70",
  inverted: "text-paper/80",
};

export default function SectionHeading({
  eyebrow,
  title,
  tagline,
  align = "left",
  tone = "default",
  className,
}: SectionHeadingProps) {
  return (
    <div className={["flex flex-col", ALIGN_CLASSES[align], className ?? ""].filter(Boolean).join(" ")}>
      {eyebrow ? (
        <span className="font-mono text-xs uppercase tracking-widest text-stamp mb-2">
          {eyebrow}
        </span>
      ) : null}
      <h2 className={["font-display font-semibold text-3xl md:text-4xl", TITLE_TONE_CLASSES[tone]].join(" ")}>
        {title}
      </h2>
      {tagline ? (
        <p className={["font-display italic text-lg md:text-xl mt-3", TAGLINE_TONE_CLASSES[tone]].join(" ")}>
          {tagline}
        </p>
      ) : null}
    </div>
  );
}
