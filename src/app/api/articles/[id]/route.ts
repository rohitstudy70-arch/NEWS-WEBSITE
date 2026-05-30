import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { articleService } from '@/services/articleService';
import dbConnect from '@/lib/db';
import Article from '@/models/Article'; // Needed for direct mongoose update methods in API responses

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
    const success = await articleService.deleteArticle(id);
    if (!success) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
