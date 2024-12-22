import { Project, Proposal } from '../../types'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ProjectProposals } from '../../components/ProjectProposals'

async function getProject(id: string): Promise<Project> {
  const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    if (res.status === 404) {
      notFound()
    }
    throw new Error('プロジェクトの取得に失敗しました')
  }
  return res.json()
}

async function getProposals(projectId: string): Promise<Proposal[]> {
  const res = await fetch(
    `http://localhost:3000/api/proposals?projectId=${projectId}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) {
    throw new Error('提案の取得に失敗しました')
  }
  return res.json()
}

export default async function ProjectDetail({
  params,
}: {
  params: { id: string }
}) {
  const project = await getProject(params.id)
  const proposals = await getProposals(params.id)

  const statusColors = {
    OPEN: 'bg-green-100 text-green-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    CLOSED: 'bg-gray-100 text-gray-800',
  }

  const statusText = {
    OPEN: '募集中',
    IN_PROGRESS: '進行中',
    CLOSED: '完了',
  }

  // TODO: 実際のユーザー情報を使用する
  const dummyUser = {
    id: 'dummy-engineer-id',
    role: 'ENGINEER' as const,
  }

  const isProjectOwner = project.user.id === dummyUser.id
  const isEngineer = dummyUser.role === 'ENGINEER'
  const canSubmitProposal =
    isEngineer && project.status === 'OPEN' && !proposals.some(p => p.engineerId === dummyUser.id)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {project.user.profileImageUrl ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={project.user.profileImageUrl}
                      alt={project.user.displayName}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {project.user.displayName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {project.user.displayName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(project.createdAt), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[project.status]
            }`}
          >
            {statusText[project.status]}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900">プロジェクトの説明</h2>
          <div className="mt-2 text-gray-700 space-y-4">
            <p>{project.description}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">予算</h2>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                ¥{project.budget.toLocaleString()}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">提案数</h2>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {proposals.length}件
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProjectProposals
        project={project}
        proposals={proposals}
        isProjectOwner={isProjectOwner}
        canSubmitProposal={canSubmitProposal}
        currentUserId={dummyUser.id}
      />
    </div>
  )
}
