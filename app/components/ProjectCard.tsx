import { Project, ProjectStatus } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    [ProjectStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [ProjectStatus.OPEN]: 'bg-green-100 text-green-800',
    [ProjectStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [ProjectStatus.CLOSED]: 'bg-gray-100 text-gray-800',
    [ProjectStatus.CANCELLED]: 'bg-red-100 text-red-800',
  }

  const statusText = {
    [ProjectStatus.DRAFT]: '下書き',
    [ProjectStatus.OPEN]: '募集中',
    [ProjectStatus.IN_PROGRESS]: '進行中',
    [ProjectStatus.CLOSED]: '完了',
    [ProjectStatus.CANCELLED]: 'キャンセル',
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
          <p className="mt-2 text-gray-600">{project.description}</p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColors[project.status]
          }`}
        >
          {statusText[project.status]}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            {project.user.profileImageUrl ? (
              <img
                className="h-8 w-8 rounded-full"
                src={project.user.profileImageUrl}
                alt={project.user.displayName}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {project.user.displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">{project.user.displayName}</div>
        </div>
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(project.createdAt), {
            addSuffix: true,
            locale: ja,
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-gray-900">
          予算: ¥{project.budget.toLocaleString()}
        </div>
        <div className="text-gray-500">
          提案数: {project.proposals?.length ?? 0}件
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          詳細を見る
        </Link>
      </div>
    </div>
  )
}
