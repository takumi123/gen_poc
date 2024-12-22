'use client';

import { BlogPost } from '@/app/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-markdown-preview/markdown.css';

const MDPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface BlogListProps {
  posts: BlogPost[];
  showAuthor?: boolean;
  isOwner?: boolean;
  currentUserId?: string;
}

export function BlogList({ posts, showAuthor = true, isOwner = false, currentUserId }: BlogListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (postId: string) => {
    if (!confirm('この記事を削除してもよろしいですか？')) return;

    setDeletingId(postId);
    try {
      const response = await fetch(`/api/blogs/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('記事の削除に失敗しました');
      }

      router.refresh();
    } catch (error) {
      console.error('記事削除エラー:', error);
      alert('記事の削除に失敗しました');
    } finally {
      setDeletingId(null);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">まだ記事がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <Link
                  href={`/blogs/${post.id}`}
                  className="text-xl font-semibold text-gray-900 hover:text-indigo-600"
                >
                  {post.title}
                </Link>
                {showAuthor && (
                  <div className="mt-2 flex items-center">
                    <div className="flex-shrink-0">
                      {post.author.profileImageUrl ? (
                        <Image
                          src={post.author.profileImageUrl}
                          alt={post.author.displayName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            {post.author.displayName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <Link
                        href={`/users/${post.author.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {post.author.displayName}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {isOwner && currentUserId === post.authorId && (
                <div className="flex space-x-2">
                  <Link
                    href={`/blogs/${post.id}/edit`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white ${
                      deletingId === post.id
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {deletingId === post.id ? '削除中...' : '削除'}
                  </button>
                </div>
              )}
            </div>
            <div className="mt-4 prose max-w-none" data-color-mode="light">
              <MDPreview source={post.content.slice(0, 200) + '...'} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
