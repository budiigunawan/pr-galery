import Image from "next/image";

export interface PostmarkFrameProps {
  src: string;
  alt: string;
  size?: number; // diameter in px, default 160
  className?: string;
}

export default function PostmarkFrame({
  src,
  alt,
  size = 160,
  className,
}: PostmarkFrameProps) {
  return (
    <div
      className={`relative rounded-full overflow-hidden border-2 border-pine p-1 ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-dashed border-pine/60 p-1">
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
        </div>
      </div>
    </div>
  );
}
