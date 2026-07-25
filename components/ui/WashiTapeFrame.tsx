import Image from "next/image";

interface WashiTapeFrameProps {
  src: string;
  alt: string;
  className?: string;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Hero-specific rotated photo frame with two washi-tape-style pseudo-corners
 * holding the image in place.
 */
export default function WashiTapeFrame({ src, alt, className }: WashiTapeFrameProps) {
  return (
    <div className={cx("relative inline-block -rotate-2 rounded-card bg-paper p-3 shadow-card", className)}>
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-[4px]">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
      </div>
      <span
        className="absolute -top-3 -left-5 h-7 w-20 -rotate-12 border border-ink/10 bg-kraft/90 shadow-card"
        aria-hidden="true"
      />
      <span
        className="absolute -bottom-3 -right-5 h-7 w-20 rotate-12 border border-ink/10 bg-kraft/90 shadow-card"
        aria-hidden="true"
      />
    </div>
  );
}
