import ContactForm from "@/components/admin/ContactForm";
import { getContactInfo } from "@/lib/db/queries/contact";
import { upsertContactAction } from "@/lib/actions/contact";

/**
 * Feature 06 Contact-info slice: a singleton settings page, no list/create/
 * delete. Reads the single contact_info row (if any) and hands it to
 * ContactForm as initialValues.
 */
export default async function AdminContactPage() {
  const contact = await getContactInfo();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Info Kontak</h1>

      <ContactForm
        action={upsertContactAction}
        initialValues={
          contact
            ? {
                whatsappNumber: contact.whatsappNumber,
                email: contact.email,
                instagramHandle: contact.instagramHandle,
                shopeeUrl: contact.shopeeUrl,
              }
            : null
        }
      />
    </div>
  );
}
