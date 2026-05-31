import ArticleCard from '@/components/features/ArticleCard';
import Sidebar from '@/components/layout/Sidebar';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { articleService } from '@/services/articleService';
import { categoryService } from '@/services/categoryService';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await categoryService.getCategoryBySlug(slug);
  if (!category) return { title: 'Category Not Found' };
  return {
    title: `${category.name} - ताज़ा तकनीक और एआई समाचार`,
    description: category.description || `${category.name} श्रेणी की नवीनतम प्रौद्योगिकी समाचार और समीक्षाएं हिन्दी में।`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const limit = 6;

  const [result, serializedTrending] = await Promise.all([
    articleService.getArticlesByCategory(slug, page, limit),
    articleService.getTrendingArticles(5)
  ]);

  if (!result) {
    notFound();
  }

  const { category, articles, totalPages } = result;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category Header */}
      <div className="bg-card text-card-foreground border border-border p-8 rounded-3xl mb-10 relative overflow-hidden transition-colors">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
        <span className="text-primary text-xs font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
          कैटेगरी (Category)
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground mb-3">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {articles.length === 0 ? (
            <div className="bg-card text-card-foreground border border-border rounded-2xl p-12 text-center text-muted transition-colors">
              इस कैटेगरी में अभी तक कोई लेख प्रकाशित नहीं किया गया है।
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article: any) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2 pt-6">
                  {page > 1 && (
                    <Link
                      href={`/category/${slug}?page=${page - 1}`}
                      className="bg-card hover:bg-primary hover:text-white border border-border px-4 py-2 rounded-xl text-xs font-bold text-foreground transition-all"
                    >
                      &larr; पिछला
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/category/${slug}?page=${p}`}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        p === page
                          ? 'bg-primary text-white border-primary'
                          : 'bg-card hover:bg-accent text-foreground border-border'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/category/${slug}?page=${page + 1}`}
                      className="bg-card hover:bg-primary hover:text-white border border-border px-4 py-2 rounded-xl text-xs font-bold text-foreground transition-all"
                    >
                      अगला &rarr;
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Sidebar trendingArticles={serializedTrending} />
        </div>
      </div>
    </div>
  );
}
