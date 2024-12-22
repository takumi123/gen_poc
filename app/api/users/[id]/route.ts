import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        projects: {
          where: { status: { not: 'DRAFT' } },
          orderBy: { createdAt: 'desc' },
        },
        proposals: {
          where: { status: { not: 'DRAFT' } },
          orderBy: { createdAt: 'desc' },
          include: {
            project: true,
          },
        },
        badges: true,
        receivedReviews: {
          include: {
            reviewer: true,
            contract: {
              include: {
                project: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // メールアドレスなど、公開すべきでない情報を除外
    const { password, email, ...safeUser } = user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = { password, email }; // 未使用変数の警告を抑制

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'ユーザー情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}
