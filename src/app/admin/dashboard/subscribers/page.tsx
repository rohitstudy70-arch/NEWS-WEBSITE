import dbConnect from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { Mail, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSubscribersPage() {
  await dbConnect();
  
  const subscribers = await Subscriber.find({}).sort({ subscribedAt: -1 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-foreground font-display">न्यूज़लेटर सब्सक्राइबर्स</h1>
        <p className="text-xs text-muted-foreground font-semibold mt-1">पोर्टल के साप्ताहिक समाचार बुलेटिन की सदस्यता लेने वाले पाठकों की सूची।</p>
      </div>

      <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
          <Mail className="w-4 h-4 text-primary" />
          <span>कुल सब्सक्राइबर्स ({subscribers.length})</span>
        </h3>

        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-xs font-semibold">
            <thead>
              <tr className="bg-accent/40 border-b border-border text-[10px] font-bold text-muted uppercase tracking-wider">
                <th className="p-3 pl-4">क्र.सं. (S.No.)</th>
                <th className="p-3">ईमेल एड्रेस</th>
                <th className="p-3 pr-4">सब्सक्रिप्शन दिनांक</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-muted">
                    अभी तक किसी पाठक ने सदस्यता नहीं ली है।
                  </td>
                </tr>
              ) : (
                subscribers.map((sub, index) => (
                  <tr key={sub._id.toString()} className="hover:bg-accent/15 transition-colors">
                    <td className="p-3 pl-4 text-muted">{index + 1}</td>
                    <td className="p-3 text-foreground font-bold">{sub.email}</td>
                    <td className="p-3 pr-4 text-muted flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>
                        {new Date(sub.subscribedAt).toLocaleString('hi-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
