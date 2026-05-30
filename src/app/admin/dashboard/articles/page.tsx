import AdminArticlesList from '@/components/admin/AdminArticlesList';
import { articleService } from '@/services/articleService';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const articles = await articleService.getAdminArticlesList();

  const serializedArticles = articles.map((art: any) => ({
    _id: art._id,
    title: art.title,
    slug: art.slug,
    isDraft: art.isDraft,
    views: art.views,
    publishedAt: art.publishedAt,
    category: {
      name: art.category?.name || 'Uncategorized',
    },
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-foreground">लेख प्रबंधित करें</h1>
        <p className="text-xs text-muted-foreground font-semibold mt-1">अपने समाचार पोर्टल के सभी लेख संपादित करें, ड्राफ्ट करें या डिलीट करें।</p>
      </div>
      <AdminArticlesList initialArticles={serializedArticles} />
    </div>
  );
}
