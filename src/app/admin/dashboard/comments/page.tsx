import AdminCommentsManager from '@/components/admin/AdminCommentsManager';
import { commentService } from '@/services/commentService';

export const dynamic = 'force-dynamic';

export default async function AdminCommentsPage() {
  const comments = await commentService.getAllCommentsAdmin();
  
  const serializedComments = comments.map((com: any) => ({
    _id: com._id.toString(),
    name: com.name,
    email: com.email,
    content: com.content,
    approved: com.approved,
    createdAt: com.createdAt,
    articleId: com.articleId
      ? {
          title: com.articleId.title,
          slug: com.articleId.slug,
        }
      : undefined,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-foreground">कमेंट्स मॉडरेशन</h1>
        <p className="text-xs text-muted-foreground font-semibold mt-1">अपने समाचार पोर्टल पर पाठकों द्वारा लिखे गए कमेंट्स स्वीकृत करें या हटाएं।</p>
      </div>
      <AdminCommentsManager initialComments={serializedComments} />
    </div>
  );
}
