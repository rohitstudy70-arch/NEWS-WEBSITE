import React from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';

interface CategoryInfo {
  name: string;
  slug: string;
}

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    featuredImage: string;
    category: CategoryInfo;
    publishedAt: string | Date;
    readingTime: number;
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const publishDate = new Date(article.publishedAt).toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="bg-card text-card-foreground rounded-2xl overflow-hidden border border-border hover-lift flex flex-col h-full shadow-sm group transition-colors">
      {/* Image Container */}
      <Link href={`/news/${article.slug}`} className="block relative aspect-video overflow-hidden bg-accent">
        <img
          src={article.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Badge overlay */}
        <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
          {article.category?.name || 'समाचार'}
        </span>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Date and Reading Time */}
        <div className="flex items-center space-x-4 text-[10px] md:text-[11px] font-semibold text-muted mb-3">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{publishDate}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{article.readingTime || 3} मिनट रीड</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          <Link href={`/news/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
          {article.summary}
        </p>

        {/* Read More button */}
        <div className="mt-auto pt-4 border-t border-border/60">
          <Link
            href={`/news/${article.slug}`}
            className="text-xs font-bold text-primary hover:text-primary/95 flex items-center space-x-1 group-hover:underline"
          >
            <span>पूरा लेख पढ़ें</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
