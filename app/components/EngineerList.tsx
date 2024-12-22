'use client'

import { User } from '../types'
import Link from 'next/link'
import Image from 'next/image'

interface EngineerListProps {
  engineers: User[]
}

export function EngineerList({ engineers }: EngineerListProps) {
  if (!engineers.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">該当するエンジニアが見つかりませんでした</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {engineers.map((engineer) => (
        <Link
          key={engineer.id}
          href={`/engineers/${engineer.id}`}
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              {engineer.profileImageUrl ? (
                <Image
                  src={engineer.profileImageUrl}
                  alt={engineer.displayName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xl">
                    {engineer.displayName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{engineer.displayName}</h3>
                <p className="text-sm text-gray-500">
                  経験年数: {engineer.experienceYears || '未設定'}年
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 line-clamp-3">
                {engineer.bio || '自己紹介はありません'}
              </p>
              {engineer.skills && Object.keys(engineer.skills).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(engineer.skills).map(([skill, years]) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill} ({years}年)
                    </span>
                  ))}
                </div>
              )}
              {engineer.portfolioUrl && (
                <div className="text-sm">
                  <a
                    href={engineer.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ポートフォリオを見る →
                  </a>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
