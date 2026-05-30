'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'लॉग इन करने में विफलता हुई।');
      }
    } catch {
      setError('सर्वर से कनेक्ट होने में त्रुटि।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-card text-card-foreground p-8 rounded-3xl border border-border shadow-md transition-all">
        {/* Title details */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
            एडमिन लॉग इन
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground font-semibold">
            Tech Khabar AI डेटाबेस प्रबंधन पैनल
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold p-3.5 rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">यूज़रनेम</label>
              <input
                id="admin-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">पासवर्ड</label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer"
            >
              <span>{loading ? 'लॉग इन किया जा रहा है...' : 'लॉग इन करें'}</span>
              <LogIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
