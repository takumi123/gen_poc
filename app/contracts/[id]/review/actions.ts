import { redirect } from 'next/navigation';
import { Review } from '@/app/types';

type ReviewInput = Omit<Review, 'id' | 'createdAt' | 'reviewer'>;

export async function submitReview(review: ReviewInput) {
  'use server';

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error('レビューの投稿に失敗しました');
    }

    // レビュー投稿後、プロジェクトの詳細ページにリダイレクト
    redirect(`/projects/${review.contract.project.id}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`レビューの投稿に失敗しました: ${error.message}`);
    }
    throw new Error('レビューの投稿に失敗しました');
  }
}
