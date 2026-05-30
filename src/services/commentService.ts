import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export const commentService = {
  /**
   * Get approved comments for an article by articleId
   */
  async getCommentsForArticle(articleId: string) {
    await dbConnect();
    const comments = await Comment.find({
      articleId,
      approved: true,
    }).sort({ createdAt: -1 });

    return serialize(comments);
  },

  /**
   * Submit a new reader comment by articleId
   */
  async createComment(data: { articleId: string; name: string; email: string; content: string }) {
    await dbConnect();
    const comment = await Comment.create({
      articleId: data.articleId,
      name: data.name,
      email: data.email,
      content: data.content,
      approved: false, // Under moderation
    });

    return serialize(comment);
  },

  /**
   * Admin moderation methods
   */
  async getAllCommentsAdmin() {
    await dbConnect();
    // Populate the article title for ease of moderation
    const comments = await Comment.find({})
      .populate('articleId', 'title slug')
      .sort({ createdAt: -1 });
    return serialize(comments);
  },

  async approveComment(id: string) {
    await dbConnect();
    const comment = await Comment.findByIdAndUpdate(id, { approved: true }, { new: true });
    return comment ? serialize(comment) : null;
  },

  async deleteComment(id: string) {
    await dbConnect();
    const result = await Comment.findByIdAndDelete(id);
    return !!result;
  },
};
