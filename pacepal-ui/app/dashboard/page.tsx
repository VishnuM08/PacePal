'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '../components/Timer';

export default function Dashboard() {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in
    const storedUser = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login'); // Redirect to login if no token found
    } else {
      setUser(storedUser);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to PacePal, {user}!</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* LEFT COLUMN: The Timer (Previously "Current Goal") */}
  <div className="p-6 border rounded-lg bg-indigo-50">
    <Timer />
  </div>
          <div className="p-6 border rounded-lg bg-green-50">
            <h2 className="font-semibold text-green-800">Study Streak</h2>
            <p className="text-gray-600 mt-2">Day 1: The journey begins!</p>
          </div>
        </div>
      </div>
    </div>
  );
}