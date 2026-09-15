import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-5 pb-2 border-t border-[#1c1c22] mt-4 sm:mt-6 w-full">
      <div className="text-xs text-zinc-400 text-center sm:text-left">
        Showing <span className="text-white font-medium">{startItem}</span> to{' '}
        <span className="text-white font-medium">{endItem}</span> of{' '}
        <span className="text-white font-medium">{totalItems}</span> tools
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
        {/* Previous button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex h-10 sm:h-9 items-center gap-1 rounded-xl border border-[#232328] bg-[#0e0e12] px-3 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 disabled:opacity-35 disabled:pointer-events-none transition-all touch-target-44 justify-center"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Page buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-1.5 text-xs text-zinc-600 select-none">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`h-10 w-10 sm:h-9 sm:w-9 rounded-xl text-xs font-semibold transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'border border-[#232328] bg-[#0e0e12] text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex h-10 sm:h-9 items-center gap-1 rounded-xl border border-[#232328] bg-[#0e0e12] px-3 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 disabled:opacity-35 disabled:pointer-events-none transition-all touch-target-44 justify-center"
          aria-label="Next page"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
