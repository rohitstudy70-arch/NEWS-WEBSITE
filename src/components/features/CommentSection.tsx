'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface CommentItem {
  _id: string;
  name: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?articleId=${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (e) {
      console.error('Error fetching comments:', e);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !content) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, name, email, content }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setContent('');
        setMessage('आपका कमेंट सफलतापूर्वक सबमिट कर दिया गया है। एडमिन की स्वीकृति के बाद यह यहाँ दिखाई देगा।');
        // Refresh list just in case moderation was bypassed
        fetchComments();
      } else {
        const data = await res.json();
        setMessage(data.error || 'कमेंट सबमिट करने में कोई समस्या हुई।');
      }
    } catch {
      setMessage('सर्वर से जुड़ने में समस्या हुई।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-sm transition-colors mt-12">
      <h3 className="text-base md:text-lg font-bold flex items-center space-x-2 text-foreground mb-6 pb-3 border-b border-border">
        <MessageSquare className="w-5 h-5 text-primary" />
        <span>प्रतिक्रियाएं ({comments.length})</span>
      </h3>

      {/* Existing Comments */}
      {comments.length === 0 ? (
        <p className="text-xs text-muted mb-6">इस लेख पर अभी तक कोई कमेंट नहीं है। पहला कमेंट आप करें!</p>
      ) : (
        <div className="space-y-4 mb-8 max-h-96 overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-accent/40 border border-border p-4 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-[10px] md:text-xs text-muted font-semibold">
                <span className="text-foreground font-bold">{comment.name}</span>
                <span>
                  {new Date(comment.createdAt).toLocaleDateString('hi-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-xs md:text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Post a Comment Form */}
      <h4 className="text-sm md:text-base font-bold text-foreground mb-4">अपनी प्रतिक्रिया दर्ज करें</h4>
      {submitted ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl text-xs flex items-start space-x-2.5">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold leading-relaxed">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="comment-name" className="block text-[11px] font-bold text-muted mb-1.5 uppercase tracking-wide">आपका नाम</label>
              <input
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="comment-email" className="block text-[11px] font-bold text-muted mb-1.5 uppercase tracking-wide">आपका ईमेल</label>
              <input
                id="comment-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label htmlFor="comment-content" className="block text-[11px] font-bold text-muted mb-1.5 uppercase tracking-wide">कमेंट सामग्री</label>
            <textarea
              id="comment-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer"
          >
            <span>{loading ? 'भेजा जा रहा है...' : 'कमेंट पोस्ट करें'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
          {message && !submitted && (
            <p className="text-xs text-red-500 font-semibold mt-1">{message}</p>
          )}
        </form>
      )}
    </section>
  );
}
