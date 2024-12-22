import './globals.css'
import type { Metadata } from 'next'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Sidebar } from './components/Sidebar'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'PoC専門のマッチングプラットフォーム',
  description: '企業のPoC案件とエンジニアをマッチングするプラットフォーム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full">
        <Providers>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="flex min-h-[calc(100vh-64px)]">
              <Sidebar />
              <div className="flex-1 flex flex-col w-full">
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="w-full">
                    {children}
                  </div>
                </main>
                <Footer />
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
