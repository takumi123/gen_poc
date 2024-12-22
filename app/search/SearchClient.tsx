'use client'

import { useEffect, useState } from 'react'
import { ProjectList } from '../components/ProjectList'
import { CompanyList } from '../components/CompanyList'
import { EngineerList } from '../components/EngineerList'
import { useRouter, useSearchParams } from 'next/navigation'
import { Project, SearchType, User } from '../types'
import { useSession } from 'next-auth/react'

export default function SearchClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [companies, setCompanies] = useState<User[]>([])
  const [engineers, setEngineers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { status } = useSession()
  const searchType = (searchParams?.get('type') as SearchType) || SearchType.PROJECT

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status !== 'authenticated') return

    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      try {
        const queryParams = new URLSearchParams(searchParams?.toString())
        const response = await fetch(`/api/search?${queryParams.toString()}`)
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/signin')
            return
          }
          throw new Error('検索に失敗しました')
        }
        const data = await response.json()
        switch (searchType) {
          case SearchType.PROJECT:
            setProjects(data)
            break
          case SearchType.COMPANY:
            setCompanies(data)
            break
          case SearchType.ENGINEER:
            setEngineers(data)
            break
        }
      } catch (error) {
        console.error('Error fetching results:', error)
        setError(error instanceof Error ? error.message : '検索に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [searchParams, status, router, searchType])

  const handleSearch = async (formData: FormData) => {
    const newSearchParams = new URLSearchParams()
    newSearchParams.append('type', searchType)

    switch (searchType) {
      case SearchType.PROJECT:
        const skills = formData.get('skills')?.toString()
        const budget = formData.get('budget')?.toString()
        const startDate = formData.get('startDate')?.toString()
        if (skills) newSearchParams.append('skills', skills)
        if (budget) newSearchParams.append('budget', budget)
        if (startDate) newSearchParams.append('startDate', startDate)
        break

      case SearchType.COMPANY:
        const keyword = formData.get('keyword')?.toString()
        const industry = formData.get('industry')?.toString()
        const location = formData.get('location')?.toString()
        const size = formData.get('size')?.toString()
        if (keyword) newSearchParams.append('keyword', keyword)
        if (industry) newSearchParams.append('industry', industry)
        if (location) newSearchParams.append('location', location)
        if (size) newSearchParams.append('size', size)
        break

      case SearchType.ENGINEER:
        const engineerKeyword = formData.get('keyword')?.toString()
        const engineerSkills = formData.get('skills')?.toString()
        const experienceYears = formData.get('experienceYears')?.toString()
        if (engineerKeyword) newSearchParams.append('keyword', engineerKeyword)
        if (engineerSkills) newSearchParams.append('skills', engineerSkills)
        if (experienceYears) newSearchParams.append('experienceYears', experienceYears)
        break
    }

    router.push(`/search?${newSearchParams.toString()}`)
  }

  if (status === 'loading') {
    return <div className="text-center py-12">読み込み中...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {searchType === SearchType.PROJECT && '案件を探す'}
        {searchType === SearchType.COMPANY && '企業を探す'}
        {searchType === SearchType.ENGINEER && 'エンジニアを探す'}
      </h1>

      <div className="mb-8">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              searchType === SearchType.PROJECT
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => router.push(`/search?type=${SearchType.PROJECT}`)}
          >
            案件検索
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              searchType === SearchType.COMPANY
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => router.push(`/search?type=${SearchType.COMPANY}`)}
          >
            企業検索
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              searchType === SearchType.ENGINEER
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => router.push(`/search?type=${SearchType.ENGINEER}`)}
          >
            エンジニア検索
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">検索条件</h2>
          <form action={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchType === SearchType.PROJECT && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">スキル</label>
                    <input
                      name="skills"
                      type="text"
                      defaultValue={searchParams?.get('skills') || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="例: React, TypeScript"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">単価</label>
                    <select
                      name="budget"
                      defaultValue={searchParams?.get('budget') || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">指定なし</option>
                      <option>〜50万円</option>
                      <option>50万円〜80万円</option>
                      <option>80万円〜100万円</option>
                      <option>100万円〜</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">稼働時期</label>
                    <input
                      name="startDate"
                      type="month"
                      defaultValue={searchParams?.get('startDate') || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </>
              )}

              {searchType === SearchType.COMPANY && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">キーワード</label>
                    <input
                      name="keyword"
                      type="text"
                      defaultValue={searchParams?.get('keyword') || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="企業名、業界など"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">業界</label>
                    <input
                      name="industry"
                      type="text"
                      defaultValue={searchParams?.get('industry') || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="例: IT、製造業"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">所在地</label>
                    <input
                      name="location"
                      type="text"
                      defaultValue={searchParams?.get('location') || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="例: 東京都"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">企業規模</label>
                    <select
                      name="size"
                      defaultValue={searchParams?.get('size') || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">指定なし</option>
                      <option value="1-50">〜50名</option>
                      <option value="51-300">51〜300名</option>
                      <option value="301-1000">301〜1000名</option>
                      <option value="1001">1001名〜</option>
                    </select>
                  </div>
                </>
              )}

              {searchType === SearchType.ENGINEER && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">キーワード</label>
                    <input
                      name="keyword"
                      type="text"
                      defaultValue={searchParams?.get('keyword') || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="名前、自己紹介など"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">スキル</label>
                    <input
                      name="skills"
                      type="text"
                      defaultValue={searchParams?.get('skills') || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="例: React, TypeScript"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">経験年数</label>
                    <select
                      name="experienceYears"
                      defaultValue={searchParams?.get('experienceYears') || ''}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">指定なし</option>
                      <option value="1">1年以上</option>
                      <option value="3">3年以上</option>
                      <option value="5">5年以上</option>
                      <option value="10">10年以上</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                検索する
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">読み込み中...</div>
      ) : (
        <>
          {searchType === SearchType.PROJECT && <ProjectList initialProjects={projects} />}
          {searchType === SearchType.COMPANY && <CompanyList companies={companies} />}
          {searchType === SearchType.ENGINEER && <EngineerList engineers={engineers} />}
        </>
      )}
    </div>
  )
}
