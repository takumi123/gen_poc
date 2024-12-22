import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'

// プロジェクト一覧取得
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
        proposals: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('プロジェクト一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'プロジェクト一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// プロジェクト作成
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, budget, userId } = body

    // バリデーション
    if (!title || !description || !budget || !userId) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget,
        userId,
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
    console.error('プロジェクト作成エラー:', error)
    return NextResponse.json(
      { error: 'プロジェクトの作成に失敗しました' },
      { status: 500 }
    )
  }
}
