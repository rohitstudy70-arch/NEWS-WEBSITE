'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex w-full items-center space-x-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
    >
      <LogOut className="w-4 h-4 text-red-500" />
      <span>{loading ? 'लॉग आउट हो रहा है...' : 'लॉग आउट'}</span>
    </button>
  );
}
