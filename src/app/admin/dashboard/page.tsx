import Link from 'next/link';
import { FileText, Eye, Users, MessageSquare, Plus, ArrowRight, ArrowUpRight } from 'lucide-react';
import { articleService } from '@/services/articleService';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardOverview() {
  // Fetch stats and recent activities from the Article Service
  const {
    totalArticles,
    draftArticles,
    publishedArticles,
    totalViews,
    totalSubscribers,
    totalComments,
    pendingComments,
    recentArticles,
    recentComments,
  } = await articleService.getAdminDashboardStats();

  const stats = [
    { name: 'कुल आर्टिकल्स', value: totalArticles, subText: `${publishedArticles} लाइव, ${draftArticles} ड्राफ्ट`, icon: FileText, color: 'text-primary' },
    { name: 'कुल व्यूज (Traffic)', value: totalViews.toLocaleString('hi-IN'), subText: 'सभी लाइव लेखों का ट्रैफ़िक', icon: Eye, color: 'text-blue-500' },
    { name: 'सब्सक्राइबर्स', value: totalSubscribers, subText: 'न्यूज़लेटर रीडर्स', icon: Users, color: 'text-emerald-500' },
    { name: 'कमेंट्स मॉडरेशन', value: totalComments, subText: `${pendingComments} पेंडिंग अप्रूवल`, icon: MessageSquare, color: 'text-violet-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground">डैशबोर्ड ओवरव्यू</h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">अपने समाचार पोर्टल की वर्तमान स्थिति और ट्रैफ़िक की निगरानी करें।</p>
        </div>
        <Link
          href="/admin/dashboard/articles/new"
          className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-primary/10 self-start cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>नया आर्टिकल लिखें</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-sm hover-lift transition-colors relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">{stat.name}</span>
                  <div className="text-xl md:text-2xl font-black text-foreground">{stat.value}</div>
                  <span className="text-[10px] text-muted-foreground font-bold block">{stat.subText}</span>
                </div>
                <div className={`p-3 rounded-xl bg-accent ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main activities layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Recent Articles */}
        <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-sm transition-colors space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm md:text-base font-bold flex items-center space-x-2 text-foreground">
              <FileText className="w-4 h-4 text-primary" />
              <span>ताज़ा लिखे गए आर्टिकल्स</span>
            </h3>
            <Link
              href="/admin/dashboard/articles"
              className="text-xs font-bold text-primary flex items-center space-x-0.5 hover:underline"
            >
              <span>सूची देखें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {recentArticles.length === 0 ? (
              <p className="text-xs text-muted py-4">कोई लेख नहीं मिला।</p>
            ) : (
              recentArticles.map((art: any) => (
                <div key={art._id} className="py-3 flex justify-between items-center group">
                  <div className="space-y-1 pr-4">
                    <h4 className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {art.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-[10px] font-semibold text-muted">
                      <span>{art.category?.name || 'Uncategorized'}</span>
                      <span>•</span>
                      <span>{art.views} व्यूज</span>
                      <span>•</span>
                      {art.isDraft ? (
                        <span className="text-amber-500 bg-amber-500/10 px-1.5 py-0.25 rounded text-[9px] font-bold">ड्राफ्ट</span>
                      ) : (
                        <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.25 rounded text-[9px] font-bold">लाइव</span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/news/${art.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg hover:bg-accent text-muted hover:text-primary transition-colors flex-shrink-0"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Comments */}
        <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-sm transition-colors space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm md:text-base font-bold flex items-center space-x-2 text-foreground">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>ताज़ा कमेंट्स (मॉडरेशन)</span>
            </h3>
            <Link
              href="/admin/dashboard/comments"
              className="text-xs font-bold text-primary flex items-center space-x-0.5 hover:underline"
            >
              <span>मॉडरेशन खोलें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {recentComments.length === 0 ? (
              <p className="text-xs text-muted py-4">कोई कमेंट नहीं मिला।</p>
            ) : (
              recentComments.map((com: any) => (
                <div key={com._id} className="py-3.5 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-muted font-bold">
                    <span>{com.name} ({com.email})</span>
                    {com.approved ? (
                      <span className="text-emerald-500"><b>स्वीकृत</b></span>
                    ) : (
                      <span className="text-amber-500"><b>पेंडिंग</b></span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/80 line-clamp-1 italic">
                    &quot;{com.content}&quot;
                  </p>
                  <div className="text-[9px] text-muted-foreground font-semibold line-clamp-1">
                    लेख: {com.articleId?.title || 'Deleted Article'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
