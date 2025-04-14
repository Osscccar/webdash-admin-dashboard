// src/app/dashboard/client/[id]/page.tsx
import ClientDetail from './client-detail';

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <ClientDetail params={resolvedParams} />;
}
