import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">サービス概要</h1>
      
      <div className="max-w-3xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">PoCマッチングプラットフォームとは</h2>
          <p className="text-gray-600 leading-relaxed">
            当サービスは、企業とエンジニアをつなぐPoC（Proof of Concept）専門のマッチングプラットフォームです。
            新しい技術の検証や革新的なアイデアの実現を目指す企業と、
            高度な技術力を持つエンジニアをマッチングし、
            効率的なPoCの実施をサポートします。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                PoC専門
              </h3>
              <p className="text-gray-600">
                PoCに特化したプラットフォームとして、
                効率的な技術検証のためのマッチングを実現します。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                スキルマッチング
              </h3>
              <p className="text-gray-600">
                プロジェクトに必要なスキルと、
                エンジニアの持つスキルを正確にマッチングします。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                安全な契約
              </h3>
              <p className="text-gray-600">
                契約から報酬の支払いまで、
                プラットフォームが安全にサポートします。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                充実したサポート
              </h3>
              <p className="text-gray-600">
                プロジェクトの進行中も、
                専門スタッフが手厚くサポートします。
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">ご利用の流れ</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">会員登録</h3>
                <p className="text-gray-600 mt-1">
                  企業様またはエンジニア様として会員登録を行います。
                  必要な情報を入力し、アカウントを作成してください。
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">プロジェクト作成・応募</h3>
                <p className="text-gray-600 mt-1">
                  企業様はPoCプロジェクトを作成し、
                  エンジニア様は興味のあるプロジェクトに応募します。
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">マッチング・契約</h3>
                <p className="text-gray-600 mt-1">
                  企業様とエンジニア様の間でマッチングが成立したら、
                  プラットフォーム上で契約を締結します。
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">PoC実施</h3>
                <p className="text-gray-600 mt-1">
                  契約締結後、PoCを実施します。
                  プラットフォーム上でコミュニケーションを取りながら
                  プロジェクトを進めていきます。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">料金プラン</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              成果報酬型
            </h3>
            <p className="text-gray-600 mb-4">
              プロジェクト成立時に、契約金額の10%を手数料としていただきます。
              プロジェクト不成立の場合は費用は発生しません。
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>会員登録料：無料</li>
              <li>月額利用料：無料</li>
              <li>プロジェクト掲載料：無料</li>
              <li>成果報酬：契約金額の10%</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
