'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BlogForm } from '../../../components/BlogForm';

interface EditBlogPageClientProps {
  id: string;
}

export default function EditBlogPageClient({ id }: EditBlogPageClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [blog, setBlog] = useState<{ title: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${id}`);
        if (!response.ok) {
          throw new Error('ブログ記事の取得に失敗しました');
        }
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('ブログ取得エラー:', error);
        setError('ブログ記事の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (title: string, content: string) => {
    if (!session?.user?.id) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
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
        throw new Error('ブログの更新に失敗しました');
      }

      router.push(`/blogs/${id}`);
      router.refresh();
    } catch (error) {
      console.error('ブログ更新エラー:', error);
      alert('ブログの更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この記事を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('記事の削除に失敗しました');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('記事削除エラー:', error);
      alert('記事の削除に失敗しました');
    }
  };

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">
          ブログを編集するにはログインが必要です
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-red-600">{error || 'ブログ記事が見つかりません'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ブログ記事の編集</h1>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          削除
        </button>
      </div>
      <BlogForm
        initialTitle={blog.title}
        initialContent={blog.content}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
