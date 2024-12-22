import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">利用規約</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. はじめに</h2>
          <p>本利用規約（以下「本規約」）は、当社が提供するPoC専門のマッチングプラットフォーム（以下「本サービス」）の利用条件を定めるものです。</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. 定義</h2>
          <p>本規約において使用する用語の定義は以下の通りとします：</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>「ユーザー」とは、本サービスを利用する全ての個人または法人を指します。</li>
            <li>「エンジニア」とは、本サービスを通じてPoCを提供する個人を指します。</li>
            <li>「企業」とは、本サービスを通じてPoCを依頼する法人を指します。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. サービスの利用</h2>
          <p>本サービスの利用にあたり、ユーザーは以下の事項に同意するものとします：</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>登録情報は正確かつ最新の情報を提供すること</li>
            <li>自己の責任において本サービスを利用すること</li>
            <li>法令および本規約を遵守すること</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. 禁止事項</h2>
          <p>ユーザーは本サービスの利用にあたり、以下の行為を行ってはならないものとします：</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>法令または公序良俗に違反する行為</li>
            <li>当社または第三者の知的財産権を侵害する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>他のユーザーに対する嫌がらせや迷惑行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. 免責事項</h2>
          <p>当社は、本サービスに関して以下の事項について一切の責任を負わないものとします：</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>ユーザー間のトラブルや紛争</li>
            <li>本サービスの中断または停止</li>
            <li>情報の正確性や完全性</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
