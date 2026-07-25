import Image from "next/image";

export interface WashiTapeFrameProps {
  src: string;
  alt: string;
  rotate?: number; // frame rotation in degrees, default -2
  className?: string;
}

export default function WashiTapeFrame({
  src,
  alt,
  rotate = -2,
  className,
}: WashiTapeFrameProps) {
  return (
    <div
      className={`relative rounded-card shadow-card bg-paper p-2${
        className ? ` ${className}` : ""
      }`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* Washi tape strip - top left */}
      <div
        className="absolute -top-2 -left-3 h-6 w-16 -rotate-12 bg-kraft/80 shadow-sm"
        aria-hidden="true"
      />
      {/* Washi tape strip - bottom right */}
      <div
        className="absolute -bottom-2 -right-3 h-6 w-16 rotate-12 bg-kraft/80 shadow-sm"
        aria-hidden="true"
      />

      <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-card)-0.25rem)]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
