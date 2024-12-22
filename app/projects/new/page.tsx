import { auth } from '../../../auth';
import { NewProjectForm } from './new-project-form';

export default async function NewProjectPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">
          案件を投稿するにはログインが必要です
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">新規案件投稿</h1>
      <NewProjectForm />
    </div>
  );
}
