import { NextRequest, NextResponse } from 'next/server'
import { auth } from 'auth'
import { prisma } from 'lib/db'

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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
    const { id: contractId } = await context.params;

    // 契約の存在確認
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        project: true,
        proposal: true,
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!contract) {
      return NextResponse.json(
        { error: '契約が見つかりません' },
        { status: 404 }
      )
    }

    // 権限チェック
    const isAuthorized =
      session.user.id === contract.project.userId ||
      session.user.id === contract.proposal.engineerId

    if (!isAuthorized) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    return NextResponse.json(contract.messages)
  } catch (error) {
    console.error('メッセージ取得エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}

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
    const { id: contractId } = await context.params;
    const { messageBody } = await request.json()

    // 契約の存在確認
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        project: true,
        proposal: true,
      },
    })

    if (!contract) {
      return NextResponse.json(
        { error: '契約が見つかりません' },
        { status: 404 }
      )
    }

    // 権限チェック
    const isAuthorized =
      session.user.id === contract.project.userId ||
      session.user.id === contract.proposal.engineerId

    if (!isAuthorized) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    // メッセージ作成
    const message = await prisma.message.create({
      data: {
        contractId,
        senderId: session.user.id,
        messageBody,
        isTemplate: false,
        isPinned: false,
      },
      include: {
        sender: true,
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
