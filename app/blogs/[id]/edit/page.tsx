import { Suspense } from 'react';
import EditBlogPageClient from './edit-blog-page-client';

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">読み込み中...</p>
      </div>
    }>
      <EditBlogPageClient id={id} />
    </Suspense>
  );
}
