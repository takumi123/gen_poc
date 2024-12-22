'use client'

import { useState } from 'react'

interface ProposalFormProps {
  projectId: string
  engineerId: string
  onSubmit: () => void
}

export function ProposalForm({
  projectId,
  engineerId,
  onSubmit,
}: ProposalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          engineerId,
          proposalText: formData.get('proposalText'),
          proposedBudget: parseInt(formData.get('proposedBudget')?.toString() || '0', 10),
          proposedTimeline: formData.get('proposedTimeline'),
        }),
      })

      if (!res.ok) {
        throw new Error('提案の送信に失敗しました')
      }

      onSubmit()
    } catch (error) {
      console.error('提案送信エラー:', error)
      alert('提案の送信に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900">提案を作成</h2>
      <form action={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label
            htmlFor="proposalText"
            className="block text-sm font-medium text-gray-700"
          >
            提案内容
          </label>
          <div className="mt-1">
            <textarea
              id="proposalText"
              name="proposalText"
              rows={4}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="プロジェクトへの提案内容、実現方法、経験などを記載してください"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="proposedBudget"
            className="block text-sm font-medium text-gray-700"
          >
            提案予算（円）
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="proposedBudget"
              id="proposedBudget"
              required
              min="0"
              step="10000"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="例: 500000"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            ※ 予算は10,000円単位で設定してください
          </p>
        </div>

        <div>
          <label
            htmlFor="proposedTimeline"
            className="block text-sm font-medium text-gray-700"
          >
            想定期間
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="proposedTimeline"
              id="proposedTimeline"
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="例: 2週間"
            />
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? '送信中...' : '提案を送信'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
