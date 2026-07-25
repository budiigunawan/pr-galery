import Image from "next/image";

interface PostmarkFrameProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Circular clipped image frame with a postmark/wax-seal style dashed ring —
 * used for product thumbnails.
 */
export default function PostmarkFrame({ src, alt, size = 160, className }: PostmarkFrameProps) {
  return (
    <div className={cx("relative shrink-0", className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-pine/40" aria-hidden="true" />
      <div className="absolute inset-[6px] overflow-hidden rounded-full border border-pine/70 shadow-card">
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
      </div>
    </div>
  );
}
