import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchTools, fetchCategories } from '../services/api';
import type { Tool, CategoryCount, PaginationMeta } from '../types';
import { ToolCard } from '../components/ToolCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import {
  Search,
  X,
  LayoutGrid,
  List,
  Sparkles,
  SlidersHorizontal,
  Code2,
  FileText,
  Palette,
  Headphones,
  Video,
  Zap,
  Target,
  Compass,
  Layers,
  Flame,
  Star,
  Rocket,
  Tag,
  Trophy,
  Crown,
} from 'lucide-react';

interface CategoryMeta {
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const getCategoryMeta = (name: string): CategoryMeta => {
  const lower = name.toLowerCase();
  if (lower === 'all') {
    return {
      icon: <Layers className="h-3 w-3" />,
      colorClass: 'text-[#9E86FF]',
      bgClass: 'bg-[#6E56CF]/20',
      borderClass: 'border-[#6E56CF]/40',
    };
  }
  if (lower.includes('code') || lower.includes('dev')) {
    return {
      icon: <Code2 className="h-3 w-3" />,
      colorClass: 'text-sky-400',
      bgClass: 'bg-sky-500/20',
      borderClass: 'border-sky-500/40',
    };
  }
  if (lower.includes('writing') || lower.includes('text')) {
    return {
      icon: <FileText className="h-3 w-3" />,
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-500/20',
      borderClass: 'border-amber-500/40',
    };
  }
  if (lower.includes('image') || lower.includes('vision') || lower.includes('art')) {
    return {
      icon: <Palette className="h-3 w-3" />,
      colorClass: 'text-pink-400',
      bgClass: 'bg-pink-500/20',
      borderClass: 'border-pink-500/40',
    };
  }
  if (lower.includes('audio') || lower.includes('voice') || lower.includes('music')) {
    return {
      icon: <Headphones className="h-3 w-3" />,
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500/20',
      borderClass: 'border-emerald-500/40',
    };
  }
  if (lower.includes('video')) {
    return {
      icon: <Video className="h-3 w-3" />,
      colorClass: 'text-rose-400',
      bgClass: 'bg-rose-500/20',
      borderClass: 'border-rose-500/40',
    };
  }
  if (lower.includes('productivity') || lower.includes('workflow')) {
    return {
      icon: <Zap className="h-3 w-3" />,
      colorClass: 'text-yellow-400',
      bgClass: 'bg-yellow-500/20',
      borderClass: 'border-yellow-500/40',
    };
  }
  if (lower.includes('marketing') || lower.includes('market')) {
    return {
      icon: <Target className="h-3 w-3" />,
      colorClass: 'text-orange-400',
      bgClass: 'bg-orange-500/20',
      borderClass: 'border-orange-500/40',
    };
  }
  if (lower.includes('research') || lower.includes('deep')) {
    return {
      icon: <Compass className="h-3 w-3" />,
      colorClass: 'text-teal-400',
      bgClass: 'bg-teal-500/20',
      borderClass: 'border-teal-500/40',
    };
  }
  return {
    icon: <Sparkles className="h-3 w-3" />,
    colorClass: 'text-violet-400',
    bgClass: 'bg-violet-500/20',
    borderClass: 'border-violet-500/40',
  };
};

export const ToolsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial values from URL search params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialPricing = searchParams.get('pricing') || 'all';
  const initialView = searchParams.get('view') || 'all';
  const initialSort = searchParams.get('sort') || 'popular';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [totalToolsCount, setTotalToolsCount] = useState<number>(0);
  const [tools, setTools] = useState<Tool[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPricing, setSelectedPricing] = useState(initialPricing);
  const [selectedView, setSelectedView] = useState(initialView);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load distinct categories once on component mount
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        if (isMounted && res) {
          setCategories(res.categories || []);
          setTotalToolsCount(res.totalTools || 0);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize filter states to URL search parameters
  const updateUrl = useCallback(() => {
    const params: Record<string, string> = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'All') {
      params.category = selectedCategory;
    }
    if (selectedPricing && selectedPricing !== 'all') params.pricing = selectedPricing;
    if (selectedView === 'featured') params.view = 'featured';
    if (selectedSort && selectedSort !== 'popular') params.sort = selectedSort;
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, selectedPricing, selectedView, selectedSort, currentPage, setSearchParams]);

  // Fetch tools with current active filters
  const loadTools = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchTools({
        search: searchQuery.trim(),
        category: selectedCategory,
        pricing: selectedPricing,
        view: selectedView,
        sort: selectedSort,
        page: currentPage,
        limit: 12,
      });

      if (res && res.success) {
        setTools(res.data || []);
        setPagination(res.pagination || { page: 1, limit: 12, total: res.data?.length || 0, totalPages: 1 });
      }
    } catch (err: any) {
      console.error('Error fetching tools:', err);
      setError(err.message || 'Failed to load tools');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedPricing, selectedView, selectedSort, currentPage]);

  // Debounced trigger on query/filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTools();
      updateUrl();
    }, 180);

    return () => clearTimeout(timer);
  }, [loadTools, updateUrl]);

  // Synchronize state if URL params change externally (e.g. navigation links)
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const s = searchParams.get('search') || '';
    const pr = searchParams.get('pricing') || 'all';
    const v = searchParams.get('view') || 'all';
    const so = searchParams.get('sort') || 'popular';
    const p = parseInt(searchParams.get('page') || '1', 10);

    setSelectedCategory(cat);
    setSearchQuery(s);
    setSelectedPricing(pr);
    setSelectedView(v);
    setSelectedSort(so);
    setCurrentPage(p);
  }, [searchParams]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory((prev) => (prev.toLowerCase() === categoryName.toLowerCase() ? 'all' : categoryName));
    setCurrentPage(1);
  };

  const handlePricingClick = (pricing: string) => {
    if (pricing === 'all') {
      setSelectedPricing('all');
    } else {
      setSelectedPricing((prev) => (prev.toLowerCase() === pricing.toLowerCase() ? 'all' : pricing));
    }
    setCurrentPage(1);
  };

  const handleToggleFeatured = () => {
    setSelectedView((prev) => (prev === 'featured' ? 'all' : 'featured'));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPricing('all');
    setSelectedView('all');
    setSelectedSort('popular');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-20 w-full">
      {/* Hero / Header Banner */}
      <section className="relative overflow-hidden pt-8 pb-8 sm:pt-14 sm:pb-12 md:pt-16 md:pb-14 border-b border-neutral-800/80">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[280px] sm:h-[350px] w-[90%] sm:w-[650px] rounded-full bg-[#6E56CF]/10 blur-[100px] sm:blur-[130px]" />

        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 text-center">
          {/* Responsive Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3 sm:mb-4">
            AI Tools Directory
          </h1>

          {/* Tagline */}
          <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-neutral-400 leading-relaxed px-2">
            Discover, evaluate, and integrate the world’s most powerful artificial intelligence models, productivity tools, and developer platforms.
          </p>

          {/* Prominent Search Bar: Full width on mobile, max-w-2xl centered on desktop */}
          <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl mx-auto mt-6 sm:mt-8">
            <div className="relative group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 sm:pl-4 text-neutral-500 group-focus-within:text-[#8E78E6] transition-colors">
                <Search className="h-4 w-4" />
              </div>

              <input
                id="search-tools-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search AI tools by name, capabilities, or workflow (e.g., ChatGPT, Cursor, ElevenLabs)..."
                className="w-full min-h-[44px] rounded-2xl border border-neutral-800 bg-neutral-950/90 py-3 sm:py-3.5 pl-10 sm:pl-11 pr-10 sm:pr-11 text-xs sm:text-sm text-white placeholder-neutral-500 shadow-card transition-all duration-200 hover:border-neutral-700 focus:border-[#6E56CF] focus:bg-black focus:outline-none focus:ring-2 focus:ring-[#6E56CF]/20"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-500 hover:text-white transition-colors touch-target-44 justify-center"
                  aria-label="Clear search text"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Highlight Pills under Search Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-4 sm:mt-5">
              <button
                type="button"
                onClick={() => {
                  setSelectedSort('popular');
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium border transition-all ${
                  selectedSort === 'popular' && selectedPricing === 'all' && selectedView !== 'featured'
                    ? 'border-orange-500/50 bg-orange-500/15 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                    : 'border-neutral-800/80 bg-neutral-950/80 text-neutral-400 hover:border-orange-500/40 hover:text-orange-300'
                }`}
              >
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                <span>Trending</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSort('popular');
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium border transition-all ${
                  selectedSort === 'popular'
                    ? 'border-amber-500/50 bg-amber-500/15 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'border-neutral-800/80 bg-neutral-950/80 text-neutral-400 hover:border-amber-500/40 hover:text-amber-300'
                }`}
              >
                <Star className="h-3.5 w-3.5 text-amber-400" />
                <span>Popular</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSort('newest');
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium border transition-all ${
                  selectedSort === 'newest'
                    ? 'border-purple-500/50 bg-purple-500/15 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                    : 'border-neutral-800/80 bg-neutral-950/80 text-neutral-400 hover:border-purple-500/40 hover:text-purple-300'
                }`}
              >
                <Rocket className="h-3.5 w-3.5 text-purple-400" />
                <span>New</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPricing((prev) => (prev === 'Free' ? 'all' : 'Free'));
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium border transition-all ${
                  selectedPricing === 'Free'
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'border-neutral-800/80 bg-neutral-950/80 text-neutral-400 hover:border-emerald-500/40 hover:text-emerald-300'
                }`}
              >
                <Tag className="h-3.5 w-3.5 text-emerald-400" />
                <span>Free</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSort('rating');
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium border transition-all ${
                  selectedSort === 'rating'
                    ? 'border-sky-500/50 bg-sky-500/15 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                    : 'border-neutral-800/80 bg-neutral-950/80 text-neutral-400 hover:border-sky-500/40 hover:text-sky-300'
                }`}
              >
                <Trophy className="h-3.5 w-3.5 text-sky-400" />
                <span>Top Rated</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory Content */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 space-y-6">
        {/* Filter Toolbar Section */}
        <div className="space-y-4">
          {/* Horizontal Scrollable Category Filter Pills with colored logo symbols */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scrollbar-none py-1 w-full min-w-0">
            {/* "All" Category Pill */}
            {(() => {
              const isAllSelected = selectedCategory === 'all' || selectedCategory === 'All';
              const allMeta = getCategoryMeta('all');
              return (
                <button
                  type="button"
                  onClick={() => handleCategoryClick('all')}
                  className={`group shrink-0 inline-flex items-center gap-2 rounded-2xl px-3.5 py-1.5 text-xs font-medium border transition-all duration-200 min-h-[38px] ${
                    isAllSelected
                      ? 'border-[#8E78E6]/60 bg-neutral-900 text-white shadow-[0_0_15px_rgba(110,86,207,0.25)] ring-1 ring-[#8E78E6]/40'
                      : 'border-neutral-800/80 bg-neutral-950/90 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900/80 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${allMeta.bgClass} ${allMeta.borderClass} ${allMeta.colorClass} transition-transform group-hover:scale-110`}
                  >
                    {allMeta.icon}
                  </span>
                  <span className="font-semibold">All</span>
                  {totalToolsCount > 0 && (
                    <span className="opacity-50 text-[11px] font-normal">
                      ({totalToolsCount})
                    </span>
                  )}
                </button>
              );
            })()}

            {/* Individual Category Pills with distinctive glowing logo icons */}
            {categories.map((cat) => {
              const isSelected =
                selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
                (selectedCategory.toLowerCase() === 'writing' && cat.name.toLowerCase().includes('writing')) ||
                (selectedCategory.toLowerCase() === 'image' && cat.name.toLowerCase().includes('image')) ||
                (selectedCategory.toLowerCase() === 'audio' && (cat.name.toLowerCase().includes('audio') || cat.name.toLowerCase().includes('voice'))) ||
                (selectedCategory.toLowerCase() === 'video' && cat.name.toLowerCase().includes('video')) ||
                (selectedCategory.toLowerCase() === 'marketing' && cat.name.toLowerCase().includes('marketing')) ||
                (selectedCategory.toLowerCase() === 'research' && cat.name.toLowerCase().includes('research'));

              const meta = getCategoryMeta(cat.name);

              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`group shrink-0 inline-flex items-center gap-2 rounded-2xl px-3.5 py-1.5 text-xs font-medium border transition-all duration-200 min-h-[38px] ${
                    isSelected
                      ? 'border-[#8E78E6]/60 bg-neutral-900 text-white shadow-[0_0_15px_rgba(110,86,207,0.25)] ring-1 ring-[#8E78E6]/40'
                      : 'border-neutral-800/80 bg-neutral-950/90 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900/80 hover:text-white'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${meta.bgClass} ${meta.borderClass} ${meta.colorClass} transition-transform group-hover:scale-110`}
                  >
                    {meta.icon}
                  </span>
                  <span className="font-semibold">{cat.name}</span>
                  <span className="opacity-50 text-[11px] font-normal">
                    ({cat.toolCount ?? cat.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter Toolbar: Pricing, Featured Toggle, Sort & View Mode */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pt-3 border-t border-neutral-800/80">
            {/* Left Controls: Pricing Pills & Featured Toggle with Icons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider hidden xs:inline mr-1">
                Pricing:
              </span>

              {[
                { label: 'All Pricing', value: 'all', icon: <Layers className="h-3.5 w-3.5" />, color: 'text-neutral-400' },
                { label: 'Free', value: 'Free', icon: <Tag className="h-3.5 w-3.5" />, color: 'text-emerald-400' },
                { label: 'Freemium', value: 'Freemium', icon: <Zap className="h-3.5 w-3.5" />, color: 'text-cyan-400' },
                { label: 'Paid', value: 'Paid', icon: <Crown className="h-3.5 w-3.5" />, color: 'text-amber-400' },
              ].map((tier) => {
                const isSelected = selectedPricing === tier.value;
                return (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => handlePricingClick(tier.value)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:py-1 text-xs font-medium border transition-all min-h-[34px] sm:min-h-[30px] ${
                      isSelected
                        ? 'border-neutral-700 bg-neutral-800 text-white shadow-sm'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <span className={tier.color}>{tier.icon}</span>
                    <span>{tier.label}</span>
                  </button>
                );
              })}

              {/* Featured toggle pill with sparkle icon */}
              <button
                type="button"
                onClick={handleToggleFeatured}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:py-1 text-xs font-medium border transition-all min-h-[34px] sm:min-h-[30px] ${
                  selectedView === 'featured'
                    ? 'border-[#6E56CF]/50 bg-[#6E56CF]/20 text-[#B8A6FF] shadow-[0_0_12px_rgba(110,86,207,0.25)]'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#8E78E6]" />
                <span>Featured Only</span>
              </button>
            </div>

            {/* Right Controls: Sort Dropdown & View Mode Toggle */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 lg:pt-0">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-500" />
                <select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 focus:outline-none focus:border-[#6E56CF] min-h-[36px]"
                  aria-label="Sort tools"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Recently Added</option>
                  <option value="az">Alphabetical (A-Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all min-h-[34px] min-w-[34px] flex items-center justify-center ${
                    viewMode === 'grid'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all min-h-[34px] min-w-[34px] flex items-center justify-center ${
                    viewMode === 'list'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  title="List view"
                  aria-label="List view"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Metadata bar & Active Filter Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap text-xs text-neutral-400">
            <span>
              Showing <strong className="text-white font-semibold">{pagination.total}</strong> AI tools
            </span>

            {/* Active Category Badge */}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#6E56CF]/15 border border-[#6E56CF]/30 px-2 py-0.5 text-[11px] font-medium text-[#B8A6FF]">
                <span>{selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-white transition-colors ml-0.5"
                  aria-label="Remove category filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Active Pricing Badge */}
            {selectedPricing !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-800/80 border border-neutral-700/80 px-2 py-0.5 text-[11px] font-medium text-neutral-200">
                <span>{selectedPricing}</span>
                <button
                  type="button"
                  onClick={() => setSelectedPricing('all')}
                  className="hover:text-white transition-colors ml-0.5"
                  aria-label="Remove pricing filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Active Featured Badge */}
            {selectedView === 'featured' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                <span>✨ Featured Only</span>
                <button
                  type="button"
                  onClick={() => setSelectedView('all')}
                  className="hover:text-white transition-colors ml-0.5"
                  aria-label="Remove featured filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Active Search Query Badge */}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-800/80 border border-neutral-700/80 px-2 py-0.5 text-[11px] font-medium text-neutral-300">
                <span>&ldquo;{searchQuery}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-white transition-colors ml-0.5"
                  aria-label="Remove search query"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedPricing !== 'all' || selectedView === 'featured') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-neutral-400 hover:text-white underline underline-offset-2 transition-colors py-1 shrink-0 self-start sm:self-auto"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Dynamic Results Section */}
        {isLoading ? (
          <SkeletonCard viewMode={viewMode} count={viewMode === 'grid' ? 6 : 6} />
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 sm:p-8 text-center">
            <p className="text-xs sm:text-sm text-rose-400 mb-4">{error}</p>
            <button
              type="button"
              onClick={loadTools}
              className="rounded-full bg-neutral-900 border border-neutral-800 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 min-h-[40px]"
            >
              Retry
            </button>
          </div>
        ) : tools.length === 0 ? (
          <EmptyState
            query={searchQuery}
            onReset={handleResetFilters}
            title="No tools found matching your query"
            description={
              searchQuery
                ? `No AI tools matched "${searchQuery}". Try a different keyword or reset your active filters.`
                : 'No AI tools found for the selected criteria. Try adjusting or clearing your filters.'
            }
          />
        ) : viewMode === 'grid' ? (
          /* Card Grid Layout: 1 col (375-639px), 2 cols (640-1023px), 3 cols (1024-1440px) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} viewMode="grid" />
            ))}
          </div>
        ) : (
          /* List View Mode */
          <div className="space-y-3 sm:space-y-3.5">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} viewMode="list" />
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {!isLoading && !error && tools.length > 0 && pagination.totalPages > 1 && (
          <div className="pt-4 sm:pt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              limit={pagination.limit}
              onPageChange={(newPage) => {
                setCurrentPage(newPage);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};
