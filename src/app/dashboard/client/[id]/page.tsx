// src/app/dashboard/client/[id]/page.tsx
import ClientDetail from "@/components/client-detail";

export default function ClientPage({ params }: { params: { id: string } }) {
  return <ClientDetail params={params} />;
}