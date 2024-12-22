import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { redirect } from 'next/navigation'

interface Contract {
  id: string;
  messages: {
    id: string;
    messageBody: string;
    createdAt: Date;
  }[];
  project: {
    title: string;
    user: {
      id: string;
      displayName: string;
    };
  };
  proposal: {
    engineer: {
      id: string;
      displayName: string;
    };
  };
}

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // ユーザーに関連する契約を取得
  const contracts = await prisma.contract.findMany({
    where: {
      OR: [
        {
          project: {
            userId: session.user.id,
          },
        },
        {
          proposal: {
            engineerId: session.user.id,
          },
        },
      ],
    },
    include: {
      project: {
        include: {
          user: true,
        },
      },
      proposal: {
        include: {
          engineer: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  }) as Contract[]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">メッセージ一覧</h1>
      <div className="space-y-4">
        {contracts.map((contract) => {
          const lastMessage = contract.messages?.[0]
          const isClient = session.user.id === contract.project.user.id
          const otherParty = isClient ? contract.proposal.engineer : contract.project.user

          return (
            <Link
              key={contract.id}
              href={`/contracts/${contract.id}/messages`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {contract.project.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isClient ? 'エンジニア' : 'クライアント'}: {otherParty.displayName}
                    </p>
                  </div>
                  {lastMessage && (
                    <span className="text-sm text-gray-500">
                      {new Date(lastMessage.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
                {lastMessage ? (
                  <p className="text-gray-600 line-clamp-2">{lastMessage.messageBody}</p>
                ) : (
                  <p className="text-gray-500 italic">メッセージはまだありません</p>
                )}
              </div>
            </Link>
          )
        })}
        {contracts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              メッセージはありません
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              契約が成立すると、ここにメッセージが表示されます
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
