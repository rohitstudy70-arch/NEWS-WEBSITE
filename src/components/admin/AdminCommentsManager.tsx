'use client';

import React, { useState } from 'react';
import { Check, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface CommentItem {
  _id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
  articleId?: {
    title: string;
    slug: string;
  };
}

interface AdminCommentsManagerProps {
  initialComments: CommentItem[];
}

export default function AdminCommentsManager({ initialComments }: AdminCommentsManagerProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved: true }),
      });
      if (res.ok) {
        setComments(
          comments.map((com) => (com._id === id ? { ...com, approved: true } : com))
        );
      } else {
        alert('स्वीकार करने में समस्या आई।');
      }
    } catch {
      alert('सर्वर एरर।');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('क्या आप सच में इस कमेंट को डिलीट करना चाहते हैं?')) return;

    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setComments(comments.filter((com) => com._id !== id));
      } else {
        alert('डिलीट करने में समस्या आई।');
      }
    } catch {
      alert('सर्वर एरर।');
    }
  };

  const filteredComments = comments.filter((com) => {
    if (filter === 'pending') return !com.approved;
    if (filter === 'approved') return com.approved;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters bar */}
      <div className="flex space-x-2 border-b border-border pb-3">
        {(['all', 'pending', 'approved'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === opt
                ? 'bg-primary text-white shadow-sm'
                : 'bg-card hover:bg-accent text-foreground border border-border'
            }`}
          >
            {opt === 'all' ? 'सभी कमेंट्स' : opt === 'pending' ? 'पेंडिंग अप्रूवल' : 'स्वीकृत कमेंट्स'}
          </button>
        ))}
      </div>

      {/* Table list */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold">
            <thead>
              <tr className="bg-accent/40 border-b border-border text-[10px] font-bold text-muted uppercase tracking-wider">
                <th className="p-4 pl-6">लेखक (Author)</th>
                <th className="p-4">कमेंट सामग्री (Content)</th>
                <th className="p-4">लेख (Article)</th>
                <th className="p-4">दिनांक</th>
                <th className="p-4">स्थिति</th>
                <th className="p-4 pr-6 text-right">कार्रवाई (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredComments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    कोई कमेंट नहीं मिला।
                  </td>
                </tr>
              ) : (
                filteredComments.map((com) => (
                  <tr key={com._id} className="hover:bg-accent/15 transition-colors">
                    <td className="p-4 pl-6 space-y-0.5">
                      <div className="font-bold text-foreground">{com.name}</div>
                      <div className="text-[10px] text-muted">{com.email}</div>
                    </td>
                    <td className="p-4 text-foreground/90 max-w-xs truncate" title={com.content}>
                      &quot;{com.content}&quot;
                    </td>
                    <td className="p-4 text-primary max-w-xs truncate">
                      {com.articleId ? (
                        <Link href={`/news/${com.articleId.slug}`} target="_blank" className="hover:underline">
                          {com.articleId.title}
                        </Link>
                      ) : (
                        <span className="text-muted italic">हटाया गया लेख</span>
                      )}
                    </td>
                    <td className="p-4 text-muted">
                      {new Date(com.createdAt).toLocaleDateString('hi-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      {com.approved ? (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full">स्वीकृत</span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full">पेंडिंग</span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1.5 flex justify-end items-center h-full">
                      {com.articleId && (
                        <Link
                          href={`/news/${com.articleId.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-border bg-accent/40 text-muted hover:text-primary transition-colors cursor-pointer"
                          title="लेख पर देखें"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      {!com.approved && (
                        <button
                          onClick={() => handleApprove(com._id)}
                          className="p-1.5 rounded-lg border border-border bg-accent/40 text-muted hover:text-emerald-500 transition-colors cursor-pointer"
                          title="कमेंट स्वीकार करें"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(com._id)}
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
