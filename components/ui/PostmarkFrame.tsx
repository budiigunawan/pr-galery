import Image from "next/image";

interface PostmarkFrameProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  showStamp?: boolean;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Circular clipped image frame with a postmark/wax-seal style dashed ring —
 * used for product thumbnails.
 */
export default function PostmarkFrame({ src, alt, size = 160, className, showStamp = true }: PostmarkFrameProps) {
  const stampSize = Math.round(size * 0.2);

  return (
    <div className={cx("relative shrink-0", className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-pine/40" aria-hidden="true" />
      <div className="absolute inset-[6px] overflow-hidden rounded-full border border-pine/70 shadow-card">
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
      </div>
      {showStamp && (
        <div
          className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-paper/90 shadow-card"
          style={{ width: stampSize + 8, height: stampSize + 8 }}
          aria-hidden="true"
        >
          <Image
            src="/logo-mark.png"
            alt=""
            width={stampSize}
            height={stampSize}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}
