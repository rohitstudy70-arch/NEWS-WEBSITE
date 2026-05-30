import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFAQ {
  question: string;
  answer: string;
}

export interface IArticle extends Document {
  title: string;
  slug: string;
  content: string;
  summary: string;
  featuredImage: string;
  category: Types.ObjectId;
  isFeatured: boolean;
  isDraft: boolean;
  publishedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
  keywords: string[];
  views: number;
  readingTime: number;
  faqs: IFAQ[];
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const ArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    featuredImage: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    isFeatured: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    seoTitle: { type: String },
    seoDescription: { type: String },
    keywords: [{ type: String }],
    views: { type: Number, default: 0 },
    readingTime: { type: Number, default: 3 },
    faqs: [FAQSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
