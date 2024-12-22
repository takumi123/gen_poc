import { notFound } from 'next/navigation';
import { prisma } from 'lib/db';
import { ReviewForm } from 'app/components/ReviewForm';
import { ContractStatus, Contract, Project, Proposal, Review as AppReview } from 'app/types';
import { submitReview } from './actions';

interface ReviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

type ContractWithRelations = Contract & {
  reviews: AppReview[];
};

async function getContract(id: string): Promise<ContractWithRelations> {
  const contract = await prisma.contract.findUnique({
    where: {
      id,
      status: ContractStatus.COMPLETED,
    },
    include: {
      project: {
        include: {
          user: true,
        },
      },
      proposal: {
        include: {
          engineer: true,
        },
      },
      reviews: {
        include: {
          reviewer: true,
        },
      },
    },
  });

  if (!contract) {
    notFound();
  }

  const formattedProject: Project = {
    ...contract.project,
    user: contract.project.user,
    proposals: []
  };

  const formattedProposal: Proposal = {
    ...contract.proposal,
    project: formattedProject,
    engineer: contract.proposal.engineer,
    messages: []
  };

  const formattedContract: ContractWithRelations = {
    id: contract.id,
    projectId: contract.projectId,
    proposalId: contract.proposalId,
    contractAmount: contract.contractAmount,
    startDate: contract.startDate,
    endDate: contract.endDate,
    deliverables: contract.deliverables,
    status: contract.status,
    createdAt: contract.createdAt,
    updatedAt: contract.updatedAt,
    project: formattedProject,
    proposal: formattedProposal,
    messages: [],
    reviews: contract.reviews.map(review => ({
      ...review,
      contract: {
        ...contract,
        project: formattedProject,
        proposal: formattedProposal,
        messages: [],
        reviews: []
      },
      reviewer: review.reviewer
    }))
  };

  return formattedContract;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params;
  const contract = await getContract(id);

  if (contract.reviews.length > 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">レビューを投稿</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            プロジェクト情報
          </h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">プロジェクト名</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contract.project.title}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">エンジニア</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contract.proposal.engineer.displayName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">契約期間</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(contract.startDate).toLocaleDateString()} 〜{' '}
                {new Date(contract.endDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">契約金額</dt>
              <dd className="mt-1 text-sm text-gray-900">
                ¥{contract.contractAmount.toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        <ReviewForm
          contract={contract}
          onSubmit={submitReview}
        />
      </div>
    </div>
  );
}
