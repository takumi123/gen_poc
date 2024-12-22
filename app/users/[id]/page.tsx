import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/db';
import UserProfile from '../../components/UserProfile';
import { ProjectCard } from '../../components/ProjectCard';
import { ProposalList } from '../../components/ProposalList';
import { BlogList } from '../../components/BlogList';
import { UserRole, Project, User } from '../../types';
import Image from 'next/image';
import { auth } from '../../../auth';

type UserPageProps = {
  params: Promise<{
    id: string;
  }>
}

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      projects: {
        where: { status: { not: 'DRAFT' } },
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          proposals: true,
        },
      },
      proposals: {
        where: { status: { not: 'DRAFT' } },
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            include: {
              user: true,
            },
          },
          engineer: true,
        },
      },
      blogPosts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              profileImageUrl: true,
              role: true,
            },
          },
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
    notFound();
  }

  return user;
}

export default async function UserPage({ params }: UserPageProps) {
  const resolvedParams = await params;
  const userId = resolvedParams.id;
  const user = await getUser(userId);
  const session = await auth();
  const isCompany = user.role === UserRole.CLIENT;
  const isOwner = session?.user?.id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile user={user as unknown as User} />

      {/* ブログ記事一覧 */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">ブログ記事</h2>
        <BlogList
          posts={user.blogPosts}
          showAuthor={false}
          isOwner={isOwner}
          currentUserId={session?.user?.id}
        />
      </div>

      {isCompany ? (
        // 企業向け表示
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">投稿した案件</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {user.projects.map((prismaProject) => (
              <ProjectCard 
                key={prismaProject.id} 
                project={{
                  ...prismaProject,
                  proposals: []
                } as unknown as Project}
              />
            ))}
            {user.projects.length === 0 && (
              <p className="text-gray-500">まだ案件を投稿していません</p>
            )}
          </div>
        </div>
      ) : (
        // エンジニア向け表示
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">提案した案件</h2>
          <ProposalList
            proposals={user.proposals?.map(p => ({
              id: p.id,
              projectId: p.projectId,
              engineerId: p.engineerId,
              proposalText: p.proposalText,
              approachDescription: p.approachDescription,
              proposedBudget: p.proposedBudget,
              proposedTimeline: p.proposedTimeline,
              attachments: p.attachments,
              status: p.status,
              rating: p.rating,
              ratingComment: p.ratingComment,
              createdAt: p.createdAt,
              updatedAt: p.updatedAt,
              project: {
                id: p.project.id,
                userId: p.project.userId,
                title: p.project.title,
                description: p.project.description,
                budget: p.project.budget,
                deadline: p.project.deadline,
                requiredSkills: p.project.requiredSkills,
                status: p.project.status,
                createdAt: p.project.createdAt,
                updatedAt: p.project.updatedAt,
                user: p.project.user,
                proposals: []
              },
              engineer: p.engineer
            })) || []}
            isProjectOwner={false}
          />
        </div>
      )}

      {/* レビュー一覧 */}
      {user.receivedReviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">レビュー</h2>
          <div className="space-y-4">
            {user.receivedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white shadow rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {review.reviewer.profileImageUrl ? (
                        <Image
                          className="h-10 w-10 rounded-full"
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
                      <p className="text-sm text-gray-500">
                        {review.contract.project.title}
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
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* バッジ一覧 */}
      {user.badges.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">獲得バッジ</h2>
          <div className="flex flex-wrap gap-4">
            {user.badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white shadow rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-medium">{badge.badgeType}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(badge.awardedAt).toLocaleDateString()}に獲得
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
