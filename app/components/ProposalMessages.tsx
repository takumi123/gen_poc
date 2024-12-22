'use client'

import { useEffect, useState, useCallback } from 'react'
import { Message, Proposal } from '@/app/types'
import { MessageList } from './MessageList'
import { MessageForm } from './MessageForm'
import { useSession } from 'next-auth/react'

interface ProposalMessagesProps {
  proposal: Proposal
}

export function ProposalMessages({ proposal }: ProposalMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/proposals/${proposal.id}/messages`)
      if (!response.ok) {
        throw new Error('メッセージの取得に失敗しました')
      }
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('メッセージ取得エラー:', error)
      setError('メッセージの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [proposal.id])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const handleSendMessage = async (messageBody: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposal.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageBody }),
      })

      if (!response.ok) {
        throw new Error('メッセージの送信に失敗しました')
      }

      const newMessage = await response.json()
      setMessages((prev) => [...prev, newMessage])
    } catch (error) {
      console.error('メッセージ送信エラー:', error)
      setError('メッセージの送信に失敗しました')
    }
  }

  if (loading) {
    return <div className="text-center py-4">読み込み中...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    )
  }

  // 権限チェック
  const isAuthorized =
    session?.user?.id === proposal.project.user.id ||
    session?.user?.id === proposal.engineerId

  if (!isAuthorized) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative">
        このメッセージス��ッドを閲覧する権限がありません
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">メッセージ</h3>
        <p className="text-sm text-gray-500">
          プロジェクト「{proposal.project.title}」に関する提案のメッセージスレッド
        </p>
      </div>

      <div className="h-[400px] flex flex-col">
        <MessageList messages={messages} contractId={proposal.id} />
        <MessageForm onSubmit={handleSendMessage} />
      </div>
    </div>
  )
}
