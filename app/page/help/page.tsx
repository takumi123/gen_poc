import React from 'react';

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ヘルプセンター</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-3">はじめての方へ</h2>
            <ul className="space-y-2">
              <li>
                <a href="#registration" className="text-blue-600 hover:text-blue-800">
                  ・会員登録の方法
                </a>
              </li>
              <li>
                <a href="#profile" className="text-blue-600 hover:text-blue-800">
                  ・プロフィールの設定
                </a>
              </li>
              <li>
                <a href="#first-steps" className="text-blue-600 hover:text-blue-800">
                  ・最初の一歩
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-3">プロジェクト管理</h2>
            <ul className="space-y-2">
              <li>
                <a href="#project-create" className="text-blue-600 hover:text-blue-800">
                  ・プロジェクトの作成方法
                </a>
              </li>
              <li>
                <a href="#project-apply" className="text-blue-600 hover:text-blue-800">
                  ・案件への応募方法
                </a>
              </li>
              <li>
                <a href="#project-management" className="text-blue-600 hover:text-blue-800">
                  ・進行中のプロジェクト管理
                </a>
              </li>
            </ul>
          </div>
        </div>

        <section id="registration" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">会員登録の方法</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h3 className="text-lg font-medium">Step 1: アカウントタイプの選択</h3>
            <p className="text-gray-600">
              トップページの「新規登録」ボタンをクリックし、「企業として登録」または「エンジニアとして登録」を選択します。
            </p>

            <h3 className="text-lg font-medium">Step 2: 基本情報の入力</h3>
            <p className="text-gray-600">
              必要な情報（メールアドレス、パスワード、基本プロフィール）を入力します。
              企業の場合は、会社名や事業内容などの追加情報が必要です。
            </p>

            <h3 className="text-lg font-medium">Step 3: メール認証</h3>
            <p className="text-gray-600">
              登録したメールアドレスに確認メールが送信されます。
              メール内のリンクをクリックして、メールアドレスの認証を完了してください。
            </p>
          </div>
        </section>

        <section id="profile" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">プロフィールの設定</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h3 className="text-lg font-medium">プロフィール写真の設定</h3>
            <p className="text-gray-600">
              プロフィール写真は、信頼性を高めるために重要です。
              企業ロゴまたはプロフィール写真をアップロードしてください。
            </p>

            <h3 className="text-lg font-medium">スキル・経験の入力</h3>
            <p className="text-gray-600">
              エンジニアの方は、得意な技術スタックや過去の実績を詳しく記入してください。
              具体的なプロジェクト例があると、マッチングの確率が高まります。
            </p>
          </div>
        </section>

        <section id="first-steps" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">最初の一歩</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
            <h3 className="text-lg font-medium">企業の方</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>プロジェクトの要件を明確にまとめる</li>
              <li>予算と期間を設定する</li>
              <li>プロジェクトを公開する</li>
              <li>応募者のプロフィールを確認し、コミュニケーションを開始する</li>
            </ol>

            <h3 className="text-lg font-medium">エンジニアの方</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>興味のある案件を探す</li>
              <li>プロジェクトの詳細を確認する</li>
              <li>提案書を作成して応募する</li>
              <li>企業からの連絡を待つ</li>
            </ol>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">お困りの方へ</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">
              上記の情報で解決できない問題がございましたら、以下の方法でサポートを受けることができます：
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">📧</span>
                メールサポート：support@example.com
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">💬</span>
                チャットサポート：平日10:00〜18:00
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">📞</span>
                電話サポート：03-XXXX-XXXX（平日10:00〜17:00）
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
