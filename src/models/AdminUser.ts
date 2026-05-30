import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminUser extends Document {
  username: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt: Date;
}

const AdminUserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
