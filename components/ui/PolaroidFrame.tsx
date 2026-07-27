import Image from "next/image";

interface PolaroidFrameProps {
  src: string;
  alt: string;
  caption: string;
  tilt: "left" | "right";
  className?: string;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Physical polaroid/instant-photo style frame with a deep caption margin —
 * used for product thumbnails.
 */
export default function PolaroidFrame({ src, alt, caption, tilt, className }: PolaroidFrameProps) {
  return (
    <div
      className={cx(
        "relative w-full rounded-card bg-paper p-3 pb-12 shadow-[0_6px_16px_rgba(43,42,37,0.18)] transition-transform duration-300 ease-out",
        tilt === "left" ? "-rotate-2" : "rotate-2",
        "group-hover:rotate-0 group-hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-[4px]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>
      <span className="absolute inset-x-0 bottom-3 truncate px-4 text-center font-hand text-2xl text-stamp">
        {caption}
      </span>
    </div>
  );
}
