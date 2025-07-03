'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const TemplateRedirectPage = () => {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new template route
    router.replace(`/template/${params.id}`);
  }, [params.id, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div>Redirecting to template...</div>
    </div>
  );
};

export default TemplateRedirectPage;
