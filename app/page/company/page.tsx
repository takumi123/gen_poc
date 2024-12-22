import React from 'react';

export default function CompanyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">会社概要</h1>
      
      <div className="max-w-3xl mx-auto">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <th className="py-4 px-6 text-left bg-gray-50 w-1/3">会社名</th>
              <td className="py-4 px-6">株式会社Example</td>
            </tr>
            <tr className="border-b">
              <th className="py-4 px-6 text-left bg-gray-50">設立</th>
              <td className="py-4 px-6">2024年1月</td>
            </tr>
            <tr className="border-b">
              <th className="py-4 px-6 text-left bg-gray-50">代表取締役</th>
              <td className="py-4 px-6">山田 太郎</td>
            </tr>
            <tr className="border-b">
              <th className="py-4 px-6 text-left bg-gray-50">資本金</th>
              <td className="py-4 px-6">5,000万円</td>
            </tr>
            <tr className="border-b">
              <th className="py-4 px-6 text-left bg-gray-50">所在地</th>
              <td className="py-4 px-6">
                〒100-0001<br />
                東京都千代田区千代田1-1-1<br />
                千代田ビル 10階
              </td>
            </tr>
            <tr className="border-b">
              <th className="py-4 px-6 text-left bg-gray-50">事業内容</th>
              <td className="py-4 px-6">
                <ul className="list-disc pl-4 space-y-2">
                  <li>PoC専門のマッチングプラットフォームの運営</li>
                  <li>ITコンサルティング事業</li>
                  <li>システム開発支援事業</li>
                  <li>エンジニアの育成・教育事業</li>
                </ul>
              </td>
            </tr>
            <tr className="border-b">
              <th className="py-4 px-6 text-left bg-gray-50">従業員数</th>
              <td className="py-4 px-6">50名（2024年1月現在）</td>
            </tr>
            <tr className="border-b">
              <th className="py-4 px-6 text-left bg-gray-50">取引銀行</th>
              <td className="py-4 px-6">
                <ul className="list-disc pl-4 space-y-2">
                  <li>○○銀行</li>
                  <li>××銀行</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">企業理念</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-lg font-medium mb-4">
              「技術の可能性を、すべての企業へ」
            </p>
            <p>
              私たちは、PoCを通じて企業のデジタルトランスフォーメーションを支援し、
              技術革新による新しい価値の創造を目指します。
              すべての企業が最新技術を活用できる環境を整備し、
              持続可能な社会の発展に貢献します。
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">アクセス</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-medium">最寄り駅：</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>東京メトロ千代田線「千代田駅」徒歩3分</li>
              <li>JR山手線「東京駅」徒歩10分</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
