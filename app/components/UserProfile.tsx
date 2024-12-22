import { User, UserRole } from '../types';
import Image from 'next/image';

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  const isCompany = user.role === UserRole.CLIENT;
  const isEngineer = user.role === UserRole.ENGINEER;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-6 mb-4">
        <div className="relative w-24 h-24">
          {user.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt={user.displayName}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-500">
                {user.displayName.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
          <p className="text-gray-600">{user.email}</p>
          {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
        </div>
      </div>

      {isCompany && (
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-3">企業情報</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">会社名</p>
              <p className="font-medium">{user.companyName || '未設定'}</p>
            </div>
            <div>
              <p className="text-gray-600">従業員数</p>
              <p className="font-medium">{user.companySize || '未設定'}</p>
            </div>
            <div>
              <p className="text-gray-600">業種</p>
              <p className="font-medium">{user.industry || '未設定'}</p>
            </div>
            <div>
              <p className="text-gray-600">所在地</p>
              <p className="font-medium">{user.location || '未設定'}</p>
            </div>
          </div>
        </div>
      )}

      {isEngineer && (
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-3">エンジニア情報</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">経験年数</p>
              <p className="font-medium">{user.experienceYears || '未設定'} 年</p>
            </div>
            <div>
              <p className="text-gray-600">ポートフォリオ</p>
              {user.portfolioUrl ? (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  表示する
                </a>
              ) : (
                <p className="font-medium">未設定</p>
              )}
            </div>
          </div>

          {user.skills && (
            <div className="mt-4">
              <p className="text-gray-600 mb-2">スキル</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(user.skills as Record<string, number>).map(
                  ([skill, years]) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill} ({years}年)
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-3">アカウント情報</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">ステータス</p>
            <p className="font-medium">
              {user.status === 'ACTIVE' ? '有効' : '停止中'}
            </p>
          </div>
          <div>
            <p className="text-gray-600">メール認証</p>
            <p className="font-medium">
              {user.emailVerifiedAt ? '認証済み' : '未認証'}
            </p>
          </div>
          <div>
            <p className="text-gray-600">登録日</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">最終更新</p>
            <p className="font-medium">
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
