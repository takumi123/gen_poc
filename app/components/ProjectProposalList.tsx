'use client';

import dynamic from 'next/dynamic';
import { Proposal, ProposalStatus } from '../types';

const MDPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface ProjectProposalListProps {
  proposals: Proposal[];
}

export function ProjectProposalList({ proposals }: ProjectProposalListProps) {
  if (proposals.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">提案一覧</h2>
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {proposal.engineer.displayName}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  提案日: {new Date(proposal.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  proposal.status === ProposalStatus.SUBMITTED
                    ? 'bg-yellow-100 text-yellow-800'
                    : proposal.status === ProposalStatus.ACCEPTED
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {proposal.status === ProposalStatus.SUBMITTED
                  ? '検討中'
                  : proposal.status === ProposalStatus.ACCEPTED
                  ? '承認済み'
                  : '却下'}
              </span>
            </div>
            <div className="mt-4 prose max-w-none" data-color-mode="light">
              <MDPreview source={proposal.proposalText} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
