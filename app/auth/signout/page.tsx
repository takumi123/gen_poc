"use client"

import { signOut } from "next-auth/react"
import { useEffect } from "react"

export default function SignOut() {
  useEffect(() => {
    signOut({ callbackUrl: "/" })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
        <p>ログアウトしています...</p>
      </div>
    </div>
  )
}
