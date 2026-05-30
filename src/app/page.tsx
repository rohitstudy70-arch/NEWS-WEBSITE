import { seedDatabaseIfNeeded } from '@/lib/seeder';
import BreakingNews from '@/components/layout/BreakingNews';
import ArticleCard from '@/components/features/ArticleCard';
import Sidebar from '@/components/layout/Sidebar';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { articleService } from '@/services/articleService';

export const revalidate = 60; // Cache and revalidate page every 60s (Static generation with ISR)

// Helper to get Lucide icon dynamically
const getIconComponent = (iconName: string) => {
  const IconComp = (Icons as any)[iconName];
  return IconComp || Icons.Newspaper;
};

export default async function Home() {
  // Run seeder to import tazakhabare articles if missing
  await seedDatabaseIfNeeded();

  // Fetch data using the Article Service Layer
  const serializedLatest = await articleService.getLatestArticles(5);
  const serializedFeatured = await articleService.getFeaturedArticles(5);
  const serializedTrending = await articleService.getTrendingArticles(5);
  const serializedCategoriesWithArticles = await articleService.getCategoriesWithArticles(4);

  const mainArticle = serializedFeatured[0];
  const sideArticles = serializedFeatured.slice(1, 5);

  return (
    <div className="space-y-8">
      {/* 1. Breaking News Ticker */}
      <BreakingNews articles={serializedLatest} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* 2. Hero Section Grid */}
        {mainArticle && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Featured Big Card (2/3 width on desktop) */}
            <div className="lg:col-span-2 relative aspect-video rounded-3xl overflow-hidden border border-border/80 shadow-md group">
              <img
                src={mainArticle.featuredImage}
                alt={mainArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                <span className="bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-3 self-start shadow-md">
                  {mainArticle.category?.name || 'समाचार'}
                </span>
                <h2 className="text-xl md:text-3xl font-bold text-white mb-2 leading-snug group-hover:text-red-300 transition-colors">
                  <Link href={`/news/${mainArticle.slug}`}>{mainArticle.title}</Link>
                </h2>
                <p className="text-zinc-300 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4 max-w-2xl font-light">
                  {mainArticle.summary}
                </p>
                <div className="flex items-center text-[10px] md:text-xs text-zinc-400 font-semibold space-x-3">
                  <span>{new Date(mainArticle.publishedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>{mainArticle.readingTime || 3} मिनट रीड</span>
                </div>
              </div>
            </div>

            {/* Side featured cards stack (1/3 width on desktop) */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted border-l-2 border-primary pl-2 mb-1">
                विशेष लेख (Featured)
              </h3>
              {sideArticles.map((article: any) => (
                <div
                  key={article.slug}
                  className="flex space-x-3 bg-card text-card-foreground p-3 rounded-2xl border border-border shadow-sm group hover-lift transition-colors"
                >
                  <Link href={`/news/${article.slug}`} className="block relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-accent">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="flex flex-col justify-between flex-grow">
                    <span className="text-[9px] font-bold text-primary tracking-wide uppercase">
                      {article.category?.name}
                    </span>
                    <h4 className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      <Link href={`/news/${article.slug}`}>{article.title}</Link>
                    </h4>
                    <span className="text-[10px] text-muted font-semibold">
                      {new Date(article.publishedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Main Body: News Categories & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (2 Columns) */}
          <div className="lg:col-span-2 space-y-12">
            {/* Dynamic Categories Sections */}
            {serializedCategoriesWithArticles.map(({ category, articles }: any) => {
              const IconComponent = getIconComponent(category.icon || 'Newspaper');
              return (
                <section key={category._id.toString()} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="text-lg md:text-xl font-bold flex items-center space-x-2 text-foreground">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <span>{category.name}</span>
                    </h3>
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-xs font-bold text-primary flex items-center space-x-0.5 hover:underline"
                    >
                      <span>सभी देखें</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.map((article: any) => (
                      <ArticleCard key={article.slug} article={article} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Sidebar Section (1 Column) */}
          <div className="space-y-8">
            <Sidebar trendingArticles={serializedTrending} />
          </div>
        </div>
      </div>
    </div>
  );
}
