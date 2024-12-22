import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { prisma } from '../../../lib/db';
import { ProjectStatus } from '../../types';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '認証が必要です。再度ログインしてください。' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, budget, period, status } = body;

    // 入力値のバリデーション
    if (!title || !description || !budget || !period) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      );
    }

    // 数値変換のエラーハンドリング
    const budgetNumber = parseInt(budget);
    if (isNaN(budgetNumber)) {
      return NextResponse.json(
        { error: '予算は数値で入力してください' },
        { status: 400 }
      );
    }

    // 期間から締切日を計算
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + parseInt(period));

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget: budgetNumber,
        deadline,
        status: status as ProjectStatus,
        userId: session.user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    // エラーメッセージの安全な取得
    const errorMessage = error instanceof Error ? error.message : '不明なエラー';
    console.error('案件作成エラー:', { message: errorMessage });
    
    // クライアントへのレスポンス
    return NextResponse.json(
      { error: '案件の作成に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: ProjectStatus.OPEN,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('案件取得エラー:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
