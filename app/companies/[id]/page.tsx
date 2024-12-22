import { notFound } from 'next/navigation';
import { prisma } from 'lib/db';
import UserProfile from 'app/components/UserProfile';
import { ProjectCard } from 'app/components/ProjectCard';
import { UserNav } from 'app/components/UserNav';
import { UserRole, User, Project, Proposal, Review, Contract } from 'app/types';
import Image from 'next/image';

interface CompanyPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCompany(id: string) {
  const company = await prisma.user.findUnique({
    where: { 
      id,
      role: UserRole.CLIENT,
    },
    include: {
      projects: {
        where: { status: { not: 'DRAFT' } },
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          proposals: {
            include: {
              engineer: true,
              project: {
                include: {
                  user: true
                }
              }
            }
          },
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
    },
  });

  if (!company) {
    notFound();
  }

  // Prismaの戻り値を適切な型に変換
  const formattedCompany: User = {
    id: company.id,
    email: company.email,
    role: company.role,
    status: company.status,
    displayName: company.displayName,
    profileImageUrl: company.profileImageUrl,
    bio: company.bio,
    companyName: company.companyName,
    companySize: company.companySize,
    industry: company.industry,
    location: company.location,
    skills: company.skills,
    experienceYears: company.experienceYears,
    portfolioUrl: company.portfolioUrl,
    isProfilePublic: company.isProfilePublic,
    emailVerifiedAt: company.emailVerifiedAt,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
    projects: company.projects.map(project => {
      const formattedProject: Project = {
        id: project.id,
        userId: project.userId,
        title: project.title,
        description: project.description,
        budget: project.budget,
        deadline: project.deadline,
        requiredSkills: project.requiredSkills,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        user: project.user,
        proposals: project.proposals.map(proposal => {
          const formattedProposal: Proposal = {
            id: proposal.id,
            projectId: proposal.projectId,
            engineerId: proposal.engineerId,
            proposalText: proposal.proposalText,
            approachDescription: proposal.approachDescription,
            proposedBudget: proposal.proposedBudget,
            proposedTimeline: proposal.proposedTimeline,
            attachments: proposal.attachments,
            status: proposal.status,
            rating: proposal.rating,
            ratingComment: proposal.ratingComment,
            createdAt: proposal.createdAt,
            updatedAt: proposal.updatedAt,
            project: {
              ...proposal.project,
              user: proposal.project.user,
              proposals: []
            },
            engineer: proposal.engineer,
            messages: []
          };
          return formattedProposal;
        })
      };
      return formattedProject;
    }),
    receivedReviews: company.receivedReviews.map(review => {
      const formattedContract: Contract = {
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
      };

      const formattedReview: Review = {
        id: review.id,
        contractId: review.contractId,
        reviewerId: review.reviewerId,
        revieweeId: review.revieweeId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        contract: formattedContract,
        reviewer: review.reviewer
      };
      return formattedReview;
    })
  };

  return formattedCompany;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const company = await getCompany(id);

  // UserNavに必要な情報のみを抽出
  const userNavProps = {
    id: company.id,
    role: company.role,
    email: company.email,
    displayName: company.displayName,
    profileImageUrl: company.profileImageUrl,
    status: company.status,
  };

  return (
    <div>
      <UserNav user={userNavProps} />
      
      <div className="container mx-auto px-4 py-8">
        <UserProfile user={company} />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">最近の案件</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {company.projects?.slice(0, 4).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {(!company.projects || company.projects.length === 0) && (
              <p className="text-gray-500">まだ案件を投稿していません</p>
            )}
          </div>
        </div>

        {company.receivedReviews && company.receivedReviews.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">最近のレビュー</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {company.receivedReviews.slice(0, 4).map((review) => (
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
      </div>
    </div>
  );
}
