// src/app/dashboard/client/[id]/page.tsx
import ClientDetail from '@/components/client-detail';

// Correctly type the params object according to Next.js expectations
export default function ClientPage({ params }: { params: { id: string } }) {
  return <ClientDetail params={params} />;
}