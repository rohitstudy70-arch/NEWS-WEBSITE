'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Menu, X, Search, Sun, Moon, Globe, Laptop, Flag, Trophy, Film, Newspaper } from 'lucide-react';

interface CategoryItem {
  name: string;
  slug: string;
  icon: React.ComponentType<any>;
}

const defaultCategories: CategoryItem[] = [
  { name: 'भारत', slug: 'india', icon: Flag },
  { name: 'दुनिया', slug: 'world', icon: Globe },
  { name: 'तकनीक', slug: 'technology-news', icon: Laptop },
  { name: 'खेल', slug: 'sports', icon: Trophy },
  { name: 'मनोरंजन', slug: 'entertainment', icon: Film },
  { name: 'सामान्य', slug: 'general', icon: Newspaper },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="bg-primary text-white px-3 py-1.5 rounded-lg font-display font-extrabold text-lg tracking-wider shadow-md shadow-primary/20">
                TECH
              </span>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                Khabar
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-4 items-center">
            <Link
              href="/"
              className="text-sm font-semibold text-foreground/80 hover:text-primary px-3 py-2 rounded-md transition-colors"
            >
              होम
            </Link>
            {defaultCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex items-center space-x-1 text-sm font-semibold text-foreground/80 hover:text-primary px-3 py-2 rounded-md transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary/80" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="सर्च करें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-60 bg-accent text-foreground text-xs font-medium rounded-full py-2 pl-4 pr-10 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="submit"
                aria-label="Search button"
                className="absolute right-3 top-2.5 text-muted hover:text-primary transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-full hover:bg-accent text-foreground transition-colors border border-border"
            >
              {mounted && theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-primary" />}
            </button>

            {/* Admin Portal Shortcut */}
            <Link
              href="/admin/dashboard"
              className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary/95 transition-all shadow-sm"
            >
              डैशबोर्ड
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme mobile"
              className="p-1.5 rounded-full hover:bg-accent text-foreground transition-colors border border-border"
            >
              {mounted && theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-primary" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-accent focus:outline-none transition-colors border border-border"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-border animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <form onSubmit={handleSearchSubmit} className="relative my-3">
              <input
                type="text"
                placeholder="सर्च करें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-accent text-foreground text-sm font-medium rounded-full py-2.5 pl-4 pr-10 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                aria-label="Submit search mobile"
                className="absolute right-3.5 top-3 text-muted hover:text-primary"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-bold text-foreground/80 hover:text-primary hover:bg-accent"
            >
              होम
            </Link>
            {defaultCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-md text-base font-bold text-foreground/80 hover:text-primary hover:bg-accent"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
            <div className="border-t border-border my-2 pt-2">
              <Link
                href="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-primary text-white font-semibold py-2.5 rounded-md hover:bg-primary/95 shadow-sm"
              >
                एडमिन डैशबोर्ड
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
