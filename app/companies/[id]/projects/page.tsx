import { notFound } from 'next/navigation';
import { prisma } from 'lib/db';
import { ProjectCard } from 'app/components/ProjectCard';
import { UserNav } from 'app/components/UserNav';
import { UserRole } from 'app/types';

interface CompanyProjectsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCompanyProjects(id: string) {
  const company = await prisma.user.findUnique({
    where: { 
      id,
      role: UserRole.CLIENT,
    },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          proposals: {
            include: {
              project: {
                include: {
                  user: true
                }
              },
              engineer: true
            }
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

export default async function CompanyProjectsPage({ params }: CompanyProjectsPageProps) {
  const { id } = await params;
  const company = await getCompanyProjects(id);

  return (
    <div>
      <UserNav user={company} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">投稿した案件</h1>
          <div className="flex items-center space-x-4">
            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="createdAt">投稿日時順</option>
              <option value="status">ステータス順</option>
              <option value="budget">予算順</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {company.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {company.projects.length === 0 && (
            <div className="col-span-2 text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">まだ案件を投稿していません</p>
            </div>
          )}
        </div>

        {company.projects.length > 0 && (
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
