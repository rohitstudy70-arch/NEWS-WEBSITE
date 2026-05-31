import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { articleService } from '@/services/articleService';
import { categoryService } from '@/services/categoryService';
import dbConnect from '@/lib/db';
import Article from '@/models/Article'; // Needed for direct query builders in routes
import Category from '@/models/Category';
import { revalidatePath } from 'next/cache';

function calculateReadingTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  const wpm = 200;
  return Math.max(1, Math.ceil(words / wpm));
}

function makeSlug(title: string): string {
  // Replace Hindi characters or special characters with clean hyphens for SEO
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';
    const featured = searchParams.get('featured') || '';
    const excludeId = searchParams.get('exclude') || '';
    const isAdminView = searchParams.get('admin') === 'true';

    const skip = (page - 1) * limit;
    const query: any = {};

    if (isAdminView) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      query.isDraft = false;
      query.publishedAt = { $lte: new Date() };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    if (categorySlug) {
      const category = await categoryService.getCategoryBySlug(categorySlug);
      if (category) {
        query.category = category._id;
      } else {
        return NextResponse.json({ articles: [], totalPages: 0, totalArticles: 0 });
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { keywords: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await Article.find(query)
      .populate('category', 'name slug')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / limit);

    return NextResponse.json({
      articles: JSON.parse(JSON.stringify(articles)),
      totalPages,
      totalArticles,
      page,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    if (!title || !content || !summary || !featuredImage || !category) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    let articleSlug = slug ? makeSlug(slug) : makeSlug(title);
    if (!articleSlug) {
      articleSlug = 'news-' + Date.now();
    }

    const existing = await articleService.getArticleBySlug(articleSlug);
    if (existing) {
      articleSlug = `${articleSlug}-${Date.now().toString().slice(-4)}`;
    }

    const readingTime = calculateReadingTime(content);

    const newArticle = await articleService.createArticle({
      title,
      slug: articleSlug,
      content,
      summary,
      featuredImage,
      category,
      isFeatured: !!isFeatured,
      isDraft: isDraft === undefined ? true : !!isDraft,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || summary.slice(0, 160),
      keywords: keywords || [],
      readingTime,
      faqs: faqs || [],
      views: 0,
    });

    // Fetch category slug to revalidate the specific category page
    let catSlug = '';
    try {
      const categoryDoc = await Category.findById(category);
      if (categoryDoc) {
        catSlug = categoryDoc.slug;
      }
    } catch (e) {
      console.error('Failed to get category for revalidation:', e);
    }

    // Clear Next.js cache so the new article is visible instantly
    try {
      revalidatePath('/');
      revalidatePath('/search');
      if (catSlug) {
        revalidatePath(`/category/${catSlug}`);
      }
      revalidatePath(`/news/${articleSlug}`);
      console.log('Revalidation triggered for new article creation.');
    } catch (e) {
      console.error('Revalidation error:', e);
    }

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
