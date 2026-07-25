import PostmarkFrame from "@/components/ui/PostmarkFrame";
import CatalogTag from "@/components/ui/CatalogTag";

interface ProductCardProps {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  index: number;
  className?: string;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Catalog product tile: postmark-framed photo + catalog tag + name/description
 * over a faint ruled-notebook texture.
 */
export default function ProductCard({ name, description, imageUrl, category, index, className }: ProductCardProps) {
  const catalogLabel = `NO. ${String(index).padStart(2, "0")} · ${category}`;

  return (
    <div className={cx("ruled-bg flex flex-col items-center gap-4 rounded-card bg-paper p-6 text-center shadow-card", className)}>
      <PostmarkFrame src={imageUrl} alt={name} size={140} />
      <CatalogTag label={catalogLabel} />
      <h3 className="font-display text-xl font-semibold text-ink">{name}</h3>
      <p className="font-sans text-sm text-ink/70">{description}</p>
    </div>
  );
}
