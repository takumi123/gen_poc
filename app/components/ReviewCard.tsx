import { Review } from '../types'
import Image from 'next/image'

interface ReviewCardProps {
  review: Review;
  showProject?: boolean;
}

export function ReviewCard({ review, showProject = true }: ReviewCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {review.reviewer.profileImageUrl ? (
              <Image
                className="rounded-full"
                src={review.reviewer.profileImageUrl}
                alt={review.reviewer.displayName}
                width={40}
                height={40}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {review.reviewer.displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {review.reviewer.displayName}
            </p>
            {showProject && (
              <p className="text-sm text-gray-500">
                {review.contract.project.title}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-5 w-5 ${
                i < review.rating
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="mt-4 text-gray-700 whitespace-pre-wrap">{review.comment}</p>
      <div className="mt-4 text-sm text-gray-500">
        プロジェクト期間: {new Date(review.contract.startDate).toLocaleDateString()} 〜{' '}
        {new Date(review.contract.endDate).toLocaleDateString()}
      </div>
      <div className="mt-2 text-sm text-gray-500">
        契約金額: ¥{review.contract.contractAmount.toLocaleString()}
      </div>
    </div>
  );
}

interface ReviewListProps {
  reviews: Review[];
  showProject?: boolean;
}

export function ReviewList({ reviews, showProject = true }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">まだレビューはありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          showProject={showProject}
        />
      ))}
    </div>
  );
}
