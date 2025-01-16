import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Transform Your Fitness Journey
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Personalized AI-powered workouts and nutrition plans tailored to your goals
        </p>
        <Link 
          href="/auth/login"
          className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-600 transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  )
}