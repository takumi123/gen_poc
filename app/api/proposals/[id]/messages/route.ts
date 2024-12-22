import { NextRequest, NextResponse } from 'next/server'
import { auth } from 'auth'
import { prisma } from 'lib/db'

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: '認証が必要です' },
      { status: 401 }
    )
  }

  try {
    const { messageBody } = await request.json()
    const { id } = await context.params;

    // 提案の存在確認
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        project: true,
        engineer: true,
      },
    })

    if (!proposal) {
      return NextResponse.json(
        { error: '提案が見つかりません' },
        { status: 404 }
      )
    }

    // 権限チェック
    const isAuthorized =
      session.user.id === proposal.project.userId ||
      session.user.id === proposal.engineerId

    if (!isAuthorized) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    // メッセージ作成
    const message = await prisma.message.create({
      data: {
        contractId: proposal.id, // 提案IDを一時的に契約IDとして使用
        senderId: session.user.id,
        messageBody,
        isTemplate: false,
        isPinned: false,
      },
      include: {
        sender: true,
      },
    })

    // 通知作成
    const notificationUserId =
      session.user.id === proposal.project.userId
        ? proposal.engineerId
        : proposal.project.userId

    await prisma.notification.create({
      data: {
        userId: notificationUserId,
        type: 'NEW_MESSAGE',
        title: '新しいメッセージが届きました',
        body: `プロジェクト「${proposal.project.title}」に関する提案でメッセージが届きました。`,
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('メッセージ作成エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: '認証が必要です' },
      { status: 401 }
    )
  }

  try {
    const { id } = await context.params;

    // 提案の存在確認
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        project: true,
        engineer: true,
      },
    })

    if (!proposal) {
      return NextResponse.json(
        { error: '提案が見つかりません' },
        { status: 404 }
      )
    }

    // 権限チェック
    const isAuthorized =
      session.user.id === proposal.project.userId ||
      session.user.id === proposal.engineerId

    if (!isAuthorized) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    // メッセージ取得
    const messages = await prisma.message.findMany({
      where: {
        contractId: proposal.id, // 提案IDを一時的に契約IDとして使用
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('メッセージ取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
