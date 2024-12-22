'use client'

import { User } from '../types'
import Link from 'next/link'
import Image from 'next/image'

interface CompanyListProps {
  companies: User[]
}

export function CompanyList({ companies }: CompanyListProps) {
  if (!companies.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">該当する企業が見つかりませんでした</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <Link
          key={company.id}
          href={`/companies/${company.id}`}
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              {company.profileImageUrl ? (
                <Image
                  src={company.profileImageUrl}
                  alt={company.companyName || ''}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xl">
                    {(company.companyName || '').charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{company.companyName}</h3>
                <p className="text-sm text-gray-500">{company.industry}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 line-clamp-3">
                {company.bio || '説明はありません'}
              </p>
              <div className="text-sm text-gray-500">
                <span className="inline-block mr-4">
                  規模: {company.companySize || '未設定'}名
                </span>
                <span className="inline-block">
                  所在地: {company.location || '未設定'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
