'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BlogForm } from '../../components/BlogForm';

export default function NewBlogPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (title: string, content: string) => {
    if (!session?.user?.id) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          published: true,
        }),
      });

      if (!response.ok) {
        throw new Error('ブログの投稿に失敗しました');
      }

      const blog = await response.json();
      router.push(`/blogs/${blog.id}`);
      router.refresh();
    } catch (error) {
      console.error('ブログ投稿エラー:', error);
      alert('ブログの投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">
          ブログを投稿するにはログインが必要です
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">新規ブログ投稿</h1>
      <BlogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
