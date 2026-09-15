import React from 'react';
import type { Category } from '../types';
import {
  Sparkles,
  Code,
  FileText,
  Image,
  Mic,
  Zap,
} from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  totalTools: number;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  totalTools,
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes('code') || lower.includes('dev')) {
      return <Code className="h-3.5 w-3.5" />;
    }
    if (lower.includes('text') || lower.includes('writ')) {
      return <FileText className="h-3.5 w-3.5" />;
    }
    if (lower.includes('image') || lower.includes('visual')) {
      return <Image className="h-3.5 w-3.5" />;
    }
    if (lower.includes('audio') || lower.includes('voice') || lower.includes('music')) {
      return <Mic className="h-3.5 w-3.5" />;
    }
    if (lower.includes('productiv')) {
      return <Zap className="h-3.5 w-3.5" />;
    }
    return <Sparkles className="h-3.5 w-3.5" />;
  };

  // Pre-configured priority category list or dynamic
  const defaultList = [
    'Text & Writing',
    'Image Generation',
    'Coding',
    'Audio',
    'Productivity',
  ];

  // Merge backend categories while preserving clean ordering
  const displayCategories = [...categories].sort((a, b) => {
    const aIdx = defaultList.indexOf(a.name);
    const bIdx = defaultList.indexOf(b.name);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      <div className="flex items-center gap-2 min-w-max">
        {/* 'All' button */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all border ${
            selectedCategory === 'all' || selectedCategory === 'All'
              ? 'bg-white text-black border-white shadow-sm'
              : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>All</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              selectedCategory === 'all' || selectedCategory === 'All'
                ? 'bg-black/10 text-black font-bold'
                : 'bg-neutral-900 text-neutral-500'
            }`}
          >
            {totalTools}
          </span>
        </button>

        {/* Dynamic Categories */}
        {displayCategories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-white text-black border-white shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {getIcon(cat.name)}
              <span>{cat.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  isSelected
                    ? 'bg-black/10 text-black font-bold'
                    : 'bg-neutral-900 text-neutral-500'
                }`}
              >
                {cat.toolCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
