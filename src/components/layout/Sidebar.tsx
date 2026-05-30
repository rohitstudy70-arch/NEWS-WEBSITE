'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, TrendingUp, Tag, MailCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TrendingArticle {
  title: string;
  slug: string;
  views: number;
}

interface SidebarProps {
  trendingArticles: TrendingArticle[];
}

const defaultTags = ['AI', 'ChatGPT', 'Gadgets', 'CyberSecurity', 'NextJS', 'TechNews', 'HowTo', 'Mobile'];

export default function Sidebar({ trendingArticles }: SidebarProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setSubscribed(true);
        setEmail('');
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
      } else {
        setMessage(data.error || 'कुछ गलत हुआ। कृपया दोबारा प्रयास करें।');
      }
    } catch {
      setMessage('सर्वर से जुड़ने में समस्या हुई।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="space-y-8">
      {/* Newsletter Block */}
      <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm transition-colors relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        
        <h3 className="text-base font-bold flex items-center space-x-2 text-foreground mb-3">
          <MailCheck className="w-5 h-5 text-primary" />
          <span>न्यूज़लेटर सब्सक्राइब करें</span>
        </h3>
        <p className="text-xs text-muted leading-relaxed mb-4">
          नवीनतम आर्टिफिशियल इंटेलिजेंस (AI) और तकनीकी अपडेट सीधे अपने इनबॉक्स में प्राप्त करने के लिए हमारे न्यूज़लेटर की सदस्यता लें।
        </p>

        {subscribed ? (
          <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold p-3 rounded-lg text-center animate-pulse-slow">
            {message} 🎉
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              placeholder="अपना ईमेल दर्ज करें..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-accent text-foreground text-xs font-medium rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer"
            >
              <span>{loading ? 'सबमिट किया जा रहा है...' : 'सब्सक्राइब करें'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
            {message && <p className="text-[10px] text-red-500 font-semibold mt-1">{message}</p>}
          </form>
        )}
      </div>

      {/* Trending News Block */}
      {trendingArticles && trendingArticles.length > 0 && (
        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm transition-colors">
          <h3 className="text-base font-bold flex items-center space-x-2 text-foreground mb-4 border-b border-border pb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>ट्रेंडिंग ख़बरें (Trending)</span>
          </h3>
          <ul className="space-y-4">
            {trendingArticles.map((article, index) => (
              <li key={article.slug} className="flex space-x-3 items-start group">
                <span className="font-display font-extrabold text-2xl text-primary/20 group-hover:text-primary transition-colors leading-none">
                  0{index + 1}
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    <Link href={`/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h4>
                  <span className="text-[10px] font-semibold text-muted">
                    {article.views?.toLocaleString('hi-IN') || 0} व्यूज
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popular Topics */}
      <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm transition-colors">
        <h3 className="text-base font-bold flex items-center space-x-2 text-foreground mb-4 border-b border-border pb-3">
          <Tag className="w-5 h-5 text-primary" />
          <span>लोकप्रिय टॉपिक्स</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {defaultTags.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${tag}`}
              className="bg-accent hover:bg-primary hover:text-white text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-lg border border-border/80 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
