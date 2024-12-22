import { Suspense } from 'react';
import BlogPageClient from './blog-page-client';

interface BlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">読み込み中...</p>
      </div>
    }>
      <BlogPageClient id={id} />
    </Suspense>
  );
}
