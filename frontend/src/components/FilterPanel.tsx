import React from 'react';
import { LayoutGrid, List, ArrowUpDown, Filter, X } from 'lucide-react';

interface FilterPanelProps {
  totalCount: number;
  selectedPricing: string;
  onSelectPricing: (pricing: string) => void;
  selectedSort: string;
  onSelectSort: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  activeSearch?: string;
  selectedCategory?: string;
  onResetFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  totalCount,
  selectedPricing,
  onSelectPricing,
  selectedSort,
  onSelectSort,
  viewMode,
  onViewModeChange,
  activeSearch,
  selectedCategory,
  onResetFilters,
}) => {
  const pricingOptions = [
    { label: 'All Pricing', value: 'all' },
    { label: 'Free', value: 'Free' },
    { label: 'Freemium', value: 'Freemium' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Free Trial', value: 'Free Trial' },
  ];

  const sortOptions = [
    { label: 'Popular', value: 'popular' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Newest', value: 'newest' },
    { label: 'A-Z', value: 'az' },
  ];

  const hasActiveFilters =
    Boolean(activeSearch) ||
    (selectedCategory && selectedCategory !== 'all') ||
    selectedPricing !== 'all' ||
    selectedSort !== 'popular';

  return (
    <div className="flex flex-col gap-3 pt-2 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Results Count */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">
            Showing <strong className="text-white font-bold">{totalCount}</strong>{' '}
            {totalCount === 1 ? 'AI tool' : 'AI tools'}
          </span>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-[11px] font-medium text-[#8E78E6] hover:text-white transition-colors ml-2"
            >
              <X className="h-3 w-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Right: Controls (Pricing, Sort, View) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Pricing filter */}
          <div className="relative flex items-center">
            <Filter className="absolute left-3 h-3 w-3 text-zinc-500 pointer-events-none" />
            <select
              value={selectedPricing}
              onChange={(e) => onSelectPricing(e.target.value)}
              className="h-9 pl-8 pr-8 rounded-lg border border-[#232328] bg-[#0e0e12] text-xs font-medium text-zinc-300 hover:border-zinc-700 focus:border-[#6E56CF] focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              {pricingOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#121217] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 pointer-events-none text-zinc-500 text-[10px]">▼</span>
          </div>

          {/* Sort dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 h-3 w-3 text-zinc-500 pointer-events-none" />
            <select
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value)}
              className="h-9 pl-8 pr-8 rounded-lg border border-[#232328] bg-[#0e0e12] text-xs font-medium text-zinc-300 hover:border-zinc-700 focus:border-[#6E56CF] focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#121217] text-white">
                  Sort: {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 pointer-events-none text-zinc-500 text-[10px]">▼</span>
          </div>

          {/* View Toggle (Grid / List) */}
          <div className="hidden sm:flex items-center rounded-lg border border-[#232328] bg-[#0e0e12] p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
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
  );
};
