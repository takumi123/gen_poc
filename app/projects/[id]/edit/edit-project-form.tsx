'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '../../../components/ProjectForm';

interface EditProjectFormProps {
  initialTitle: string;
  initialContent: string;
  initialBudget: string;
  initialPeriod: string;
  projectId: string;
}

export function EditProjectForm({
  initialTitle,
  initialContent,
  initialBudget,
  initialPeriod,
  projectId,
}: EditProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    budget: string;
    period: string;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          budget: data.budget,
          period: data.period,
        }),
      });

      let responseData;
      const responseText = await response.text();
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('JSONパースエラー:', e);
        throw new Error('サーバーからの応答が不正です');
      }

      if (!response.ok) {
        throw new Error(responseData.error || '案件の更新に失敗しました');
      }

      if (!responseData.id) {
        throw new Error('案件IDが取得できませんでした');
      }

      router.push(`/projects/${projectId}`);
      router.refresh();
    } catch (error) {
      console.error('案件更新エラー:', error);
      alert(error instanceof Error ? error.message : '案件の更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProjectForm
      initialTitle={initialTitle}
      initialContent={initialContent}
      initialBudget={initialBudget}
      initialPeriod={initialPeriod}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
