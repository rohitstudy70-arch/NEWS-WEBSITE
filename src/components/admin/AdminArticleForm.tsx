'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload, Plus, Trash2, ArrowLeft, CheckCircle } from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ArticleFormProps {
  categories: CategoryItem[];
  initialData?: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    summary: string;
    featuredImage: string;
    category: string;
    isFeatured: boolean;
    isDraft: boolean;
    publishedAt: string;
    seoTitle?: string;
    seoDescription?: string;
    keywords: string[];
    faqs: FAQItem[];
  };
}

export default function AdminArticleForm({ categories, initialData }: ArticleFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '');
  const [category, setCategory] = useState(initialData?.category || categories[0]?._id || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isDraft, setIsDraft] = useState(initialData?.isDraft !== undefined ? initialData.isDraft : true);
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );

  // SEO states
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || '');
  const [keywordsInput, setKeywordsInput] = useState(initialData?.keywords?.join(', ') || '');

  // FAQs states
  const [faqs, setFaqs] = useState<FAQItem[]>(initialData?.faqs || []);

  // UI status states
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-generate English slug from title if title changes and not in edit mode
  useEffect(() => {
    if (!isEdit && title) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  }, [title, isEdit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeaturedImage(data.url);
        setSuccessMessage('इमेज सफलतापूर्वक अपलोड की गई!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(data.error || 'इमेज अपलोड करने में विफलता।');
      }
    } catch {
      setErrorMessage('सर्वर से जुड़ने में समस्या हुई।');
    } finally {
      setUploading(false);
    }
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: keyof FAQItem, value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !summary || !featuredImage || !category) {
      setErrorMessage('कृपया सभी आवश्यक क्षेत्रों को भरें।');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const payload = {
      title,
      slug: slug || undefined,
      content,
      summary,
      featuredImage,
      category,
      isFeatured,
      isDraft,
      publishedAt: new Date(publishedAt).toISOString(),
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
      keywords: keywordsInput.split(',').map((k) => k.trim()).filter((k) => k),
      faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
    };

    try {
      const url = isEdit ? `/api/articles/${initialData._id}` : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(isEdit ? 'लेख सफलतापूर्वक अपडेट किया गया!' : 'लेख सफलतापूर्वक सहेज लिया गया!');
        setTimeout(() => {
          router.push('/admin/dashboard/articles');
          router.refresh();
        }, 1500);
      } else {
        setErrorMessage(data.error || 'सहेजने में समस्या उत्पन्न हुई।');
      }
    } catch {
      setErrorMessage('सर्वर से कनेक्ट करने में त्रुटि।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Messages */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold p-4 rounded-xl text-center">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold p-4 rounded-xl text-center flex items-center justify-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid columns: Content Left, Side Controls Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Main Form Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            
            {/* Title */}
            <div>
              <label htmlFor="article-title" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">आर्टिकल शीर्षक (Title) *</label>
              <input
                id="article-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="आर्टिकल का आकर्षक शीर्षक दर्ज करें..."
                className="w-full bg-accent text-foreground text-sm font-bold rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="article-slug" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">URL स्लग (Slug - English only) *</label>
              <input
                id="article-slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="chatgpt-5-launch-features-hindi"
                className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Brief Summary */}
            <div>
              <label htmlFor="article-summary" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">संक्षिप्त विवरण (Summary/Excerpt) *</label>
              <textarea
                id="article-summary"
                rows={3}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="आर्टिकल का संक्षिप्त सारांश जो कार्ड लिस्टिंग में दिखाई देगा (150-200 शब्द)..."
                className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* HTML Content Body */}
            <div>
              <label htmlFor="article-content" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">आर्टिकल की मुख्य सामग्री (Rich Content / HTML Allowed) *</label>
              <textarea
                id="article-content"
                rows={15}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="यहाँ आर्टिकल की पूरी कहानी लिखें। आप HTML टैग्स (जैसे <h2>, <p>, <ul>, <strong>) का भी इस्तेमाल कर सकते हैं..."
                className="w-full bg-accent text-foreground text-xs md:text-sm font-mono rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* FAQs dynamic fields */}
          <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground">FAQ स्कीमा जोड़ें (Google Rich Snippets SEO)</h3>
              <button
                type="button"
                onClick={handleAddFaq}
                className="bg-accent hover:bg-primary hover:text-white border border-border text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>नया FAQ</span>
              </button>
            </div>

            {faqs.length === 0 ? (
              <p className="text-xs text-muted">कोई FAQ नहीं जोड़ा गया। यह वैकल्पिक है लेकिन Google खोज में रैंकिंग बढ़ाने के लिए बहुत उपयोगी है।</p>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-accent/35 border border-border p-4 rounded-xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="absolute top-4 right-4 text-muted hover:text-red-500 cursor-pointer"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-[calc(100%-24px)] space-y-3">
                      <div>
                        <label htmlFor={`faq-q-${index}`} className="block text-[9px] font-bold text-muted mb-1 uppercase tracking-wide">सवाल (Question)</label>
                        <input
                          id={`faq-q-${index}`}
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                          placeholder="उदाहरण: ChatGPT-5 की लॉन्च डेट क्या है?"
                          className="w-full bg-card text-foreground text-xs rounded-lg py-2 px-3 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor={`faq-a-${index}`} className="block text-[9px] font-bold text-muted mb-1 uppercase tracking-wide">जवाब (Answer)</label>
                        <textarea
                          id={`faq-a-${index}`}
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                          placeholder="उदाहरण: चैटजीपीटी-5 साल 2026 के अंत तक लॉन्च हो सकता है..."
                          className="w-full bg-card text-foreground text-xs rounded-lg py-2 px-3 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Side Settings & Metadata */}
        <div className="space-y-6">
          
          {/* Main Actions Box */}
          <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted border-l-2 border-primary pl-2 mb-2">पब्लिश सेटिंग्स</h3>
            
            {/* Draft Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <label htmlFor="toggle-draft" className="text-xs font-bold text-foreground">ड्राफ्ट में रखें?</label>
              <input
                id="toggle-draft"
                type="checkbox"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
                className="w-4 h-4 text-primary bg-accent rounded border-border focus:ring-primary"
              />
            </div>

            {/* Featured Article Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-border/60">
              <label htmlFor="toggle-featured" className="text-xs font-bold text-foreground">विशेष लेख (Featured)?</label>
              <input
                id="toggle-featured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-primary bg-accent rounded border-border focus:ring-primary"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="select-category" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">कैटेगरी चुनें *</label>
              <select
                id="select-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheduling Datepicker */}
            <div>
              <label htmlFor="published-date" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">पब्लिश करने का समय *</label>
              <input
                id="published-date"
                type="datetime-local"
                required
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'सहेजा जा रहा है...' : isEdit ? 'अपडेट आर्टिकल' : 'आर्टिकल सहेजें'}</span>
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full bg-accent hover:bg-accent/80 text-foreground font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-1 border border-border cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>वापस जाएं</span>
              </button>
            </div>
          </div>

          {/* Image Upload Box */}
          <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted border-l-2 border-primary pl-2 mb-2">थंबनेल इमेज (Featured Image)</h3>
            
            {/* Image Preview */}
            {featuredImage && (
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-accent border border-border">
                <img src={featuredImage} alt="Thumbnail Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label htmlFor="thumbnail-url" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">इमेज URL (या नीचे से फाइल अपलोड करें)</label>
              <input
                id="thumbnail-url"
                type="text"
                required
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-accent text-foreground text-xs rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="w-full bg-accent hover:bg-accent/80 text-foreground font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-border border-dashed cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4 text-primary" />
                <span>{uploading ? 'अपलोड हो रहा है...' : 'स्थानीय फाइल अपलोड करें'}</span>
              </label>
            </div>
          </div>

          {/* SEO Options Box */}
          <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted border-l-2 border-primary pl-2 mb-2">SEO सेटिंग्स (Search Engine)</h3>
            
            <div>
              <label htmlFor="seo-title" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">SEO टाइटल</label>
              <input
                id="seo-title"
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="खाली छोड़ने पर डिफ़ॉल्ट रूप से शीर्षक का उपयोग होगा"
                className="w-full bg-accent text-foreground text-xs rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="seo-description" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">Meta डिस्क्रिप्शन (संक्षिप्त सारांश)</label>
              <textarea
                id="seo-description"
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="गूगल सर्च के लिए संक्षिप्त विवरण (अधिकतम 160 वर्ण)..."
                className="w-full bg-accent text-foreground text-xs rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="seo-keywords" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">कीवर्ड्स (Keywords - Comma Separated)</label>
              <input
                id="seo-keywords"
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="tech, artificial intelligence, chatgpt"
                className="w-full bg-accent text-foreground text-xs rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
