'use client';

import dynamic from 'next/dynamic';

const MDPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface ProjectDetailProps {
  project: {
    title: string;
    budget: number;
    deadline: Date | null;
    description: string;
  };
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">予算</p>
            <p className="text-lg font-medium">{project.budget}円</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">期限</p>
            <p className="text-lg font-medium">
              {project.deadline
                ? new Date(project.deadline).toLocaleDateString()
                : '未設定'}
            </p>
          </div>
        </div>
        <div className="prose max-w-none">
          <MDPreview source={project.description} />
        </div>
      </div>
    </div>
  );
}
