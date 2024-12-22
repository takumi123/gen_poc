import { auth } from 'auth';
import { prisma } from 'lib/db';
import { MessageList } from 'app/components/MessageList';
import { MessageForm } from 'app/components/MessageForm';
import { redirect } from 'next/navigation';
import { Message, User } from 'app/types';
import { JsonValue } from '@prisma/client/runtime/library';

interface MessagesPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface BasePrismaMessage {
  id: string;
  contractId: string;
  senderId: string;
  parentId: string | null;
  messageBody: string;
  attachments: JsonValue | null;
  isTemplate: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: User;
}

function formatMessage(rawMessage: BasePrismaMessage & {
  parent?: (BasePrismaMessage & { sender: User }) | null;
  replies?: (BasePrismaMessage & { sender: User })[];
}): Message {
  return {
    id: rawMessage.id,
    contractId: rawMessage.contractId,
    senderId: rawMessage.senderId,
    parentId: rawMessage.parentId,
    messageBody: rawMessage.messageBody,
    attachments: rawMessage.attachments,
    isTemplate: rawMessage.isTemplate,
    isPinned: rawMessage.isPinned,
    createdAt: rawMessage.createdAt,
    updatedAt: rawMessage.updatedAt,
    sender: rawMessage.sender,
    parent: rawMessage.parent ? formatMessage(rawMessage.parent) : null,
    replies: (rawMessage.replies || []).map(reply => formatMessage(reply))
  };
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  const contract = await prisma.contract.findUnique({
    where: { id },
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
        include: {
          sender: true,
          parent: {
            include: {
              sender: true
            }
          },
          replies: {
            include: {
              sender: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">契約が見つかりません</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ユーザーが契約に関連しているか確認
  const isAuthorized =
    session.user.id === contract.project.user.id ||
    session.user.id === contract.proposal.engineer.id;

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">このページにアクセスする権限がありません</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function handleSendMessage(message: string) {
    'use server';
    
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('認証が必要です');
    }

    await prisma.message.create({
      data: {
        contractId: id,
        senderId: session.user.id,
        messageBody: message,
        isTemplate: false,
        isPinned: false,
      },
    });
  }

  const formattedMessages = contract.messages.map(message => formatMessage({
    ...message,
    parent: message.parent,
    replies: message.replies
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-xl font-semibold mb-2">{contract.project.title}</h1>
            <div className="flex justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">クライアント:</span>{' '}
                {contract.project.user.displayName}
              </div>
              <div>
                <span className="font-medium">エンジニア:</span>{' '}
                {contract.proposal.engineer.displayName}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col h-[600px]">
            <MessageList messages={formattedMessages} contractId={id} />
            <MessageForm onSubmit={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
