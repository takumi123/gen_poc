'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { User, UserRole } from '../types';
import { useState, useRef, useEffect } from 'react';
import { SearchForm } from './SearchForm';

export function Header() {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 150); // 150msの猶予時間を設定
  };

  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-6">
            {/* ロゴ部分 */}
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/globe.svg" alt="Logo" width={32} height={32} />
              <span className="text-2xl font-bold text-gray-900">
                PoC専門のマッチングプラットフォーム
              </span>
            </Link>
            <SearchForm />
          </div>

          {/* ユーザーメニュー */}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/blogs/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                ブログを投稿
              </Link>
              {user.role === UserRole.CLIENT && (
                <Link
                  href="/projects/new"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  案件を投稿
                </Link>
              )}
              <div 
                className="relative pb-2"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={menuRef}
              >
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.profileImageUrl ? (
                      <Image
                        src={user.profileImageUrl}
                        alt={user.displayName || ''}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {user.displayName?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.displayName}
                  </span>
                </button>

                {/* ドロップダウンメニュー */}
                <div 
                  className={`absolute right-0 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 ${
                    isMenuOpen ? 'block' : 'hidden'
                  }`}
                  style={{ top: 'calc(100% - 8px)' }}
                >
                  <Link
                    href={`/${user.role === UserRole.CLIENT ? 'companies' : 'engineers'}/${user.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    プロフィール
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ログアウト
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900"
              >
                ログイン
              </Link>
              <Link
                href="/auth/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                新規登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
