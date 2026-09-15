import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  query?: string;
  onReset?: () => void;
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  query,
  onReset,
  title = 'No tools found matching your query',
  description,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-neutral-800 bg-neutral-950/80 my-6">
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 mb-4 shadow-inner">
        <SearchX className="h-7 w-7 text-[#8E78E6]" />
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>

      {/* Description */}
      <p className="text-xs text-neutral-400 max-w-md mb-6 leading-relaxed">
        {description || (query ? (
          <>
            No AI tools matched &ldquo;<span className="text-white font-medium">{query}</span>&rdquo;. Try searching for different keywords, adjusting categories, or clearing your active filters.
          </>
        ) : (
          'No AI tools found for the selected category or filter options. Try expanding your search criteria.'
        ))}
      </p>

      {/* Reset Button */}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:border-neutral-700 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 shadow-sm"
        >
          <RotateCcw className="h-3.5 w-3.5 text-[#8E78E6]" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
