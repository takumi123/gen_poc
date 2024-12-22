import { notFound } from 'next/navigation';
import { prisma } from 'lib/db';
import { auth } from 'auth';
import Link from 'next/link';
import { ProjectDetail } from 'app/components/ProjectDetail';
import { ProjectProposalList } from 'app/components/ProjectProposalList';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      user: true,
      proposals: {
        include: {
          project: {
            include: {
              user: true
            }
          },
          engineer: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return project;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const [project, session] = await Promise.all([
    getProject(id),
    auth()
  ]);
  const isOwner = session?.user?.id === project.userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        {isOwner && (
          <Link
            href={`/projects/${project.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            編集
          </Link>
        )}
      </div>

      <ProjectDetail
        project={{
          title: project.title,
          budget: project.budget,
          deadline: project.deadline,
          description: project.description,
        }}
      />

      {session?.user?.id && !isOwner && (
        <div className="mt-8">
          <Link
            href={`/projects/${project.id}/propose`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            提案する
          </Link>
        </div>
      )}

      <ProjectProposalList proposals={project.proposals} />
    </div>
  );
}
