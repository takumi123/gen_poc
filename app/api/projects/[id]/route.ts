import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'auth';
import { prisma } from 'lib/db';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '認証が必要です。再度ログインしてください。' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: '指定された案件が見つかりません' },
        { status: 404 }
      );
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'この操作を行う権限がありません' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, budget, period } = body;

    // 数値変換のバリデーション
    const budgetNumber = parseInt(budget);
    if (isNaN(budgetNumber)) {
      return NextResponse.json(
        { error: '予算は数値で入力してください' },
        { status: 400 }
      );
    }

    // 期間から締切日を計算
    const periodNumber = parseInt(period);
    if (isNaN(periodNumber) || periodNumber <= 0) {
      return NextResponse.json(
        { error: '期間は正の整数で入力してください' },
        { status: 400 }
      );
    }

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + periodNumber);

    try {
      const updatedProject = await prisma.project.update({
        where: { id },
        data: {
          title,
          description: content,
          budget: budgetNumber,
          deadline,
        },
      });

      return NextResponse.json(updatedProject);
    } catch (e) {
      const message = e instanceof Error ? e.message : '不明なエラー';
      return NextResponse.json(
        { error: `案件の更新に失敗しました: ${message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: `案件の更新に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const project = await prisma.project.findUnique({
      where: { id },
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
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: '指定された案件が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : '不明なエラー';
    return NextResponse.json(
      { error: `案件の取得に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
