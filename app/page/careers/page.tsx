import React from 'react';

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">採用情報</h1>
      
      <div className="max-w-3xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">私たちのミッション</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 leading-relaxed">
              私たちは、技術の力で企業の可能性を広げることを目指しています。
              PoCマッチングプラットフォームを通じて、
              企業とエンジニアの出会いを創出し、
              新しい価値を生み出すことに貢献します。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">募集職種</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                フルスタックエンジニア
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  プラットフォームの開発・運用を担当していただきます。
                  フロントエンドからバックエンドまで、幅広い技術スタックを活用した開発に携わることができます。
                </p>
                <div>
                  <h4 className="font-medium mb-2">必要なスキル・経験</h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>TypeScript, React, Node.jsでの開発経験</li>
                    <li>RDBMSを用いたシステム開発経験</li>
                    <li>GitHubを用いたチーム開発経験</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                プロダクトマネージャー
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  プロダクトの企画・設計から運用まで、
                  プロダクト全体のマネジメントを担当していただきます。
                </p>
                <div>
                  <h4 className="font-medium mb-2">必要なスキル・経験</h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>Webサービスの企画・運用経験</li>
                    <li>プロジェクトマネジメント経験</li>
                    <li>ユーザーインタビューやデータ分析の経験</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                カスタマーサクセス
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  企業様とエンジニア様の双方に対して、
                  プラットフォームの活用をサポートし、
                  成功体験を提供していただきます。
                </p>
                <div>
                  <h4 className="font-medium mb-2">必要なスキル・経験</h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    <li>カスタマーサポート・サクセスの経験</li>
                    <li>IT業界での就業経験</li>
                    <li>コミュニケーション能力</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">働く環境</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">制度・福利厚生</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>フレックスタイム制</li>
                  <li>リモートワーク可能</li>
                  <li>書籍購入支援</li>
                  <li>資格取得支援</li>
                  <li>各種社会保険完備</li>
                  <li>副業・兼業可能</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">オフィス環境</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>最新のIT機器支給</li>
                  <li>フリードリンク</li>
                  <li>リフレッシュスペース</li>
                  <li>仮眠室完備</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">選考プロセス</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <ol className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">書類選考</h3>
                  <p className="text-gray-600">
                    履歴書、職務経歴書をご提出いただきます。
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">カジュアル面談</h3>
                  <p className="text-gray-600">
                    オンラインで30分程度、双方の期待値をすり合わせます。
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">技術面接 / 適性面接</h3>
                  <p className="text-gray-600">
                    職種に応じた専門的な面接を行います。
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">最終面接</h3>
                  <p className="text-gray-600">
                    役員との面接を行います。
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">応募方法</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">
              以下のメールアドレスに必要書類を添付の上、ご応募ください：
            </p>
            <p className="font-medium">careers@example.com</p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">必要書類</h3>
              <ul className="list-disc pl-6 text-gray-600">
                <li>履歴書</li>
                <li>職務経歴書</li>
                <li>ポートフォリオ（エンジニア職のみ）</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
