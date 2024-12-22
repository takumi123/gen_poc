'use client';

import { SearchType } from '../types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchForm() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState<SearchType>(SearchType.PROJECT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    const params = new URLSearchParams({
      keyword: keyword.trim(),
      type: searchType,
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="検索キーワード"
          className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value as SearchType)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value={SearchType.PROJECT}>案件</option>
        <option value={SearchType.COMPANY}>企業</option>
        <option value={SearchType.ENGINEER}>エンジニア</option>
        <option value={SearchType.BLOG}>ブログ</option>
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        検索
      </button>
    </form>
  );
}
