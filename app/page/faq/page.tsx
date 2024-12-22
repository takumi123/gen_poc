import React from 'react';

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">よくある質問</h1>
      
      <div className="max-w-3xl mx-auto space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">サービス全般について</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Q. このサービスは誰でも利用できますか？
              </h3>
              <p className="text-gray-600">
                A. 企業様は法人登録が必要です。エンジニア様は個人として登録いただけます。
                ただし、エンジニア様の場合は一定以上の技術力や実績を確認させていただく場合があります。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Q. 利用料金はかかりますか？
              </h3>
              <p className="text-gray-600">
                A. 基本的な会員登録や案件の閲覧は無料です。
                プロジェクトが成立した場合のみ、契約金額の10%を手数料としていただいております。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Q. 対応可能な技術領域は決まっていますか？
              </h3>
              <p className="text-gray-600">
                A. 特に制限は設けておりません。
                AI、ブロックチェーン、IoTなど、幅広い技術領域のPoCに対応可能です。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">企業様向けFAQ</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Q. プロジェクトの予算の目安はありますか？
              </h3>
              <p className="text-gray-600">
                A. プロジェクトの規模や期間によって異なりますが、
                一般的なPoCプロジェクトの場合、50万円〜300万円程度が目安となります。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Q. 機密保持は担保されますか？
              </h3>
              <p className="text-gray-600">
                A. はい。契約時にNDAを締結し、情報の取り扱いについて明確な取り決めを行います。
                プラットフォーム上でのやり取りも暗号化されています。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">エンジニア様向けFAQ</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Q. 複数のプロジェクトに同時に参加できますか？
              </h3>
              <p className="text-gray-600">
                A. 可能です。ただし、各プロジェクトの期間や要件を十分に考慮した上で、
                確実に遂行できる範囲でお願いいたします。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Q. 報酬はいつ支払われますか？
              </h3>
              <p className="text-gray-600">
                A. プロジェクトの完了後、成果物の検収が完了次第、
                指定の口座に振り込まれます（通常5営業日以内）。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">トラブル対応</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Q. プロジェクト進行中に問題が発生した場合はどうすればよいですか？
              </h3>
              <p className="text-gray-600">
                A. カスタマーサポートが問題解決をサポートいたします。
                チャットまたはメールでお問い合わせください。
                緊急の場合は、専用のホットラインもご用意しています。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Q. 契約後のキャンセルは可能ですか？
              </h3>
              <p className="text-gray-600">
                A. 契約書に定められた条件に従って対応いたします。
                原則として、発生した費用の精算が必要となる場合があります。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
