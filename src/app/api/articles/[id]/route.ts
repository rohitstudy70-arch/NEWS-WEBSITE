import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { articleService } from '@/services/articleService';
import dbConnect from '@/lib/db';
import Article from '@/models/Article'; // Needed for direct mongoose update methods in API responses
import { revalidatePath } from 'next/cache';

function calculateReadingTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  const wpm = 200;
  return Math.max(1, Math.ceil(words / wpm));
}

function makeSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const isSlug = searchParams.get('slug') === 'true';
    const incView = searchParams.get('inc') === 'true';

    let article;
    if (isSlug) {
      article = await articleService.getArticleBySlug(id, incView);
    } else {
      article = await articleService.getArticleById(id);
    }

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      title,
      slug,
      content,
      summary,
      featuredImage,
      category,
      isFeatured,
      isDraft,
      publishedAt,
      seoTitle,
      seoDescription,
      keywords,
      faqs,
    } = body;

    await dbConnect();
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    let articleSlug = article.slug;
    if (slug && slug !== article.slug) {
      articleSlug = makeSlug(slug);
      const existing = await Article.findOne({ slug: articleSlug, _id: { $ne: id } });
      if (existing) {
        articleSlug = `${articleSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const readingTime = content ? calculateReadingTime(content) : article.readingTime;

    const updatedData = {
      title: title || article.title,
      slug: articleSlug,
      content: content || article.content,
      summary: summary || article.summary,
      featuredImage: featuredImage || article.featuredImage,
      category: category || article.category,
      isFeatured: isFeatured !== undefined ? !!isFeatured : article.isFeatured,
      isDraft: isDraft !== undefined ? !!isDraft : article.isDraft,
      publishedAt: publishedAt ? new Date(publishedAt) : article.publishedAt,
      seoTitle: seoTitle || article.seoTitle,
      seoDescription: seoDescription || article.seoDescription,
      keywords: keywords || article.keywords,
      readingTime,
      faqs: faqs || article.faqs,
    };

    const updatedArticle = await Article.findByIdAndUpdate(id, updatedData, { new: true })
      .populate('category', 'name slug');

    // Clear Next.js cache so the updated article changes are visible instantly
    try {
      revalidatePath('/');
      revalidatePath('/search');
      if (updatedArticle.category?.slug) {
        revalidatePath(`/category/${updatedArticle.category.slug}`);
      }
      revalidatePath(`/news/${updatedArticle.slug}`);
      // Also revalidate the old slug if it was changed
      if (article.slug !== updatedArticle.slug) {
        revalidatePath(`/news/${article.slug}`);
      }
      console.log('Revalidation triggered for article update.');
    } catch (e) {
      console.error('Revalidation error during article PUT:', e);
    }

    return NextResponse.json(JSON.parse(JSON.stringify(updatedArticle)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch slug and category before deleting for cache clearing
    await dbConnect();
    const article = await Article.findById(id).populate('category', 'slug');
    let articleSlug = '';
    let categorySlug = '';
    if (article) {
      articleSlug = article.slug;
      categorySlug = article.category?.slug;
    }

    const success = await articleService.deleteArticle(id);
    if (!success) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Clear Next.js cache so deletion is visible instantly
    try {
      revalidatePath('/');
      revalidatePath('/search');
      if (categorySlug) {
        revalidatePath(`/category/${categorySlug}`);
      }
      if (articleSlug) {
        revalidatePath(`/news/${articleSlug}`);
      }
      console.log('Revalidation triggered for article deletion.');
    } catch (e) {
      console.error('Revalidation error during article DELETE:', e);
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
