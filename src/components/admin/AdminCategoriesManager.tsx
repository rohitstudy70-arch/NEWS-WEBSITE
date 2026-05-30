'use client';

import React, { useState } from 'react';
import { Plus, Tag, Cpu, Laptop, Smartphone, Shield, BookOpen, Globe } from 'lucide-react';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface AdminCategoriesManagerProps {
  initialCategories: CategoryItem[];
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Cpu,
  Laptop,
  Smartphone,
  Shield,
  BookOpen,
  Globe,
};

const iconOptions = ['Cpu', 'Laptop', 'Smartphone', 'Shield', 'BookOpen', 'Globe'];

export default function AdminCategoriesManager({ initialCategories }: AdminCategoriesManagerProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Cpu');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, icon }),
      });

      const data = await res.json();
      if (res.ok) {
        setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name)));
        setSuccess('कैटेगरी सफलतापूर्वक जोड़ी गई!');
        setName('');
        setSlug('');
        setDescription('');
        setIcon('Cpu');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'सहेजने में विफलता हुई।');
      }
    } catch {
      setError('सर्वर एरर।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. Add Category Form (1 Column) */}
      <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-sm transition-colors self-start space-y-4">
        <h2 className="text-sm font-bold flex items-center space-x-2 text-foreground mb-2">
          <Plus className="w-4 h-4 text-primary" />
          <span>नई कैटेगरी जोड़ें</span>
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-semibold p-3.5 rounded-xl text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-semibold p-3.5 rounded-xl text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cat-name" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">कैटेगरी नाम (Hindi) *</label>
            <input
              id="cat-name"
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="आर्टिफिशियल इंटेलिजेंस"
              className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="cat-slug" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">यूआरएल स्लग (Slug) *</label>
            <input
              id="cat-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ai-news"
              className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="cat-desc" className="block text-[10px] font-bold text-muted mb-1.5 uppercase tracking-wide">विवरण (Description)</label>
            <textarea
              id="cat-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="आर्टिफिशियल इंटेलिजेंस की नवीनतम ख़बरें..."
              className="w-full bg-accent text-foreground text-xs md:text-sm rounded-xl py-3 px-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <span className="block text-[10px] font-bold text-muted mb-2.5 uppercase tracking-wide">प्रतिनिधि आइकॉन चुनें</span>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((opt) => {
                const IconComponent = iconMap[opt] || Tag;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setIcon(opt)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                      icon === opt
                        ? 'bg-primary border-primary text-white'
                        : 'bg-accent border-border text-muted hover:text-foreground'
                    }`}
                    title={opt}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer"
            >
              <span>{loading ? 'सहेजा जा रहा है...' : 'कैटेगरी जोड़ें'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Categories List Table (2 Columns) */}
      <div className="bg-card text-card-foreground border border-border p-6 rounded-2xl shadow-sm transition-colors lg:col-span-2 space-y-4">
        <h2 className="text-sm font-bold flex items-center space-x-2 text-foreground mb-2">
          <Tag className="w-4 h-4 text-primary" />
          <span>सक्रिय कैटेगरीज ({categories.length})</span>
        </h2>

        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left border-collapse text-xs font-semibold">
            <thead>
              <tr className="bg-accent/40 border-b border-border text-[10px] font-bold text-muted uppercase tracking-wider">
                <th className="p-3 pl-4">आइकॉन</th>
                <th className="p-3">नाम</th>
                <th className="p-3">स्लग (Slug)</th>
                <th className="p-3 pr-4">विवरण</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {categories.map((cat) => {
                const IconComponent = (cat.icon ? iconMap[cat.icon] : null) || Tag;
                return (
                  <tr key={cat._id} className="hover:bg-accent/15 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary inline-block">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="p-3 font-bold text-foreground">{cat.name}</td>
                    <td className="p-3 text-muted">{cat.slug}</td>
                    <td className="p-3 pr-4 text-muted max-w-xs truncate">{cat.description || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
