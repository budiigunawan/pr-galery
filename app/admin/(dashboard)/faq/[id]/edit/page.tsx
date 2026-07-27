import { notFound } from "next/navigation";
import FaqForm from "@/components/admin/FaqForm";
import { getFaqItemById } from "@/lib/db/queries/faq";
import { updateFaqAction } from "@/lib/actions/faq";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getFaqItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Edit FAQ</h1>
      <FaqForm
        action={updateFaqAction.bind(null, id)}
        initialValues={{ question: item.question, answer: item.answer }}
        submitLabel="Simpan Perubahan"
      />
    </div>
  );
}
