import PolaroidFrame from '@/components/ui/PolaroidFrame';
import CatalogTag from '@/components/ui/CatalogTag';
import Button from '@/components/ui/Button';
import { safeWhatsAppLink } from '@/lib/utils/whatsapp';

interface ProductCardProps {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  index: number;
  whatsappNumber: string | null;
  className?: string;
}

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Catalog product tile: polaroid-framed photo (handwritten name caption) + catalog tag + description.
 */
export default function ProductCard({
  name,
  description,
  imageUrl,
  category,
  index,
  whatsappNumber,
  className,
}: ProductCardProps) {
  const catalogLabel = `NO. ${String(index).padStart(2, '0')} · ${category}`;
  const tilt = index % 2 === 0 ? 'left' : 'right';
  const orderLink = whatsappNumber
    ? safeWhatsAppLink(whatsappNumber, `Halo, saya mau pesan ${name}`)
    : null;

  return (
    <div
      className={cx(
        'group flex flex-col items-center gap-4 text-center',
        className,
      )}
    >
      <PolaroidFrame src={imageUrl} alt={name} caption={name} tilt={tilt} />
      <CatalogTag label={catalogLabel} />
      <p className="font-sans text-sm text-ink/70">{description}</p>
      {orderLink && (
        <Button
          href={orderLink}
          variant="primary"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto"
        >
          Pesan via WhatsApp
        </Button>
      )}
    </div>
  );
}
