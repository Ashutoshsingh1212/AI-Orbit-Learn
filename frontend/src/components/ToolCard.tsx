import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Tool } from '../types';
import { useAuth } from '../context/AuthContext';
import { RatingStars } from './RatingStars';
import { AddReviewModal } from './AddReviewModal';
import { Bookmark, ArrowUpRight, CheckCircle, Star } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  viewMode?: 'grid' | 'list';
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, viewMode = 'grid' }) => {
  const { bookmarkedSlugs, toggleBookmark } = useAuth();
  const isSaved = bookmarkedSlugs.has(tool.slug || tool.id);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(tool.rating);
  const [currentReviewCount, setCurrentReviewCount] = useState(tool.reviewsCount || 0);

  const getPricingBadgeClass = (pricing: string) => {
    switch (pricing) {
      case 'Free':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Freemium':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Paid':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-neutral-900 text-neutral-400 border-neutral-800';
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(tool);
  };

  const handleOpenRateModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmitted = (newReview: any) => {
    if (newReview && typeof newReview.rating === 'number') {
      const newTotal = currentReviewCount + 1;
      const updatedAvg = (currentRating * currentReviewCount + newReview.rating) / newTotal;
      setCurrentRating(parseFloat(updatedAvg.toFixed(1)));
      setCurrentReviewCount(newTotal);
    }
  };

  const detailPath = `/tools/${tool.slug || tool.id}`;
  const iconSource = tool.iconUrl || tool.icon || '';
  const tagline = tool.tagLine || tool.description || '';

  // LIST VIEW LAYOUT
  if (viewMode === 'list') {
    return (
      <>
        <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 rounded-2xl border border-neutral-800/80 bg-neutral-950 p-4 sm:p-4.5 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-900/60 w-full min-w-0">
          <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
            {/* Logo / Icon */}
            <Link to={detailPath} className="shrink-0 mt-0.5 sm:mt-0">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden shadow-inner flex items-center justify-center">
                <img
                  src={iconSource}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      tool.name
                    )}&background=18181b&color=fff&size=128`;
                  }}
                />
              </div>
            </Link>

            {/* Tool Info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                <Link
                  to={detailPath}
                  className="font-bold text-sm sm:text-base text-white hover:text-[#8E78E6] transition-colors truncate max-w-[180px] sm:max-w-none"
                >
                  {tool.name}
                </Link>
                {tool.verified && (
                  <span title="Verified AI Tool" className="shrink-0">
                    <CheckCircle className="h-3.5 w-3.5 text-[#6E56CF]" />
                  </span>
                )}
                {tool.category && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-medium border border-neutral-800 bg-neutral-900/60 text-neutral-300 shrink-0">
                    {tool.category}
                  </span>
                )}
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold shrink-0 ${getPricingBadgeClass(
                    tool.pricing
                  )}`}
                >
                  {tool.pricing}
                </span>
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2 sm:line-clamp-1 leading-relaxed">
                {tagline}
              </p>
            </div>
          </div>

          {/* Right Actions & Workable Rating */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60 w-full sm:w-auto">
            {/* Workable Rating Button */}
            <button
              type="button"
              onClick={handleOpenRateModal}
              className="group/rate flex items-center gap-1.5 py-1 px-2 rounded-lg bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800/80 hover:border-amber-500/40 transition-all cursor-pointer text-left"
              title={`Click to rate ${tool.name} (Current: ${currentRating.toFixed(1)}/5)`}
              aria-label={`Rate ${tool.name}`}
            >
              <RatingStars rating={currentRating} size="sm" />
              <span className="text-xs font-bold text-white group-hover/rate:text-amber-400 transition-colors">
                {currentRating.toFixed(1)}
              </span>
              <span className="text-[10px] text-neutral-500 group-hover/rate:text-amber-400/80 transition-colors font-medium">
                Rate
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBookmarkClick}
                className={`p-2.5 sm:p-2 rounded-xl border transition-all min-h-[40px] min-w-[40px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center ${
                  isSaved
                    ? 'bg-[#6E56CF]/20 border-[#6E56CF]/40 text-[#8E78E6]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-white hover:bg-neutral-800'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save tool to bookmarks'}
                aria-label={isSaved ? 'Remove bookmark' : 'Bookmark this tool'}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              {/* Single Perfectly Aligned View Button */}
              <Link
                to={detailPath}
                className="flex items-center gap-1 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 px-3 sm:px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-neutral-200 hover:text-white transition-all group/btn min-h-[40px] sm:min-h-[36px]"
              >
                <span>View</span>
                <ArrowUpRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Add / Submit Rating Modal */}
        <AddReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          toolName={tool.name}
          toolSlug={tool.slug || tool.id}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </>
    );
  }

  // GRID VIEW LAYOUT (DEFAULT)
  return (
    <>
      <div className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-950 p-4.5 sm:p-5 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-900/60 hover:shadow-card w-full min-w-0">
        <div>
          {/* Top Header Row: Icon, Tool Name, Category, Pricing, Bookmark */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link to={detailPath} className="shrink-0">
                <div className="relative h-11 w-11 sm:h-12 sm:w-12 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-inner">
                  <img
                    src={iconSource}
                    alt={`${tool.name} logo`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        tool.name
                      )}&background=18181b&color=fff&size=128`;
                    }}
                  />
                </div>
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link
                    to={detailPath}
                    className="font-bold text-sm sm:text-base text-white hover:text-[#8E78E6] transition-colors truncate block"
                  >
                    {tool.name}
                  </Link>
                  {tool.verified && (
                    <span title="Verified AI Tool" className="shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-[#6E56CF]" />
                    </span>
                  )}
                </div>

                {tool.category && (
                  <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium border border-neutral-800 bg-neutral-900/60 text-neutral-300 mt-1 truncate max-w-[140px]">
                    {tool.category}
                  </span>
                )}
              </div>
            </div>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={handleBookmarkClick}
              className={`p-2 rounded-xl border transition-all shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center ${
                isSaved
                  ? 'bg-[#6E56CF]/20 border-[#6E56CF]/40 text-[#8E78E6]'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-white hover:bg-neutral-800'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save tool to bookmarks'}
              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark this tool'}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Short Tagline */}
          <p className="text-xs leading-relaxed text-neutral-400 line-clamp-2 mb-4">
            {tagline}
          </p>
        </div>

        {/* Bottom bar: Rating (Workable), Pricing & Single Aligned View Action Button */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2 mt-auto">
          {/* Workable Click-to-Rate Button */}
          <button
            type="button"
            onClick={handleOpenRateModal}
            className="group/rate flex items-center gap-1.5 py-1 px-2 -ml-1 rounded-lg bg-neutral-900/40 hover:bg-neutral-800/80 border border-neutral-800/60 hover:border-amber-500/40 transition-all cursor-pointer text-left shrink-0"
            title={`Click to rate ${tool.name} (Current: ${currentRating.toFixed(1)}/5)`}
            aria-label={`Rate ${tool.name}`}
          >
            <RatingStars rating={currentRating} size="sm" />
            <span className="text-xs font-semibold text-white group-hover/rate:text-amber-400 transition-colors">
              {currentRating.toFixed(1)}
            </span>
            <span className="text-[10px] text-neutral-500 group-hover/rate:text-amber-400/80 transition-colors font-medium">
              Rate
            </span>
          </button>

          {/* Right side: Pricing Pill + Single Aligned View Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Pricing pill */}
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getPricingBadgeClass(
                tool.pricing
              )}`}
            >
              {tool.pricing}
            </span>

            {/* Single Perfectly Aligned View Action */}
            <Link
              to={detailPath}
              className="flex items-center gap-1 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:text-white transition-all group/link min-h-[32px] shrink-0"
              title={`View ${tool.name} details & reviews`}
            >
              <span>View</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Add / Submit Rating Modal */}
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        toolName={tool.name}
        toolSlug={tool.slug || tool.id}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  );
};
