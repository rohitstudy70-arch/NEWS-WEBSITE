import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://localhost:3000'; // Customize for production host

  try {
    await dbConnect();

    // 1. Fetch published articles
    const articles = await Article.find({ isDraft: false, publishedAt: { $lte: new Date() } })
      .select('slug updatedAt');
    
    const articleUrls = articles.map((art) => ({
      url: `${baseUrl}/news/${art.slug}`,
      lastModified: art.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // 2. Fetch categories
    const categories = await Category.find({}).select('slug');
    const categoryUrls = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    // 3. Define static pages
    const staticPages = ['', '/about', '/contact', '/privacy-policy', '/terms'].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1.0 : 0.5,
    }));

    return [...staticPages, ...categoryUrls, ...articleUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ];
  }
}
