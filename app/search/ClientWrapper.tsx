'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const SearchClient = dynamic(() => import('./SearchClient'), {
  ssr: false,
})

export default function ClientWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-12">読み込み中...</div>}>
      <SearchClient />
    </Suspense>
  )
}
