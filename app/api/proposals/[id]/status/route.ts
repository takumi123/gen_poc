import { prisma } from 'lib/db'
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// 提案の承認/却下
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const body = await request.json()
    const { action } = body
    const { id } = await context.params;

    if (action !== 'accept' && action !== 'reject') {
      return NextResponse.json(
        { error: '無効なアクションです' },
        { status: 400 }
      )
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        project: true,
      },
    })

    if (!proposal) {
      return NextResponse.json(
        { error: '提案が見つかりません' },
        { status: 404 }
      )
    }

    // トランザクションで提案のステータス更新と契約作成を行う
    const result = await prisma.$transaction(async (tx) => {
      // 提案のステータス更新
      const updatedProposal = await tx.proposal.update({
        where: { id },
        data: {
          status: action === 'accept' ? 'ACCEPTED' : 'REJECTED',
        },
      })

      // 承認の場合、契約を作成
      if (action === 'accept') {
        // プロジェクトのステータスを更新
        await tx.project.update({
          where: { id: proposal.projectId },
          data: {
            status: 'IN_PROGRESS',
          },
        })

        // 契約を作成
        const startDate = new Date()
        const endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 1) // デフォルトで1ヶ月後を終了日とする

        await tx.contract.create({
          data: {
            projectId: proposal.projectId,
            proposalId: proposal.id,
            contractAmount: proposal.proposedBudget,
            startDate,
            endDate,
          },
        })

        // 他の提案を却下
        await tx.proposal.updateMany({
          where: {
            projectId: proposal.projectId,
            id: { not: proposal.id },
            status: 'SUBMITTED',
          },
          data: {
            status: 'REJECTED',
          },
        })
      }

      return updatedProposal
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('提案ステータス更新エラー:', error)
    return NextResponse.json(
      { error: '提案のステータス更新に失敗しました' },
      { status: 500 }
    )
  }
}
