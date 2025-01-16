'use client'

import { signIn } from "next-auth/react"
import { Card } from '@/app/components/ui'

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    await signIn('google', {
      callbackUrl: '/dashboard',
      redirect: true
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome to FitnessAI</h1>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            {/* Google icon SVG path */}
          </svg>
          Sign in with Google
        </button>
      </Card>
    </div>
  )
}