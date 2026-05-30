import dbConnect from '@/lib/db';
import Article from '@/models/Article';
import Category from '@/models/Category';
import Subscriber from '@/models/Subscriber';
import Comment from '@/models/Comment';

// Helper to deep serialize Mongoose docs into plain JSON objects
function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export const articleService = {
  /**
   * Get latest articles for news ticker
   */
  async getLatestArticles(limit = 5) {
    await dbConnect();
    const articles = await Article.find({ isDraft: false, publishedAt: { $lte: new Date() } })
      .select('title slug')
      .sort({ publishedAt: -1 })
      .limit(limit);
    return serialize(articles);
  },

  /**
   * Get featured articles for homepage hero section
   */
  async getFeaturedArticles(limit = 5) {
    await dbConnect();
    let articles = await Article.find({
      isFeatured: true,
      isDraft: false,
      publishedAt: { $lte: new Date() },
    })
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .limit(limit);

    if (articles.length === 0) {
      articles = await Article.find({ isDraft: false, publishedAt: { $lte: new Date() } })
        .populate('category', 'name slug')
        .sort({ publishedAt: -1 })
        .limit(limit);
    }
    return serialize(articles);
  },

  /**
   * Get trending articles by view count
   */
  async getTrendingArticles(limit = 5) {
    await dbConnect();
    const articles = await Article.find({
      isDraft: false,
      publishedAt: { $lte: new Date() },
    })
      .select('title slug views')
      .sort({ views: -1 })
      .limit(limit);
    return serialize(articles);
  },

  /**
   * Get articles grouped by active categories that contain articles
   */
  async getCategoriesWithArticles(limitPerCategory = 4) {
    await dbConnect();
    const categories = await Category.find({});
    const categoriesWithArticles = [];

    for (const cat of categories) {
      const articles = await Article.find({
        isDraft: false,
        category: cat._id,
        publishedAt: { $lte: new Date() },
      })
        .populate('category', 'name slug')
        .sort({ publishedAt: -1 })
        .limit(limitPerCategory);

      if (articles.length > 0) {
        categoriesWithArticles.push({
          category: cat,
          articles,
        });
      }
    }
    return serialize(categoriesWithArticles);
  },

  /**
   * Get paginated articles list for a category
   */
  async getArticlesByCategory(categorySlug: string, page = 1, limit = 6) {
    await dbConnect();
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) return null;

    const query = {
      category: category._id,
      isDraft: false,
      publishedAt: { $lte: new Date() },
    };

    const skip = (page - 1) * limit;
    const articles = await Article.find(query)
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / limit);

    return {
      category: serialize(category),
      articles: serialize(articles),
      totalArticles,
      totalPages,
    };
  },

  /**
   * Search articles with keyword index matching (paginated)
   */
  async searchArticles(searchQuery: string, page = 1, limit = 6) {
    await dbConnect();
    if (!searchQuery) {
      return { articles: [], totalArticles: 0, totalPages: 0 };
    }

    const query = {
      isDraft: false,
      publishedAt: { $lte: new Date() },
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { summary: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } },
        { keywords: { $regex: searchQuery, $options: 'i' } },
      ],
    };

    const skip = (page - 1) * limit;
    const articles = await Article.find(query)
      .populate('category', 'name slug')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / limit);

    return {
      articles: serialize(articles),
      totalArticles,
      totalPages,
    };
  },

  /**
   * Get single article details by slug and increment views
   */
  async getArticleBySlug(slug: string, incrementViews = false) {
    await dbConnect();
    const article = await Article.findOne({ slug }).populate('category', 'name slug');
    if (!article) return null;

    if (incrementViews) {
      article.views = (article.views || 0) + 1;
      await article.save();
    }

    return serialize(article);
  },

  /**
   * Get related articles by category slug, excluding current article slug
   */
  async getRelatedArticles(categorySlug: string, excludeSlug: string, limit = 3) {
    await dbConnect();
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) return [];

    const articles = await Article.find({
      category: category._id,
      slug: { $ne: excludeSlug },
      isDraft: false,
      publishedAt: { $lte: new Date() },
    })
      .select('title slug featuredImage publishedAt')
      .sort({ publishedAt: -1 })
      .limit(limit);

    return serialize(articles);
  },

  /**
   * ADMIN CRUD operations
   */
  async getAdminArticlesList() {
    await dbConnect();
    const articles = await Article.find({})
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    return serialize(articles);
  },

  async getArticleById(id: string) {
    await dbConnect();
    const article = await Article.findById(id);
    return article ? serialize(article) : null;
  },

  async createArticle(data: any) {
    await dbConnect();
    const article = await Article.create(data);
    return serialize(article);
  },

  async updateArticle(id: string, data: any) {
    await dbConnect();
    const article = await Article.findByIdAndUpdate(id, data, { new: true });
    return article ? serialize(article) : null;
  },

  async deleteArticle(id: string) {
    await dbConnect();
    const result = await Article.findByIdAndDelete(id);
    return !!result;
  },

  /**
   * Get aggregated stats and recent items for Admin Overview
   */
  async getAdminDashboardStats() {
    await dbConnect();
    
    const totalArticles = await Article.countDocuments({});
    const draftArticles = await Article.countDocuments({ isDraft: true });
    const publishedArticles = totalArticles - draftArticles;

    const viewsAggregation = await Article.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);
    const totalViews = viewsAggregation[0]?.totalViews || 0;

    const totalSubscribers = await Subscriber.countDocuments({});
    const totalComments = await Comment.countDocuments({});
    const pendingComments = await Comment.countDocuments({ approved: false });

    const recentArticles = await Article.find({})
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentComments = await Comment.find({})
      .populate('articleId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(5);

    return serialize({
      totalArticles,
      draftArticles,
      publishedArticles,
      totalViews,
      totalSubscribers,
      totalComments,
      pendingComments,
      recentArticles,
      recentComments,
    });
  },
};
