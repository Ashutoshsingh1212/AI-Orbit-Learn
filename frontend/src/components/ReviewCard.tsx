import React from 'react';
import { Review } from '../types';
import { RatingStars } from './RatingStars';
import { UserCheck } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border border-[#202026] bg-[#0e0e12] p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img
            src={
              review.user?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                review.user?.name || 'User'
              )}&background=27272a&color=fff`
            }
            alt={review.user?.name || 'Reviewer'}
            className="h-8 w-8 rounded-full object-cover border border-white/10"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white">
                {review.user?.name || 'Community Reviewer'}
              </span>
              <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 text-[9px]">
                <UserCheck className="h-2.5 w-2.5" />
                Verified
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">{formattedDate}</span>
          </div>
        </div>

        <RatingStars rating={review.rating} size="sm" />
      </div>

      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-white mb-1">
          {review.title}
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          &ldquo;{review.content}&rdquo;
        </p>
      </div>
    </div>
  );
};
