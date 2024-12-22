import { prisma } from '../../../../lib/db'
import { NextResponse } from 'next/server'

// プロジェクト詳細取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
        proposals: {
          include: {
            engineer: {
              select: {
                id: true,
                displayName: true,
                profileImageUrl: true,
              },
            },
          },
        },
        contract: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'プロジェクトが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('プロジェクト詳細取得エラー:', error)
    return NextResponse.json(
      { error: 'プロジェクト詳細の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// プロジェクト更新
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, budget, status } = body

    const project = await prisma.project.update({
      where: {
        id: params.id,
      },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(budget && { budget }),
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('プロジェクト更新エラー:', error)
    return NextResponse.json(
      { error: 'プロジェクトの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// プロジェクト削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'プロジェクトを削除しました' })
  } catch (error) {
    console.error('プロジェクト削除エラー:', error)
    return NextResponse.json(
      { error: 'プロジェクトの削除に失敗しました' },
      { status: 500 }
    )
  }
}
