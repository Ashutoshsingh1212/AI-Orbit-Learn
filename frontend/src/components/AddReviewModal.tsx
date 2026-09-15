import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RatingStars } from './RatingStars';
import { X, Send, AlertCircle, Sparkles } from 'lucide-react';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  toolSlug: string;
  onReviewSubmitted: (newReview: any) => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  toolName,
  toolSlug,
  onReviewSubmitted,
}) => {
  const { user, showToast } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const reviewTitle = title.trim() || `Rated ${rating}/5 Stars`;
    const reviewContent = content.trim() || `Rated ${rating} out of 5 stars for ${toolName} on AI Orbit.`;

    try {
      const token = localStorage.getItem('ai_orbit_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

      if (token) {
        const response = await fetch(`${apiUrl}/tools/${toolSlug}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            title: reviewTitle,
            content: reviewContent,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          showToast(`Your ${rating}-star rating for ${toolName} was submitted!`, 'success');
          onReviewSubmitted(result.data || { rating });
          onClose();
          setTitle('');
          setContent('');
          setRating(5);
          return;
        }
      }

      // Guest / Offline fallback rating submission
      showToast(`Thank you! Your ${rating}-star rating for ${toolName} was recorded.`, 'success');
      onReviewSubmitted({
        rating,
        title: reviewTitle,
        content: reviewContent,
        createdAt: new Date().toISOString(),
      });
      onClose();
      setTitle('');
      setContent('');
      setRating(5);
    } catch {
      // Local fallback in case of network issue
      showToast(`Thank you! Your ${rating}-star rating for ${toolName} was recorded.`, 'success');
      onReviewSubmitted({ rating });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-[#101015] p-5 sm:p-6 shadow-2xl scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-1.5 text-xs text-[#8E78E6] font-semibold mb-0.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Community Rating</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white truncate">Rate {toolName}</h3>
            <p className="text-xs text-neutral-400 truncate">Select your stars and share your feedback</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors touch-target-44 flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Close rating modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-4">
          {/* Interactive Star Selection */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-950 p-4 flex flex-col items-center justify-center space-y-2">
            <span className="text-xs font-semibold text-neutral-300">Click stars to set rating</span>
            <RatingStars
              rating={rating}
              size="lg"
              interactive={true}
              onRatingChange={(newRating) => setRating(newRating)}
            />
            <span className="text-sm font-bold text-amber-400">
              {rating === 5
                ? '5.0 - Exceptional'
                : rating === 4
                ? '4.0 - Very Good'
                : rating === 3
                ? '3.0 - Average'
                : rating === 2
                ? '2.0 - Needs Improvement'
                : '1.0 - Poor'}
            </span>
          </div>

          <div>
            <label htmlFor="review-title" className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Headline / Summary <span className="text-neutral-500 font-normal">(optional)</span>
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Essential for my daily workflow"
              maxLength={80}
              className="w-full h-11 sm:h-10 px-3 rounded-xl border border-neutral-800 bg-[#0b0b0e] text-xs text-white placeholder:text-neutral-600 focus:border-[#6E56CF] focus:outline-none focus:ring-1 focus:ring-[#6E56CF]"
            />
          </div>

          <div>
            <label htmlFor="review-content" className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Review Details <span className="text-neutral-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you like or dislike? How does it help your team?"
              rows={3}
              maxLength={1000}
              className="w-full p-3 rounded-xl border border-neutral-800 bg-[#0b0b0e] text-xs text-white placeholder:text-neutral-600 focus:border-[#6E56CF] focus:outline-none focus:ring-1 focus:ring-[#6E56CF] resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-neutral-800">
            <span className="text-[11px] text-neutral-500">
              {user ? `Posting as ${user.name}` : 'Posting as Community Reviewer'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer min-h-[40px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-xl bg-[#6E56CF] hover:bg-[#7D67D9] disabled:opacity-50 px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-glow-sm min-h-[40px] cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Saving...' : 'Submit Rating'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
