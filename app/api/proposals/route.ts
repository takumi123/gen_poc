import { prisma } from 'lib/db'
import { NextResponse } from 'next/server'

// 提案一覧取得
export async function GET(request: Request) {
  try {
    // URLからクエリパラメータを取得
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const engineerId = searchParams.get('engineerId')

    // クエリ条件を構築
    const where = {
      ...(projectId && { projectId }),
      ...(engineerId && { engineerId }),
    }

    const proposals = await prisma.proposal.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
            status: true,
            user: {
              select: {
                id: true,
                displayName: true,
                companyName: true,
              },
            },
          },
        },
        engineer: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(proposals)
  } catch (error) {
    console.error('提案一覧取得エラー:', error)
    return NextResponse.json(
      { error: '提案一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 提案作成
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      projectId,
      engineerId,
      proposalText,
      proposedBudget,
      proposedTimeline,
    } = body

    // バリデーション
    if (!projectId || !engineerId || !proposalText || !proposedBudget || !proposedTimeline) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    // プロジェクトの存在確認
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: '指定されたプロジェクトが存在しません' },
        { status: 404 }
      )
    }

    // トランザクションで提案とメッセージを作成
    const result = await prisma.$transaction(async (tx) => {
      // 提案の作成
      const proposal = await tx.proposal.create({
        data: {
          projectId,
          engineerId,
          proposalText,
          proposedBudget,
          proposedTimeline,
          approachDescription: proposalText, // 提案内容を説明文としても使用
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
              budget: true,
              status: true,
              user: {
                select: {
                  id: true,
                  displayName: true,
                  companyName: true,
                },
              },
            },
          },
          engineer: {
            select: {
              id: true,
              displayName: true,
              profileImageUrl: true,
            },
          },
        },
      })

      // 自動メッセージの作成
      const message = await tx.message.create({
        data: {
          contractId: proposal.id, // 提案IDを一時的に契約IDとして使用
          senderId: engineerId,
          messageBody: `提案内容:\n${proposalText}\n\n提案予算: ${proposedBudget}円\n想定期間: ${proposedTimeline}`,
          isTemplate: false,
        },
      })

      // 通知の作成（企業向け）
      await tx.notification.create({
        data: {
          userId: project.userId,
          type: 'NEW_PROPOSAL',
          title: '新しい提案が届きました',
          body: `プロジェクト「${project.title}」に新しい提案が届きました。`,
        },
      })

      return { ...proposal, messages: [message] }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('提案作成エラー:', error)
    return NextResponse.json(
      { error: '提案の作成に失敗しました' },
      { status: 500 }
    )
  }
}
