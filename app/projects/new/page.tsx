import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '../../../lib/db'

export default function NewProject() {
  async function createProject(formData: FormData) {
    'use server'

    const title = formData.get('title')?.toString()
    const description = formData.get('description')?.toString()
    const budget = formData.get('budget')?.toString()

    if (!title || !description || !budget) {
      throw new Error('必須項目が入力されていません')
    }

    try {
      await prisma.project.create({
        data: {
          title,
          description,
          budget: parseInt(budget, 10),
          userId: 'dummy-client-id', // ダミークライアントのID
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('プロジェクトの作成に失敗しました')
    }

    redirect('/')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        新規プロジェクト作成
      </h1>

      <form action={createProject}>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              プロジェクトタイトル
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="例: 生成AIを使用した画像生成システムのPoC"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              プロジェクトの説明
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="プロジェクトの目的、要件、期待する成果などを記載してください"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700"
            >
              予算（円）
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="budget"
                id="budget"
                required
                min="0"
                step="10000"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="例: 500000"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              ※ 予算は10,000円単位で設定してください
            </p>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <Link
                href="/"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                作成する
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
