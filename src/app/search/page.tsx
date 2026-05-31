import ArticleCard from '@/components/features/ArticleCard';
import Sidebar from '@/components/layout/Sidebar';
import Link from 'next/link';
import { articleService } from '@/services/articleService';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = (await searchParams).q || '';
  return {
    title: query ? `"${query}" के परिणाम - सर्च - Tech Khabar` : 'सर्च करें - Tech Khabar',
    description: 'Tech Khabar न्यूज़ पोर्टल पर भारत, दुनिया, खेल, मनोरंजन, टेक्नोलॉजी और इंटरनेट से जुड़े लेख सर्च करें।',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const limit = 6;

  const [searchResults, serializedTrending] = await Promise.all([
    articleService.searchArticles(query, page, limit),
    articleService.getTrendingArticles(5)
  ]);

  const { articles, totalArticles, totalPages } = searchResults;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Header */}
      <div className="bg-card text-card-foreground border border-border p-8 rounded-3xl mb-10 transition-colors">
        <span className="text-primary text-xs font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
          सर्च परिणाम (Search Results)
        </span>
        <h1 className="text-xl md:text-3xl font-extrabold text-foreground">
          {query ? `"${query}" के लिए सर्च परिणाम` : 'सर्च कीवर्ड खाली है'}
        </h1>
        <p className="text-xs text-muted mt-2 font-medium">
          कुल {totalArticles} लेख मिले।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Results grid */}
        <div className="lg:col-span-2 space-y-10">
          {!query ? (
            <div className="bg-card text-card-foreground border border-border rounded-2xl p-12 text-center text-muted transition-colors">
              कृपया ऊपर दिए गए सर्च बॉक्स में कुछ टाइप करके सर्च करें।
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-card text-card-foreground border border-border rounded-2xl p-12 text-center text-muted transition-colors">
              खेद है, आपके द्वारा सर्च किए गए कीवर्ड &quot;{query}&quot; के लिए कोई लेख नहीं मिला। कुछ और सर्च करें।
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
                      href={`/search?q=${query}&page=${page - 1}`}
                      className="bg-card hover:bg-primary hover:text-white border border-border px-4 py-2 rounded-xl text-xs font-bold text-foreground transition-all"
                    >
                      &larr; पिछला
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/search?q=${query}&page=${p}`}
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
                      href={`/search?q=${query}&page=${page + 1}`}
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
