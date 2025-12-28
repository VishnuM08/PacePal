'use client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  
  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 text-white p-1 rounded-lg font-bold">PP</div>
        <span className="text-xl font-bold text-gray-800">PacePal</span>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={() => router.push('/dashboard')} className="text-gray-600 hover:text-indigo-600 font-medium">Dashboard</button>
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}