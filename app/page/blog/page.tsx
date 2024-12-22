import React from 'react';
import Image from 'next/image';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "PoCプロジェクトを成功に導く5つのポイント",
    excerpt: "PoCプロジェクトを効率的に進めるためのポイントをご紹介します。要件定義から成果物の評価まで、プロジェクトの各フェーズで押さえるべきポイントを解説します。",
    author: "山田 太郎",
    date: "2024-01-15",
    category: "プロジェクト管理",
    readTime: "5分"
  },
  {
    id: 2,
    title: "最新技術トレンド：2024年のPoC動向",
    excerpt: "2024年に注目すべき技術トレンドと、それらを活用したPoCの実施例をご紹介。AI、ブロックチェーン、IoTなど、各分野での活用事例を交えて解説します。",
    author: "鈴木 一郎",
    date: "2024-01-10",
    category: "技術動向",
    readTime: "8分"
  },
  {
    id: 3,
    title: "エンジニアのためのPoC提案書作成ガイド",
    excerpt: "効果的なPoC提案書の作成方法について解説します。クライアントのニーズを的確に捉え、技術的な実現可能性を明確に伝えるためのポイントをご紹介。",
    author: "佐藤 花子",
    date: "2024-01-05",
    category: "キャリア",
    readTime: "6分"
  },
  {
    id: 4,
    title: "成功事例に学ぶ：製造業でのPoC活用",
    excerpt: "製造業における成功したPoCプロジェクトの事例をご紹介。IoTセンサーを活用した工場の生産性向上から、AIによる品質管理まで、具体的な成果をご紹介します。",
    author: "田中 次郎",
    date: "2024-01-01",
    category: "事例紹介",
    readTime: "7分"
  },
  {
    id: 5,
    title: "PoCにおけるセキュリティ対策の重要性",
    excerpt: "PoCプロジェクトでも忘れてはいけないセキュリティ対策について解説します。データ保護から認証まで、実装すべき基本的な対策をご紹介。",
    author: "中村 美咲",
    date: "2023-12-25",
    category: "セキュリティ",
    readTime: "6分"
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ブログ</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <Image
              src="https://placehold.co/800x400"
              alt="Featured post"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <span className="text-white text-sm bg-blue-600 px-2 py-1 rounded">注目記事</span>
              <h2 className="text-2xl font-bold text-white mt-2">
                2024年のPoCトレンド予測
              </h2>
              <p className="text-gray-200 mt-2">
                新年を迎え、2024年のPoCトレンドを予測。
                最新技術の動向から、企業のニーズまで徹底解説します。
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {blogPosts.map(post => (
            <article key={post.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray-500">{post.date}</span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">
                  読了時間: {post.readTime}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
                <a href={`/footer/blog/${post.id}`}>{post.title}</a>
              </h2>
              
              <p className="text-gray-600 mb-4">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <span className="text-sm text-gray-600">{post.author}</span>
                </div>
                <a
                  href={`/footer/blog/${post.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  続きを読む →
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">カテゴリー</h2>
          <div className="flex flex-wrap gap-4">
            {Array.from(new Set(blogPosts.map(post => post.category))).map(category => (
              <a
                key={category}
                href={`/footer/blog/category/${category}`}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm text-gray-700"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
