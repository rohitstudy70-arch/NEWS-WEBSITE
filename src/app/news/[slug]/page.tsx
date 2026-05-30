import Sidebar from '@/components/layout/Sidebar';
import ShareButtons from '@/components/features/ShareButtons';
import FAQSection from '@/components/features/FAQSection';
import CommentSection from '@/components/features/CommentSection';
import ArticleCard from '@/components/features/ArticleCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Eye, ChevronLeft } from 'lucide-react';
import { articleService } from '@/services/articleService';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await articleService.getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.summary.slice(0, 160),
    keywords: article.keywords,
    alternates: {
      canonical: `/news/${article.slug}`,
    },
    openGraph: {
      type: 'article',
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      url: `/news/${article.slug}`,
      images: [
        {
          url: article.featuredImage,
          alt: article.title,
        },
      ],
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      images: [article.featuredImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Retrieve the article and increment views
  const article = await articleService.getArticleBySlug(slug, true);
  if (!article) {
    notFound();
  }

  // Related articles (same category, exclude current)
  const relatedArticles = await articleService.getRelatedArticles(
    article.category?.slug || '',
    article.slug,
    3
  );

  // Trending articles for sidebar
  const trendingArticles = await articleService.getTrendingArticles(5);

  const articleUrl = `http://localhost:3000/news/${article.slug}`;

  // Article JSON-LD Schema markup for Google
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'image': [article.featuredImage],
    'datePublished': article.publishedAt,
    'dateModified': article.updatedAt || article.publishedAt,
    'author': [
      {
        '@type': 'Person',
        'name': 'टेक ख़बर एडिटर',
        'url': 'http://localhost:3000/about',
      },
    ],
    'publisher': {
      '@type': 'Organization',
      'name': 'Tech Khabar',
      'logo': {
        '@type': 'ImageObject',
        'url': 'http://localhost:3000/logo.png',
      },
    },
    'description': article.summary,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs font-bold text-muted hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>मुख्य पृष्ठ पर लौटें</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Article Block (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <article className="bg-card text-card-foreground border border-border p-5 md:p-8 rounded-3xl transition-colors shadow-sm">
            {/* Header info */}
            <div className="space-y-4">
              <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block">
                {article.category?.name || 'समाचार'}
              </span>

              <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-foreground leading-snug">
                {article.title}
              </h1>

              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium italic border-l-2 border-primary/40 pl-3">
                {article.summary}
              </p>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-4 text-[10px] md:text-xs text-muted font-semibold pt-2 border-t border-border/80">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('hi-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{article.readingTime || 3} मिनट रीड</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  <span>{article.views?.toLocaleString('hi-IN') || 1} व्यूज</span>
                </span>
                <span className="ml-auto text-primary font-bold">द्वारा: टेक ख़बर एडिटर</span>
              </div>
            </div>

            {/* Social Share (Top) */}
            <ShareButtons title={article.title} url={articleUrl} />

            {/* Featured Image */}
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-accent mb-6">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div
              className="prose text-foreground/95 dark:prose-invert max-w-none text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Social Share (Bottom) */}
            <div className="border-t border-border mt-8 pt-4">
              <ShareButtons title={article.title} url={articleUrl} />
            </div>
          </article>

          {/* FAQ Section */}
          <FAQSection faqs={article.faqs} />

          {/* Comment Section */}
          <CommentSection articleId={article._id.toString()} />

          {/* Related Articles Block */}
          {relatedArticles.length > 0 && (
            <div className="space-y-6 pt-6">
              <h3 className="text-base md:text-lg font-bold border-b border-border pb-3 text-foreground">
                सम्बंधित लेख (Related Articles)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relArticle: any) => (
                  <ArticleCard key={relArticle.slug} article={relArticle} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Sidebar trendingArticles={trendingArticles} />
        </div>
      </div>
    </div>
  );
}
