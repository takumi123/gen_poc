import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { UserNav } from '@/app/components/UserNav';
import { ReviewList } from '@/app/components/ReviewCard';
import { UserRole, Review } from '@/app/types';

interface EngineerReviewsPageProps {
  params: {
    id: string;
  };
}

async function getEngineerReviews(id: string) {
  const engineer = await prisma.user.findUnique({
    where: { 
      id,
      role: UserRole.ENGINEER,
    },
    include: {
      receivedReviews: {
        orderBy: { createdAt: 'desc' },
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

  if (!engineer) {
    notFound();
  }

  return engineer;
}

interface SkillRating {
  skill: string;
  rating: number;
  count: number;
  percentage: number;
}

export default async function EngineerReviewsPage({ params }: EngineerReviewsPageProps) {
  const engineer = await getEngineerReviews(params.id);

  // レビューの統計情報を計算
  const totalReviews = engineer.receivedReviews.length;
  const averageRating = totalReviews > 0
    ? engineer.receivedReviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / totalReviews
    : 0;

  // レーティング分布を計算
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const reviewsWithRating = engineer.receivedReviews.filter(
      (review: Review) => review.rating === rating
    );
    const count = reviewsWithRating.length;
    const percentage = totalReviews > 0
      ? (count / totalReviews) * 100
      : 0;

    return {
      rating,
      count,
      percentage,
    };
  });

  // スキル別の評価を計算
  const skillRatings: SkillRating[] = engineer.skills
    ? Object.entries(engineer.skills as Record<string, number>).map(([skill]) => {
        const skillReviews = engineer.receivedReviews.filter(
          (review: Review) => review.contract.project.title.toLowerCase().includes(skill.toLowerCase())
        );
        const avgRating = skillReviews.length > 0
          ? skillReviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / skillReviews.length
          : 0;
        return {
          skill,
          rating: avgRating,
          count: skillReviews.length,
          percentage: (skillReviews.length / totalReviews) * 100,
        };
      })
    : [];

  return (
    <div>
      <UserNav user={engineer} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">レビュー一覧</h1>
              <p className="text-gray-600 mt-1">
                総レビュー数: {totalReviews} | 平均評価: {averageRating.toFixed(1)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="createdAt">新しい順</option>
                <option value="rating">評価順</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* レーティング分布 */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">評価分布</h2>
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center">
                    <div className="w-12 text-sm text-gray-600">
                      {rating}★
                    </div>
                    <div className="flex-1 h-4 mx-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-20 text-sm text-gray-600 text-right">
                      {count}件 ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* スキル別評価 */}
            {skillRatings.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">スキル別評価</h2>
                <div className="space-y-4">
                  {skillRatings.map(({ skill, rating, count }) => (
                    <div key={skill}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {skill}
                        </span>
                        <span className="text-sm text-gray-500">
                          {count}件のレビュー
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${(rating / 5) * 100}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* レビュー一覧 */}
          <ReviewList
            reviews={engineer.receivedReviews}
            showProject={true}
          />
        </div>
      </div>
    </div>
  );
}
