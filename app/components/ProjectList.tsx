'use client'

import { useState } from 'react'
import { Project } from '../types'
import { ProjectCard } from './ProjectCard'

interface ProjectListProps {
  initialProjects: Project[]
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('全て')

  const filteredProjects = initialProjects.filter((project) => {
    if (selectedStatus === '全て') return true
    if (selectedStatus === '募集中') return project.status === 'OPEN'
    if (selectedStatus === '進行中') return project.status === 'IN_PROGRESS'
    if (selectedStatus === '完了') return project.status === 'CLOSED'
    return true
  })

  const statusButtons = ['全て', '募集中', '進行中', '完了']

  return (
    <div>
      <div className="mb-6">
        <div className="flex space-x-4">
          {statusButtons.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                selectedStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            プロジェクトがありません
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedStatus === '全て'
              ? '新しいプロジェクトを作成して始めましょう'
              : `${selectedStatus}のプロジェクトはありません`}
          </p>
        </div>
      )}
    </div>
  )
}
