import { prisma } from 'lib/db'
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// 提案詳細取得
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const proposal = await prisma.proposal.findUnique({
      where: {
        id,
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
                profileImageUrl: true,
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

    if (!proposal) {
      return NextResponse.json(
        { error: '提案が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(proposal)
  } catch (error) {
    console.error('提案詳細取得エラー:', error)
    return NextResponse.json(
      { error: '提案詳細の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 提案更新
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json()
    const { proposalText, proposedBudget, proposedTimeline } = body

    const proposal = await prisma.proposal.update({
      where: {
        id,
      },
      data: {
        ...(proposalText && { proposalText }),
        ...(proposedBudget && { proposedBudget }),
        ...(proposedTimeline && { proposedTimeline }),
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
            status: true,
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

    return NextResponse.json(proposal)
  } catch (error) {
    console.error('提案更新エラー:', error)
    return NextResponse.json(
      { error: '提案の更新に失敗しました' },
      { status: 500 }
    )
  }
}

// 提案削除
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    await prisma.proposal.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({ message: '提案を削除しました' })
  } catch (error) {
    console.error('提案削除エラー:', error)
    return NextResponse.json(
      { error: '提案の削除に失敗しました' },
      { status: 500 }
    )
  }
}
