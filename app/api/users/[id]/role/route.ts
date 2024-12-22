import { prisma } from 'lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from 'auth'
import { UserRole, Prisma } from '@prisma/client'

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
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

    // 自分のロールのみ変更可能
    if (session.user.id !== id) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    const { role } = await request.json()

    // ロールのバリデーション
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: '無効なロールです' },
        { status: 400 }
      )
    }

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // ロールの更新
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role,
        // エンジニアからクライアントに切り替える場合
        ...(role === UserRole.CLIENT && {
          skills: Prisma.JsonNull,
          experienceYears: null,
          portfolioUrl: null,
        }),
        // クライアントからエンジニアに切り替える場合
        ...(role === UserRole.ENGINEER && {
          companyName: null,
          companySize: null,
          industry: null,
        }),
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('ユーザーロール更新エラー:', error)
    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
