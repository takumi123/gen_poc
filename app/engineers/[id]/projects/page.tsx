import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ProposalList } from '@/app/components/ProposalList';
import { UserNav } from '@/app/components/UserNav';
import { UserRole, ProposalStatus, Proposal } from '@/app/types';

interface EngineerProjectsPageProps {
  params: {
    id: string;
  };
}

async function getEngineerProposals(id: string) {
  const engineer = await prisma.user.findUnique({
    where: { 
      id,
      role: UserRole.ENGINEER,
    },
    include: {
      proposals: {
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
    },
  });

  if (!engineer) {
    notFound();
  }

  return engineer;
}

export default async function EngineerProjectsPage({ params }: EngineerProjectsPageProps) {
  const engineer = await getEngineerProposals(params.id);

  const proposalStatusLabels: Record<ProposalStatus, string> = {
    [ProposalStatus.DRAFT]: '下書き',
    [ProposalStatus.SUBMITTED]: '提案中',
    [ProposalStatus.ACCEPTED]: '採用',
    [ProposalStatus.REJECTED]: '不採用',
    [ProposalStatus.WITHDRAWN]: '取り下げ',
  };

  // 提案をステータスごとにグループ化
  const proposalsByStatus = engineer.proposals.reduce((acc: Record<ProposalStatus, Proposal[]>, proposal: Proposal) => {
    if (!acc[proposal.status]) {
      acc[proposal.status] = [];
    }
    acc[proposal.status].push(proposal);
    return acc;
  }, Object.keys(ProposalStatus).reduce((acc, key) => {
    acc[key as ProposalStatus] = [];
    return acc;
  }, {} as Record<ProposalStatus, Proposal[]>));

  return (
    <div>
      <UserNav user={engineer} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">提案した案件</h1>
          <div className="flex items-center space-x-4">
            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="createdAt">提案日時順</option>
              <option value="status">ステータス順</option>
              <option value="budget">予算順</option>
            </select>
          </div>
        </div>

        {/* ステータスタブ */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {Object.entries(proposalStatusLabels).map(([status, label]) => (
              <button
                key={status}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${proposalsByStatus[status as ProposalStatus]?.length > 0
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {label}
                {proposalsByStatus[status as ProposalStatus]?.length > 0 && (
                  <span className="ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-600">
                    {proposalsByStatus[status as ProposalStatus].length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* 提案一覧 */}
        {engineer.proposals.length > 0 ? (
          <ProposalList
            proposals={engineer.proposals}
            isProjectOwner={false}
          />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">まだ提案をしていません</p>
          </div>
        )}

        {/* ページネーション */}
        {engineer.proposals.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">前へ</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">次へ</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
