'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import '@uiw/react-markdown-preview/markdown.css';

const MDPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
    profileImageUrl?: string;
    role: string;
  };
}

interface BlogPageClientProps {
  id: string;
}

export default function BlogPageClient({ id }: BlogPageClientProps) {
  const { data: session } = useSession();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              {blog.author.profileImageUrl ? (
                <Image
                  src={blog.author.profileImageUrl}
                  alt={blog.author.displayName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    {blog.author.displayName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <Link
                href={`/users/${blog.author.id}`}
                className="text-sm font-medium text-gray-900 hover:text-indigo-600"
              >
                {blog.author.displayName}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="prose max-w-none" data-color-mode="light">
            <MDPreview source={blog.content} />
          </div>
        </div>
      </article>

      {session?.user?.id === blog.author.id && (
        <div className="mt-6 flex justify-end space-x-4">
          <Link
            href={`/blogs/${blog.id}/edit`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            編集
          </Link>
        </div>
      )}
    </div>
  );
}
