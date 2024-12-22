'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, UserRole } from '../types';

interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps) {
  const pathname = usePathname();
  const isCompany = user.role === UserRole.CLIENT;
  const baseUrl = isCompany ? '/companies' : '/engineers';

  const links = [
    {
      href: `${baseUrl}/${user.id}`,
      label: 'プロフィール',
    },
    {
      href: `${baseUrl}/${user.id}/projects`,
      label: isCompany ? '投稿した案件' : '提案した案件',
    },
    {
      href: `${baseUrl}/${user.id}/reviews`,
      label: 'レビュー',
    },
  ];

  return (
    <nav className="border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex -mb-px space-x-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
