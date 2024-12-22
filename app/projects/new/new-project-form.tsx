'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '../../components/ProjectForm';
import { ProjectStatus } from '../../types';

export function NewProjectForm() {
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
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.content,
          budget: data.budget,
          period: data.period,
          status: ProjectStatus.OPEN,
        }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        if (e instanceof Error && e.message.includes('JSON')) {
          throw new Error('認証エラー: ログインが必要です');
        }
        throw new Error('サーバーからの応答が不正です');
      }

      if (!response.ok) {
        throw new Error(responseData?.error || '案件の投稿に失敗しました');
      }

      if (!responseData?.id) {
        throw new Error('案件IDが取得できませんでした');
      }

      router.push(`/projects/${responseData.id}`);
      router.refresh();
    } catch (error) {
      console.error('案件投稿エラー:', error instanceof Error ? error.message : error);
      alert(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProjectForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
