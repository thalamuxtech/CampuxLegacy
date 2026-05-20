import { adminStore } from '@/lib/admin-store';
import { PageHeader } from '@/components/admin/page-header';
import { ContactsInbox } from '@/components/admin/contacts-inbox';

export const dynamic = 'force-dynamic';

export default function ContactsAdminPage() {
  const items = adminStore().contacts;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communication"
        title="Contact inbox"
        subtitle="Messages submitted through the public contact form."
      />
      <ContactsInbox initial={items} />
    </div>
  );
}
