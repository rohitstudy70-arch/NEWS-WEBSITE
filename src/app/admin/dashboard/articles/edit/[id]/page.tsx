import AdminArticleForm from '@/components/admin/AdminArticleForm';
import { articleService } from '@/services/articleService';
import { categoryService } from '@/services/categoryService';
import { notFound } from 'next/navigation';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;

  const article = await articleService.getArticleById(id);
  if (!article) {
    notFound();
  }

  const categories = await categoryService.getAllCategories();

  const serializedCategories = categories.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
  }));

  const serializedArticle = {
    _id: article._id.toString(),
    title: article.title,
    slug: article.slug,
    content: article.content,
    summary: article.summary,
    featuredImage: article.featuredImage,
    category: article.category.toString(),
    isFeatured: article.isFeatured,
    isDraft: article.isDraft,
    publishedAt: article.publishedAt,
    seoTitle: article.seoTitle || '',
    seoDescription: article.seoDescription || '',
    keywords: article.keywords || [],
    faqs: article.faqs.map((faq: any) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-foreground">लेख संपादित करें</h1>
        <p className="text-xs text-muted-foreground font-semibold mt-1">अपने पहले से लिखे गए लेख में आवश्यक सुधार करें।</p>
      </div>
      <AdminArticleForm categories={serializedCategories} initialData={serializedArticle} />
    </div>
  );
}
