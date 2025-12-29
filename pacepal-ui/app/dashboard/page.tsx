'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '../components/Timer';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const router = useRouter();

  // 1. Settings
  const DAILY_GOAL = 3; // Changed from 2 to 60 for a realistic minute-based goal

  // 2. Data Fetching
  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:8080/api/sessions/my-history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  // 3. Auth & Initial Load (Merged into one effect)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');

    if (!token) {
      router.push('/login');
    } else {
      setUser(storedUser);
      fetchHistory().then(() => setLoading(false));
    }
  }, [router]);

  // 4. Delete Logic
  const handleDelete = async (sessionId: number) => {
    if (!window.confirm("Delete this study session?")) return;
    setIsDeleting(sessionId);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHistory();
    } catch (err) {
      alert("Delete failed. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  // 5. Derived Stats
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const progress = Math.min((totalMinutes / DAILY_GOAL) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Securing your session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-indigo-600 italic">PacePal</h1>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700 underline decoration-indigo-300">Welcome, {user}!</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 border rounded-xl bg-indigo-50 shadow-sm border-indigo-100">
            <Timer onSave={fetchHistory} />
          </div>

          <div className="p-6 border rounded-xl bg-white shadow-sm border-indigo-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-gray-700 text-lg uppercase">Daily Study Goal</h2>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  {Math.round(progress)}%
                </span>
              </div>
              <p className="text-4xl font-black text-indigo-700 mt-2">
                {totalMinutes} <span className="text-lg">/ {DAILY_GOAL} mins</span>
              </p>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden border border-gray-200 mt-4">
                <div
                  className="bg-indigo-500 h-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">
              {totalMinutes >= DAILY_GOAL
                ? "🎉 Goal achieved! You're on fire!"
                : `${DAILY_GOAL - totalMinutes} more minutes to hit your daily target.`}
            </p>
          </div>
        </div>

        {/* History Table */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-700">Recent Activity</h2>
          <div className="overflow-hidden border rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Topic</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                      No sessions logged yet. Start your first timer above!
                    </td>
                  </tr>
                ) : (
                  sessions.slice().reverse().map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold">{s.topic}</td>
                      <td className="px-6 py-4 text-gray-600">{s.durationMinutes} mins</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{new Date(s.startTime).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={isDeleting === s.id}
                          className="text-red-400 hover:text-red-600 disabled:text-gray-300 transition-colors"
                        >
                          {isDeleting === s.id ? '...' : '✕'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}