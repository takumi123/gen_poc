'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import type { ICommand } from '@uiw/react-md-editor';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface ProjectFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialBudget?: string;
  initialPeriod?: string;
  onSubmit: (data: {
    title: string;
    content: string;
    budget: string;
    period: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export function ProjectForm({
  initialTitle = '',
  initialContent = '',
  initialBudget = '',
  initialPeriod = '',
  onSubmit,
  isSubmitting,
}: ProjectFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [budget, setBudget] = useState(initialBudget);
  const [period, setPeriod] = useState(initialPeriod);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('画像のアップロードに失敗しました');
      }

      const blob = await response.json();
      // マークダウンの画像記法を挿入
      const imageMarkdown = `![${file.name}](${blob.url})`;
      setContent((prev) => prev + '\n' + imageMarkdown + '\n');
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      alert('画像のアップロードに失敗しました');
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          await handleImageUpload(file);
        } else {
          alert('画像ファイルのみアップロード可能です');
        }
      }
    },
    [handleImageUpload]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 期間の数値バリデーション
    const periodNumber = parseInt(period);
    if (isNaN(periodNumber) || periodNumber <= 0) {
      alert('期間は正の整数で入力してください');
      return;
    }

    // 予算の数値バリデーション
    const budgetNumber = parseInt(budget);
    if (isNaN(budgetNumber) || budgetNumber <= 0) {
      alert('予算は正の整数で入力してください');
      return;
    }

    await onSubmit({
      title,
      content,
      budget: budgetNumber.toString(),
      period: periodNumber.toString(),
    });
  };

  const handleImageButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleImageUpload(file);
      }
    };
    input.click();
  };

  const commandsFilter = (command: ICommand): false | ICommand => {
    if (command.name === 'image') return false;
    return command;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          案件タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700"
          >
            予算
          </label>
          <input
            type="text"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
            placeholder="例: 100万円"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="period"
            className="block text-sm font-medium text-gray-700"
          >
            期間
          </label>
          <input
            type="text"
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            required
            placeholder="例: 30（日数で入力）"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative ${dragActive ? 'bg-gray-100' : ''}`}
      >
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            案件詳細（マークダウン形式）
          </label>
          <button
            type="button"
            onClick={handleImageButtonClick}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg
              className="w-4 h-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            画像を追加
          </button>
        </div>
        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(value) => setContent(value || '')}
            height={400}
            preview="edit"
            commandsFilter={commandsFilter}
          />
        </div>
        {dragActive && (
          <div className="absolute inset-0 bg-indigo-100 bg-opacity-50 flex items-center justify-center">
            <p className="text-lg font-medium text-indigo-600">
              画像をドロップしてアップロード
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md text-white ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? '投稿中...' : '案件を投稿'}
        </button>
      </div>
    </form>
  );
}