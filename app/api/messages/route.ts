import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'

// メッセージ一覧取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get('contractId')
    const senderId = searchParams.get('senderId')

    const where = {
      ...(contractId && { contractId }),
      ...(senderId && { senderId }),
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
        contract: {
          select: {
            id: true,
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('メッセージ一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'メッセージ一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// メッセージ送信
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contractId, senderId, messageBody } = body

    // バリデーション
    if (!contractId || !senderId || !messageBody) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    // 契約の存在確認
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    })

    if (!contract) {
      return NextResponse.json(
        { error: '指定された契約が存在しません' },
        { status: 404 }
      )
    }

    // メッセージの作成
    const message = await prisma.message.create({
      data: {
        contractId,
        senderId,
        messageBody,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('メッセージ送信エラー:', error)
    return NextResponse.json(
      { error: 'メッセージの送信に失敗しました' },
      { status: 500 }
    )
  }
}
