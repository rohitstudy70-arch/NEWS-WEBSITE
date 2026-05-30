import dbConnect from '@/lib/db';
import Category from '@/models/Category';

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export const categoryService = {
  async getAllCategories() {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 });
    return serialize(categories);
  },

  async getCategoryBySlug(slug: string) {
    await dbConnect();
    const category = await Category.findOne({ slug });
    return category ? serialize(category) : null;
  },

  async createCategory(data: any) {
    await dbConnect();
    const category = await Category.create(data);
    return serialize(category);
  },

  async updateCategory(id: string, data: any) {
    await dbConnect();
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    return category ? serialize(category) : null;
  },

  async deleteCategory(id: string) {
    await dbConnect();
    const result = await Category.findByIdAndDelete(id);
    return !!result;
  },
};
