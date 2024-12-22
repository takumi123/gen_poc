import { notFound } from 'next/navigation';
import { prisma } from 'lib/db';
import { UserNav } from 'app/components/UserNav';
import { ReviewList } from 'app/components/ReviewCard';
import { UserRole, Review } from 'app/types';

interface CompanyReviewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCompanyReviews(id: string) {
  const company = await prisma.user.findUnique({
    where: { 
      id,
      role: UserRole.CLIENT,
    },
    include: {
      receivedReviews: {
        orderBy: { createdAt: 'desc' },
        include: {
          reviewer: true,
          contract: {
            include: {
              project: true,
              proposal: {
                include: {
                  project: true,
                  engineer: true
                }
              }
            },
          },
        },
      },
    },
  });

  if (!company) {
    notFound();
  }

  return company;
}

export default async function CompanyReviewsPage({ params }: CompanyReviewsPageProps) {
  const { id } = await params;
  const company = await getCompanyReviews(id);
  const reviews = company.receivedReviews as unknown as Review[];

  // レビューの統計情報を計算
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  // レーティング分布を計算
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const reviewsWithRating = reviews.filter(review => review.rating === rating);
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

  return (
    <div>
      <UserNav user={company} />
      
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

          {/* レーティング分布 */}
          {totalReviews > 0 && (
            <div className="bg-white shadow rounded-lg p-6 mb-8">
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
          )}

          {/* レビュー一覧 */}
          <ReviewList
            reviews={reviews}
            showProject={true}
          />
        </div>
      </div>
    </div>
  );
}
