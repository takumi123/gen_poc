'use client'

import { Project, Proposal } from '../types'
import { ProposalList } from './ProposalList'
import { ProposalForm } from './ProposalForm'
import { useRouter } from 'next/navigation'

interface ProjectProposalsProps {
  project: Project
  proposals: Proposal[]
  isProjectOwner: boolean
  canSubmitProposal: boolean
  currentUserId: string
}

export function ProjectProposals({
  project,
  proposals,
  isProjectOwner,
  canSubmitProposal,
  currentUserId,
}: ProjectProposalsProps) {
  const router = useRouter()

  const handleAccept = async (proposalId: string) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'accept' }),
      })
      if (!res.ok) {
        throw new Error('提案の承認に失敗しました')
      }
      router.refresh()
    } catch (error) {
      console.error('提案承認エラー:', error)
      alert('提案の承認に失敗しました')
    }
  }

  const handleReject = async (proposalId: string) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject' }),
      })
      if (!res.ok) {
        throw new Error('提案の却下に失敗しました')
      }
      router.refresh()
    } catch (error) {
      console.error('提案却下エラー:', error)
      alert('提案の却下に失敗しました')
    }
  }

  return (
    <>
      <ProposalList
        proposals={proposals}
        isProjectOwner={isProjectOwner}
        onAccept={handleAccept}
        onReject={handleReject}
      />

      {canSubmitProposal && (
        <ProposalForm
          projectId={project.id}
          engineerId={currentUserId}
          onSubmit={() => {
            router.refresh()
          }}
        />
      )}
    </>
  )
}
