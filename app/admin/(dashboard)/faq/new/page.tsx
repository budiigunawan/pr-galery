import FaqForm from "@/components/admin/FaqForm";
import { createFaqAction } from "@/lib/actions/faq";

export default function NewFaqPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-ink">FAQ Baru</h1>
      <FaqForm action={createFaqAction} submitLabel="Buat FAQ" />
    </div>
  );
}
