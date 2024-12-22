import { prisma } from '../../../../../lib/db'
import { NextResponse } from 'next/server'

// 契約ごとのメッセージ一覧取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 契約の存在確認
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
    })

    if (!contract) {
      return NextResponse.json(
        { error: '指定された契約が存在しません' },
        { status: 404 }
      )
    }

    // メッセージの取得
    const messages = await prisma.message.findMany({
      where: {
        contractId: params.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // 古い順に表示
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('契約メッセージ一覧取得エラー:', error)
    return NextResponse.json(
      { error: '契約のメッセージ一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 契約へのメッセージ送信
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { senderId, messageBody } = body

    // バリデーション
    if (!senderId || !messageBody) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    // 契約の存在確認
    const contract = await prisma.contract.findUnique({
      where: { id: params.id },
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
      },
    })

    if (!contract) {
      return NextResponse.json(
        { error: '指定された契約が存在しません' },
        { status: 404 }
      )
    }

    // 送信者が契約に関連するユーザーかチェック
    const isAuthorized =
      senderId === contract.project.user.id ||
      senderId === contract.proposal.engineer.id

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'このメッセージの送信は許可されていません' },
        { status: 403 }
      )
    }

    // メッセージの作成
    const message = await prisma.message.create({
      data: {
        contractId: params.id,
        senderId,
        messageBody,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('契約メッセージ送信エラー:', error)
    return NextResponse.json(
      { error: 'メッセージの送信に失敗しました' },
      { status: 500 }
    )
  }
}
