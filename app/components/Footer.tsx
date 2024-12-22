export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              サービスについて
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/page/about" className="text-base text-black hover:text-gray-700">
                  サービス概要
                </a>
              </li>
              <li>
                <a href="/page/terms" className="text-base text-black hover:text-gray-700">
                  利用規約
                </a>
              </li>
              <li>
                <a href="/page/privacy" className="text-base text-black hover:text-gray-700">
                  プライバシーポリシー
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              サポート
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/page/faq" className="text-base text-black hover:text-gray-700">
                  よくある質問
                </a>
              </li>
              <li>
                <a href="/page/contact" className="text-base text-black hover:text-gray-700">
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="/page/help" className="text-base text-black hover:text-gray-700">
                  ヘルプセンター
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              運営会社
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/page/company" className="text-base text-black hover:text-gray-700">
                  会社概要
                </a>
              </li>
              <li>
                <a href="/page/careers" className="text-base text-black hover:text-gray-700">
                  採用情報
                </a>
              </li>
              <li>
                <a href="/page/blog" className="text-base text-black hover:text-gray-700">
                  ブログ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; 2024 PoC専門のマッチングプラットフォーム. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
