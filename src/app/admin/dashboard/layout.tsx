import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, FileText, FolderPlus, MessageSquare, Mail, ArrowLeft } from 'lucide-react';
import React from 'react';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors">
      {/* Sidebar Panel */}
      <aside className="w-64 border-r border-border bg-card flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase block mb-1">कंट्रोल पैनल</span>
            <h2 className="text-base font-extrabold text-foreground flex items-center space-x-1.5">
              <span>टेक ख़बर</span>
              <span className="bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded">ADMIN</span>
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-semibold">लॉग इन: {session.name}</p>
          </div>

          <nav className="flex flex-col space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-2.5 text-xs font-bold text-foreground/80 hover:text-primary hover:bg-accent px-3 py-2.5 rounded-xl transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span>डैशबोर्ड ओवरव्यू</span>
            </Link>
            <Link
              href="/admin/dashboard/articles"
              className="flex items-center space-x-2.5 text-xs font-bold text-foreground/80 hover:text-primary hover:bg-accent px-3 py-2.5 rounded-xl transition-all"
            >
              <FileText className="w-4 h-4 text-primary" />
              <span>लेख प्रबंधित करें</span>
            </Link>
            <Link
              href="/admin/dashboard/categories"
              className="flex items-center space-x-2.5 text-xs font-bold text-foreground/80 hover:text-primary hover:bg-accent px-3 py-2.5 rounded-xl transition-all"
            >
              <FolderPlus className="w-4 h-4 text-primary" />
              <span>कैटेगरी प्रबंधित करें</span>
            </Link>
            <Link
              href="/admin/dashboard/comments"
              className="flex items-center space-x-2.5 text-xs font-bold text-foreground/80 hover:text-primary hover:bg-accent px-3 py-2.5 rounded-xl transition-all"
            >
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>कमेंट्स मॉडरेशन</span>
            </Link>
            <Link
              href="/admin/dashboard/subscribers"
              className="flex items-center space-x-2.5 text-xs font-bold text-foreground/80 hover:text-primary hover:bg-accent px-3 py-2.5 rounded-xl transition-all"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span>न्यूज़लेटर सब्सक्राइबर्स</span>
            </Link>
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-border">
          <Link
            href="/"
            className="flex items-center space-x-1 text-xs font-bold text-muted hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>मुख्य वेबसाइट पर जाएँ</span>
          </Link>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto bg-accent/20">
        {children}
      </main>
    </div>
  );
}
