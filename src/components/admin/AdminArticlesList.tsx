'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Eye, Plus, Search } from 'lucide-react';

interface ArticleItem {
  _id: string;
  title: string;
  slug: string;
  isDraft: boolean;
  views: number;
  publishedAt: string;
  category: { name: string };
}

interface AdminArticlesListProps {
  initialArticles: ArticleItem[];
}

export default function AdminArticlesList({ initialArticles }: AdminArticlesListProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('क्या आप सच में इस आर्टिकल को डिलीट करना चाहते हैं?')) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter((art) => art._id !== id));
      } else {
        alert('डिलीट करने में विफलता हुई।');
      }
    } catch {
      alert('सर्वर एरर।');
    }
  };

  const filteredArticles = articles.filter((art) =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="आर्टिकल्स सर्च करें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card text-foreground text-xs md:text-sm rounded-xl py-2.5 pl-4 pr-10 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-muted absolute right-3.5 top-3" />
        </div>

        <Link
          href="/admin/dashboard/articles/new"
          className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>नया आर्टिकल लिखें</span>
        </Link>
      </div>

      {/* Articles table */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-accent/40 border-b border-border text-[10px] md:text-xs font-bold text-muted uppercase tracking-wider">
                <th className="p-4 pl-6">शीर्षक (Title)</th>
                <th className="p-4">कैटेगरी</th>
                <th className="p-4">व्यूज</th>
                <th className="p-4">स्थिति</th>
                <th className="p-4">तारीख</th>
                <th className="p-4 pr-6 text-right">कार्रवाई (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs font-semibold">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    कोई आर्टिकल नहीं मिला।
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art._id} className="hover:bg-accent/15 transition-colors">
                    <td className="p-4 pl-6 font-bold text-foreground max-w-xs md:max-w-md truncate">
                      {art.title}
                    </td>
                    <td className="p-4 text-muted">
                      {art.category?.name || 'Uncategorized'}
                    </td>
                    <td className="p-4 text-foreground/90">
                      {art.views?.toLocaleString('hi-IN') || 0}
                    </td>
                    <td className="p-4">
                      {art.isDraft ? (
                        <span className="bg-amber-500/10 text-amber-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full">ड्राफ्ट</span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full">लाइव</span>
                      )}
                    </td>
                    <td className="p-4 text-muted">
                      {new Date(art.publishedAt).toLocaleDateString('hi-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1.5 flex justify-end items-center h-full">
                      <Link
                        href={`/news/${art.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-border bg-accent/40 text-muted hover:text-primary transition-colors cursor-pointer"
                        title="वेबसाइट पर देखें"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/dashboard/articles/edit/${art._id}`}
                        className="p-1.5 rounded-lg border border-border bg-accent/40 text-muted hover:text-blue-500 transition-colors cursor-pointer"
                        title="एडिट करें"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(art._id)}
                        className="p-1.5 rounded-lg border border-border bg-accent/40 text-muted hover:text-red-500 transition-colors cursor-pointer"
                        title="डिलीट करें"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
  );
}
