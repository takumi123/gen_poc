import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('認証が必要です', { status: 401 })
  }

  try {
    const { contractId, messageBody } = await request.json()

    // 契約の存在確認
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        project: true,
        proposal: true,
      },
    })

    if (!contract) {
      return new NextResponse('契約が見つかりません', { status: 404 })
    }

    // 権限チェック
    const isAuthorized =
      session.user.id === contract.project.userId ||
      session.user.id === contract.proposal.engineerId

    if (!isAuthorized) {
      return new NextResponse('権限がありません', { status: 403 })
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
    return new NextResponse('内部サーバーエラー', { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('認証が必要です', { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get('contractId')

    if (!contractId) {
      return new NextResponse('契約IDが必要です', { status: 400 })
    }

    // 契約の存在確認
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        project: true,
        proposal: true,
      },
    })

    if (!contract) {
      return new NextResponse('契約が見つかりません', { status: 404 })
    }

    // 権限チェック
    const isAuthorized =
      session.user.id === contract.project.userId ||
      session.user.id === contract.proposal.engineerId

    if (!isAuthorized) {
      return new NextResponse('権限がありません', { status: 403 })
    }

    // メッセージ取得
    const messages = await prisma.message.findMany({
      where: {
        contractId,
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
    return new NextResponse('内部サーバーエラー', { status: 500 })
  }
}
