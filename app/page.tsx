import { Project } from './types'
import Link from 'next/link'
import { ProjectList } from './components/ProjectList'
import { headers } from 'next/headers'

async function getProjects(): Promise<Project[]> {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

  const res = await fetch(`${protocol}://${host}/api/projects`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error('プロジェクトの取得に失敗しました')
  }
  return res.json()
}

export default async function Home() {
  const projects = await getProjects()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">プロジェクト一覧</h2>
        <Link
          href="/projects/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          新規プロジェクト作成
        </Link>
      </div>

      <ProjectList initialProjects={projects} />
    </div>
  )
}
