'use client'

import { Proposal } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

interface ProposalListProps {
  proposals: Proposal[]
  isProjectOwner: boolean
  onAccept?: (proposalId: string) => Promise<void>
  onReject?: (proposalId: string) => Promise<void>
}

export function ProposalList({
  proposals,
  isProjectOwner,
  onAccept,
  onReject,
}: ProposalListProps) {
  const statusColors = {
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }

  const statusText = {
    SUBMITTED: '提案中',
    ACCEPTED: '承認済み',
    REJECTED: '却下',
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">提案一覧</h2>
      <div className="mt-4 space-y-6">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white shadow rounded-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {proposal.engineer.profileImageUrl ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={proposal.engineer.profileImageUrl}
                      alt={proposal.engineer.displayName}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {proposal.engineer.displayName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {proposal.engineer.displayName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(proposal.createdAt), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[proposal.status]
                }`}
              >
                {statusText[proposal.status]}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-gray-700">{proposal.proposalText}</p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">提案予算</p>
                <p className="text-lg font-medium text-gray-900">
                  ¥{proposal.proposedBudget.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">想定期間</p>
                <p className="text-lg font-medium text-gray-900">
                  {proposal.proposedTimeline}
                </p>
              </div>
            </div>

            {isProjectOwner && proposal.status === 'SUBMITTED' && (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => onReject?.(proposal.id)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  却下
                </button>
                <button
                  onClick={() => onAccept?.(proposal.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  承認
                </button>
              </div>
            )}
          </div>
        ))}

        {proposals.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">まだ提案がありません</p>
          </div>
        )}
      </div>
    </div>
  )
}
