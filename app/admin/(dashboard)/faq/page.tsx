import Link from "next/link";
import Button from "@/components/ui/Button";
import DeleteButton from "@/components/admin/DeleteButton";
import SortOrderControls from "@/components/admin/SortOrderControls";
import { listFaqItems } from "@/lib/db/queries/faq";
import { deleteFaqAction, reorderFaqAction } from "@/lib/actions/faq";

export default async function AdminFaqPage() {
  const items = await listFaqItems();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink">FAQ</h1>
        <Button href="/admin/faq/new">FAQ Baru</Button>
      </div>

      {items.length === 0 ? (
        <p className="font-sans text-sm text-ink/60">Belum ada FAQ.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="docket-edge rounded-b-card bg-paper px-6 py-4 shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-base font-semibold text-ink">
                    {item.question}
                  </p>
                  <p className="mt-1 line-clamp-1 font-sans text-sm text-ink/60">
                    {item.answer}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/faq/${item.id}/edit`}
                    className="font-sans text-sm font-semibold text-pine hover:underline"
                  >
                    Edit
                  </Link>
                  <SortOrderControls
                    id={item.id}
                    action={reorderFaqAction}
                    isFirst={i === 0}
                    isLast={i === items.length - 1}
                  />
                  <DeleteButton
                    id={item.id}
                    action={deleteFaqAction}
                    confirmMessage="Yakin ingin menghapus FAQ ini?"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
