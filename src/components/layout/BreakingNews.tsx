'use client';

import React from 'react';
import Link from 'next/link';

interface ArticleItem {
  title: string;
  slug: string;
}

interface BreakingNewsProps {
  articles: ArticleItem[];
}

export default function BreakingNews({ articles }: BreakingNewsProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="bg-primary text-white h-10 flex items-center overflow-hidden relative shadow-inner z-10 select-none transition-colors">
      <div className="bg-red-700 dark:bg-rose-950 h-full flex items-center px-4 font-bold text-xs uppercase tracking-wider relative z-20 shadow-md">
        ब्रेकिंग न्यूज़
      </div>
      <div className="flex w-full overflow-hidden relative items-center">
        <div className="flex animate-ticker whitespace-nowrap items-center hover:[animation-play-state:paused] cursor-pointer">
          {[...articles, ...articles].map((article, index) => (
            <Link
              key={`${article.slug}-${index}`}
              href={`/news/${article.slug}`}
              className="mx-8 font-semibold text-xs md:text-sm flex items-center hover:underline transition-colors"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full inline-block mr-2" />
              {article.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
