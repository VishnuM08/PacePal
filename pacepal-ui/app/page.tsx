'use client';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="px-6 py-12 md:py-24 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
          Master your time with <span className="text-indigo-600">PacePal.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          A minimalist focus tracker designed for developers and students. 
          Sync your deep work sessions directly to the cloud.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
            Register
          </Link>
          <Link href="/login" className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-full font-bold text-lg hover:border-indigo-600 transition">
            Sign In
          </Link>
        </div>
      </header>

      {/* Feature Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold mb-2">Deep Work Timer</h3>
            <p className="text-gray-600">Optimized Pomodoro cycles to keep your brain in the flow state.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2">Secure Sync</h3>
            <p className="text-gray-600">Your data is protected with JWT authentication and stored in MySQL.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Visual Progress</h3>
            <p className="text-gray-600">Track your daily goals with our interactive analytics dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
}