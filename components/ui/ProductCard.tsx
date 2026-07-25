import PostmarkFrame from "./PostmarkFrame";
import CatalogTag from "./CatalogTag";

export interface ProductCardProps {
  imageSrc: string;
  imageAlt: string;
  tag: string; // e.g. "NO. 01 · A5" — passed as children into CatalogTag
  name: string;
  description: string;
  className?: string;
}

export default function ProductCard({
  imageSrc,
  imageAlt,
  tag,
  name,
  description,
  className,
}: ProductCardProps) {
  return (
    <div
      className={`bg-paper rounded-card shadow-card ruled-bg flex flex-col items-center p-6 ${className ?? ""}`}
    >
      <PostmarkFrame src={imageSrc} alt={imageAlt} size={140} />
      <CatalogTag className="mt-3">{tag}</CatalogTag>
      <h3 className="font-display font-semibold text-xl text-ink mt-3 text-center">
        {name}
      </h3>
      <p className="font-sans text-sm text-ink/70 mt-1 text-center leading-relaxed">
        {description}
      </p>
    </div>
  );
}
