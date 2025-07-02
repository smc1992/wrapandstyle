'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RoleCheckWaiter() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      // Attempt to refresh the page, which will re-run the server-side
      // role check in the dashboard router.
      router.refresh()
    }, 3000) // Wait for 3 seconds to allow the database trigger to complete.

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-6 bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800">
          Einen Moment, bitte...
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Ihr Account wird eingerichtet. Sie werden in Kürze weitergeleitet.
        </p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mt-4"></div>
      </div>
    </div>
  )
}
