import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. 個人情報の取得</h2>
          <p>当社は、以下の場合に個人情報を取得します：</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>ユーザー登録時</li>
            <li>お問い合わせフォームの送信時</li>
            <li>プロジェクトの作成・応募時</li>
            <li>メッセージのやり取り時</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. 取得する個人情報の項目</h2>
          <p>当社が取得する個人情報の項目は以下の通りです：</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>氏名</li>
            <li>メールアドレス</li>
            <li>電話番号（任意）</li>
            <li>所属企業名（企業ユーザーの場合）</li>
            <li>スキル情報（エンジニアの場合）</li>
            <li>プロフィール画像（任意）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. 個人情報の利用目的</h2>
          <p>取得した個人情報は、以下の目的で利用します：</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>本サービスの提供・運営</li>
            <li>ユーザー認証</li>
            <li>お問い合わせへの対応</li>
            <li>サービスの改善・新機能の開発</li>
            <li>利用規約違反の調査</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. 個人情報の第三者提供</h2>
          <p>当社は、以下の場合を除き、個人情報を第三者に提供しません：</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. 個人情報の管理</h2>
          <p>当社は、個人情報の管理について以下の対策を実施しています：</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>アクセス制御による不正アクセスの防止</li>
            <li>データの暗号化</li>
            <li>従業員の教育・監督</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. お問い合わせ窓口</h2>
          <p>個人情報に関するお問い合わせは、以下の窓口までご連絡ください：</p>
          <div className="mt-2">
            <p>メールアドレス：privacy@example.com</p>
            <p>受付時間：平日10:00〜18:00</p>
          </div>
        </section>
      </div>
    </div>
  );
}
