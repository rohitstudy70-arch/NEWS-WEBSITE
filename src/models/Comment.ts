import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  articleId: Types.ObjectId;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  content: { type: String, required: true, trim: true },
  approved: { type: Boolean, default: false }, // Moderation queue
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
