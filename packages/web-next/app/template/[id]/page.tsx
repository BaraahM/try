'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PlateEditor } from '@/components/editor/plate-editor';
import templatesData from '../../../data/templates.json';

interface Template {
  id: number;
  name: string;
  category: string;
  content: string;
}

const TemplateDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Use useEffect to indicate we're on the client
  useEffect(() => {
    setIsClient(true);

    const templateId = parseInt(params.id as string);
    const foundTemplate = templatesData.find(
      (t) => t.id === templateId,
    ) as Template;

    if (foundTemplate) {
      setTemplate(foundTemplate);
    } else {
      // Redirect to templates page if template not found
      router.push('/home/templates');
    }
  }, [params.id, router]);

  // Only render content after client-side hydration is complete
  if (!isClient) {
    return <div className="h-screen w-full"></div>;
  }

  if (!template) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div>Loading template...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <PlateEditor
        initialTemplate={{
          name: template.name,
          content: template.content,
        }}
      />
    </div>
  );
};

export default TemplateDetailPage;
