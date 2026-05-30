import AdminCategoriesManager from '@/components/admin/AdminCategoriesManager';
import { categoryService } from '@/services/categoryService';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await categoryService.getAllCategories();

  const serializedCategories = categories.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    icon: cat.icon || 'Cpu',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-foreground">कैटेगरी प्रबंधित करें</h1>
        <p className="text-xs text-muted-foreground font-semibold mt-1">पोर्टल पर प्रदर्शित होने वाली समाचार श्रेणियों का प्रबंधन करें।</p>
      </div>
      <AdminCategoriesManager initialCategories={serializedCategories} />
    </div>
  );
}
