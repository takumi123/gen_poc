import { NextResponse } from 'next/server';
import { prisma } from 'lib/db';
import { BadgeType, NotificationType } from 'app/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contractId, reviewerId, revieweeId, rating, comment } = body;

    // レビューを作成
    const review = await prisma.review.create({
      data: {
        contractId,
        reviewerId,
        revieweeId,
        rating,
        comment,
      },
      include: {
        reviewer: true,
        contract: {
          include: {
            project: true,
          },
        },
      },
    });

    // レビュー対象のユーザーに通知を送信
    await prisma.notification.create({
      data: {
        userId: revieweeId,
        type: NotificationType.REVIEW_RECEIVED,
        title: 'レビューが投稿されました',
        body: `${review.reviewer.displayName}さんからレビューが投稿されました。`,
      },
    });

    // バッジの付与条件をチェック
    const userReviews = await prisma.review.findMany({
      where: {
        revieweeId,
      },
      include: {
        contract: true,
      },
    });

    // 初めてのレビューを受けた場合
    if (userReviews.length === 1) {
      await prisma.userBadge.create({
        data: {
          userId: revieweeId,
          badgeType: BadgeType.FIRST_PROJECT,
        },
      });
    }

    // 5件以上のレビューを受けた場合
    if (userReviews.length === 5) {
      await prisma.userBadge.create({
        data: {
          userId: revieweeId,
          badgeType: BadgeType.FIVE_PROJECTS,
        },
      });
    }

    // 平均評価が4.5以上で、レビュー数が3件以上の場合
    const averageRating =
      userReviews.reduce((sum: number, review) => sum + review.rating, 0) /
      userReviews.length;
    if (averageRating >= 4.5 && userReviews.length >= 3) {
      const existingTopRatedBadge = await prisma.userBadge.findFirst({
        where: {
          userId: revieweeId,
          badgeType: BadgeType.TOP_RATED,
        },
      });

      if (!existingTopRatedBadge) {
        await prisma.userBadge.create({
          data: {
            userId: revieweeId,
            badgeType: BadgeType.TOP_RATED,
          },
        });

        // バッジ獲得の通知
        await prisma.notification.create({
          data: {
            userId: revieweeId,
            type: NotificationType.BADGE_EARNED,
            title: '新しいバッジを獲得しました',
            body: 'トップレートバッジを獲得しました！高評価を維持していただき、ありがとうございます。',
          },
        });
      }
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'レビューの作成に失敗しました' },
      { status: 500 }
    );
  }
}

// レビュー一覧を取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'received' or 'given'

    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        ...(type === 'received'
          ? { revieweeId: userId }
          : { reviewerId: userId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reviewer: true,
        contract: {
          include: {
            project: true,
          },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'レビューの取得に失敗しました' },
      { status: 500 }
    );
  }
}
