import AdminArticleForm from '@/components/admin/AdminArticleForm';
import { categoryService } from '@/services/categoryService';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  const categories = await categoryService.getAllCategories();
  
  const serializedCategories = categories.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-foreground">नया लेख लिखें</h1>
        <p className="text-xs text-muted-foreground font-semibold mt-1">अपने पाठकों के लिए एक नया ज्ञानवर्धक लेख तैयार करें।</p>
      </div>
      <AdminArticleForm categories={serializedCategories} />
    </div>
  );
}
