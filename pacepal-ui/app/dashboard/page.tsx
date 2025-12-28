'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '../components/Timer';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const router = useRouter();

  // 1. Fetch History from Backend
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

  // 2. Delete Session Logic
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (sessionId: number) => {
    if (!window.confirm("Delete this study session?")) return;

    setIsDeleting(sessionId); // Set loading state for this specific ID
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHistory();
    } catch (err) {
      alert("Delete failed. Please try again.");
    } finally {
      setIsDeleting(null); // Reset loading state
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setUser(storedUser);
      fetchHistory();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-indigo-600">PacePal Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="font-medium">Hi, {user}!</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 border rounded-xl bg-indigo-50 shadow-sm">
            <Timer onSave={fetchHistory} />
          </div>
          <div className="p-6 border rounded-xl bg-green-50 shadow-sm flex flex-col justify-center">
            <h2 className="font-semibold text-green-800 text-lg uppercase tracking-wider">Total Progress</h2>
            <p className="text-5xl font-black text-green-700 mt-2">{totalMinutes} <span className="text-xl">mins</span></p>
            <p className="text-gray-500 mt-1 italic">Saved {sessions.length} sessions today</p>
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
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.slice().reverse().map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold">{s.topic}</td>
                    <td className="px-6 py-4 text-gray-600">{s.durationMinutes} mins</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(s.startTime).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={isDeleting === s.id}
                        className="text-red-400 hover:text-red-600 disabled:text-gray-300"
                      >
                        {isDeleting === s.id ? '...' : '✕'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}