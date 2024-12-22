import { notFound } from 'next/navigation';
import { prisma } from 'lib/db';
import UserProfile from 'app/components/UserProfile';
import { ProposalList } from 'app/components/ProposalList';
import { UserNav } from 'app/components/UserNav';
import { UserRole, User } from 'app/types';
import Image from 'next/image';

interface EngineerPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getEngineer(id: string) {
  const engineer = await prisma.user.findUnique({
    where: { 
      id,
      role: UserRole.ENGINEER,
    },
    include: {
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
      receivedReviews: {
        include: {
          reviewer: true,
          contract: {
            include: {
              project: {
                include: {
                  user: true
                }
              },
              proposal: {
                include: {
                  engineer: true,
                  project: {
                    include: {
                      user: true
                    }
                  }
                }
              }
            },
          },
        },
      },
      badges: true,
    },
  });

  if (!engineer) {
    notFound();
  }

  // Prismaの戻り値を適切な型に変換
  const formattedEngineer = {
    ...engineer,
    proposals: engineer.proposals.map(proposal => ({
      ...proposal,
      project: {
        ...proposal.project,
        user: proposal.project.user,
        proposals: []
      },
      messages: []
    })),
    badges: engineer.badges.map(badge => ({
      ...badge,
      user: {
        id: engineer.id,
        email: engineer.email,
        role: engineer.role,
        status: engineer.status,
        displayName: engineer.displayName,
        profileImageUrl: engineer.profileImageUrl,
        bio: engineer.bio,
        companyName: engineer.companyName,
        companySize: engineer.companySize,
        industry: engineer.industry,
        location: engineer.location,
        skills: engineer.skills,
        experienceYears: engineer.experienceYears,
        portfolioUrl: engineer.portfolioUrl,
        isProfilePublic: engineer.isProfilePublic,
        emailVerifiedAt: engineer.emailVerifiedAt,
        createdAt: engineer.createdAt,
        updatedAt: engineer.updatedAt
      }
    })),
    receivedReviews: engineer.receivedReviews.map(review => ({
      ...review,
      contract: {
        ...review.contract,
        project: {
          ...review.contract.project,
          user: review.contract.project.user,
          proposals: []
        },
        proposal: {
          ...review.contract.proposal,
          project: {
            ...review.contract.proposal.project,
            user: review.contract.proposal.project.user,
            proposals: []
          },
          engineer: review.contract.proposal.engineer,
          messages: []
        },
        messages: [],
        reviews: []
      }
    }))
  } as User;

  return formattedEngineer;
}

export default async function EngineerPage({ params }: EngineerPageProps) {
  const { id } = await params;
  const engineer = await getEngineer(id);

  return (
    <div>
      <UserNav user={engineer} />
      
      <div className="container mx-auto px-4 py-8">
        <UserProfile user={engineer} />

        {/* スキルセット */}
        {engineer.skills && Object.keys(engineer.skills).length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">スキルセット</h2>
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(engineer.skills as Record<string, number>).map(
                  ([skill, years]) => (
                    <div key={skill} className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{skill}</span>
                      <span className="text-gray-600">{years}年</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* 最近の提案 */}
        {engineer.proposals && engineer.proposals.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">最近の提案</h2>
            <ProposalList
              proposals={engineer.proposals.slice(0, 4)}
              isProjectOwner={false}
            />
          </div>
        )}

        {/* レビュー一覧 */}
        {engineer.receivedReviews && engineer.receivedReviews.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">レビュー</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {engineer.receivedReviews.slice(0, 4).map((review) => (
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
        {engineer.badges && engineer.badges.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">獲得バッジ</h2>
            <div className="flex flex-wrap gap-4">
              {engineer.badges.map((badge) => (
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
    </div>
  );
}
