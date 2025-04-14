// src/app/dashboard/client/[id]/page.tsx
import ClientDetail from '@/components/client-detail';

interface PageParams {
    id: string;
  }
  
  export default function ClientPage({ params }: { params: PageParams }) {
    return (
      <div>
        {/* Import and use your client detail component */}
        <ClientDetail id={params.id} />
      </div>
    );
  }