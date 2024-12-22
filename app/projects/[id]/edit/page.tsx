import { notFound, redirect } from 'next/navigation';
import { prisma } from '../../../../lib/db';
import { auth } from '../../../../auth';
import { EditProjectForm } from './edit-project-form';

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      budget: true,
      deadline: true,
      userId: true,
      user: true,
    }
  });

  if (!project) {
    notFound();
  }

  return project;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const [session, project] = await Promise.all([
    auth(),
    getProject(id)
  ]);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  if (session.user.id !== project.userId) {
    redirect(`/projects/${project.id}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">案件の編集</h1>
      <EditProjectForm
        initialTitle={project.title}
        initialContent={project.description}
        initialBudget={project.budget.toString()}
        initialPeriod={project.deadline?.toISOString() ?? ''}
        projectId={project.id}
      />
    </div>
  );
}
