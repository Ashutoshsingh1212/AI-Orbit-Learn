import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchToolBySlugOrId, api } from '../services/api';
import type { Tool } from '../types';
import { useAuth } from '../context/AuthContext';
import { RatingStars } from '../components/RatingStars';
import { ReviewCard } from '../components/ReviewCard';
import { AddReviewModal } from '../components/AddReviewModal';
import { ToolCard } from '../components/ToolCard';
import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Share2,
  CheckCircle,
  Check,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  Globe,
  DollarSign,
  ChevronRight,
  Target,
  Star,
} from 'lucide-react';

export const ToolDetailPage: React.FC = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const toolSlugOrId = slug || id;
  const navigate = useNavigate();
  const { bookmarkedSlugs, toggleBookmark, showToast } = useAuth();

  const [tool, setTool] = useState<Tool | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!toolSlugOrId) return;

    let isMounted = true;
    const loadToolDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [toolData, relatedRes] = await Promise.all([
          fetchToolBySlugOrId(toolSlugOrId),
          api.getRelatedTools(toolSlugOrId, 3).catch(() => ({ success: false, data: [] })),
        ]);

        if (isMounted) {
          if (toolData) {
            setTool(toolData);
          } else {
            setError('AI Tool not found');
          }

          if (relatedRes && relatedRes.data) {
            setRelatedTools(relatedRes.data);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error loading tool:', err);
          setError(err.message || 'AI Tool not found');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadToolDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [toolSlugOrId]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  const handleReviewSubmitted = (newReview: any) => {
    if (!tool) return;
    setTool({
      ...tool,
      reviews: [newReview, ...(tool.reviews || [])],
      reviewsCount: (tool.reviewsCount || 0) + 1,
    });
  };

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

  // LOADING SKELETON STATE
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 pt-6 w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 animate-pulse space-y-6 sm:space-y-8">
          {/* Breadcrumb skeleton */}
          <div className="h-4 w-48 rounded bg-neutral-900" />

          {/* Header Card skeleton */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-8 flex flex-col md:flex-row items-start gap-5 sm:gap-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-neutral-900 shrink-0" />
            <div className="flex-1 space-y-3 w-full">
              <div className="h-7 sm:h-8 w-48 sm:w-64 rounded bg-neutral-900" />
              <div className="h-4 w-full max-w-xl rounded bg-neutral-900/60" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-20 rounded-full bg-neutral-900" />
                <div className="h-6 w-24 rounded-full bg-neutral-900" />
              </div>
            </div>
            <div className="h-11 w-full md:w-36 rounded-xl bg-neutral-900 shrink-0" />
          </div>

          {/* Content Columns skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-3">
                <div className="h-6 w-32 rounded bg-neutral-900" />
                <div className="h-4 w-full rounded bg-neutral-900/60" />
                <div className="h-4 w-5/6 rounded bg-neutral-900/60" />
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-4">
                <div className="h-6 w-40 rounded bg-neutral-900" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="h-14 rounded-xl bg-neutral-900/60" />
                  <div className="h-14 rounded-xl bg-neutral-900/60" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-4">
                <div className="h-6 w-28 rounded bg-neutral-900" />
                <div className="h-24 rounded-lg bg-neutral-900/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR / NOT FOUND VIEW
  if (error || !tool) {
    return (
      <div className="min-h-[70vh] bg-black text-white flex flex-col items-center justify-center p-6 text-center w-full">
        <div className="h-16 w-16 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-4 shadow-inner">
          <Sparkles className="h-8 w-8 text-[#6E56CF]" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">AI Tool Not Found</h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
          The requested tool &ldquo;<span className="text-white font-medium">{toolSlugOrId}</span>&rdquo; could not be found or may have been updated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-white text-black hover:bg-neutral-200 px-5 py-3 text-xs font-bold transition-all shadow-sm min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to directory</span>
        </Link>
      </div>
    );
  }

  const isSaved = bookmarkedSlugs.has(tool.slug || tool.id);
  const iconSource = tool.iconUrl || tool.icon || '';
  const websiteSource = tool.websiteUrl || tool.url || '#';
  const displayTagline = tool.tagLine || tool.description || '';
  const displayFullDescription = tool.fullDescription || tool.description || '';
  const addedDate = tool.createdAt
    ? new Date(tool.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '2026';

  let websiteHostname = '';
  try {
    websiteHostname = new URL(websiteSource).hostname.replace(/^www\./, '');
  } catch {
    websiteHostname = websiteSource;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-20 w-full">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-neutral-800/80 bg-neutral-950/60 w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors py-1 touch-target-44"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to directory</span>
          </button>

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500">
            <Link to="/" className="hover:text-neutral-300 transition-colors py-1">Home</Link>
            <ChevronRight className="h-3 w-3 text-neutral-600" />
            <Link to="/" className="hover:text-neutral-300 transition-colors py-1">Tools</Link>
            <ChevronRight className="h-3 w-3 text-neutral-600" />
            <span className="text-neutral-200 font-medium truncate max-w-[180px]">{tool.name}</span>
          </nav>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header Section: Stacked on mobile (<768px), Horizontal on desktop (>=768px) */}
        <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-7 md:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#6E56CF]/10 blur-[90px]" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
              {/* Tool Icon */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={iconSource}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      tool.name
                    )}&background=18181b&color=fff&size=160`;
                  }}
                />
              </div>

              {/* Title, Verified Tag, Pricing Pill, Category Badge */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {tool.name}
                  </h1>

                  {tool.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#6E56CF]/15 border border-[#6E56CF]/30 px-2.5 py-0.5 text-xs font-semibold text-[#8E78E6] shrink-0">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </span>
                  )}

                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0 ${getPricingBadgeClass(
                      tool.pricing
                    )}`}
                  >
                    {tool.pricing}
                  </span>

                  {tool.category && (
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium border border-neutral-800 bg-neutral-900/60 text-neutral-300 shrink-0">
                      {tool.category}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
                  {displayTagline}
                </p>

                {/* Rating & Reviews summary */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <RatingStars rating={tool.rating} size="sm" />
                  <span className="font-bold text-white">{tool.rating.toFixed(1)}</span>
                  <span className="text-neutral-500">({tool.reviewsCount || 0} reviews)</span>
                </div>
              </div>
            </div>

            {/* External "Visit Website" Button & Quick Actions */}
            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-800">
              {websiteSource && websiteSource !== '#' && (
                <a
                  href={websiteSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black hover:bg-neutral-200 px-5 py-3 md:py-2.5 text-xs font-bold transition-all shadow-sm min-h-[44px]"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => toggleBookmark(tool)}
                className={`p-3 md:p-2.5 rounded-xl border transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  isSaved
                    ? 'bg-[#6E56CF]/20 border-[#6E56CF]/40 text-[#8E78E6]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save bookmark'}
                aria-label={isSaved ? 'Remove bookmark' : 'Bookmark this tool'}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="p-3 md:p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Share tool"
                aria-label="Share tool"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Detail Content Grid: 1 col on mobile/tablet, 2 cols (2:1 ratio) on desktop (lg:grid-cols-3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Left Main Column (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Full Overview Paragraph */}
            <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-[#6E56CF]" />
                <span>Overview</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {displayFullDescription}
              </p>
            </section>

            {/* Key Features Checklist */}
            {tool.features && tool.features.length > 0 && (
              <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[#6E56CF]" />
                  <span>Key Features</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tool.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3 sm:p-3.5 text-xs text-neutral-200"
                    >
                      <Check className="h-4 w-4 text-[#8E78E6] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ideal Use Cases */}
            {tool.useCases && tool.useCases.length > 0 && (
              <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 text-[#6E56CF]" />
                  <span>Ideal Use Cases</span>
                </h2>
                <div className="space-y-2.5">
                  {tool.useCases.map((useCase, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-3 sm:p-3.5 text-xs text-neutral-300"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6E56CF]/20 text-[10px] font-bold text-[#8E78E6]">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{useCase}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Community Reviews Section */}
            <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6 space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-base font-bold text-white">Community Reviews</h2>
                  <p className="text-xs text-neutral-400">
                    Real user ratings and experiences with {tool.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#6E56CF] hover:bg-[#7D67D9] px-4 py-2.5 sm:py-2 text-xs font-semibold text-white transition-all shadow-glow-sm min-h-[40px]"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* Review Cards List */}
              <div className="space-y-3">
                {tool.reviews && tool.reviews.length > 0 ? (
                  tool.reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
                ) : (
                  <div className="text-center py-8 text-xs text-neutral-500">
                    No community reviews yet. Be the first to share your experience!
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column / Sticky Sidebar (lg:col-span-1 lg:sticky lg:top-24) */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Quick Specs Card */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#6E56CF]" />
                <span>Quick Specs</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* Pricing Model */}
                <div className="flex items-center justify-between py-2 border-b border-neutral-800/80">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    Pricing Model
                  </span>
                  <span className="text-neutral-200 font-semibold">{tool.pricing}</span>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between py-2 border-b border-neutral-800/80">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    Category
                  </span>
                  <span className="text-neutral-200 font-medium">{tool.category}</span>
                </div>

                {/* Community Rating */}
                <div className="flex items-center justify-between py-2 border-b border-neutral-800/80">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-400" />
                    Community Rating
                  </span>
                  <span className="text-neutral-200 font-semibold">
                    ★ {tool.rating.toFixed(1)} / 5.0
                  </span>
                </div>

                {/* Release / Added Date */}
                <div className="flex items-center justify-between py-2 border-b border-neutral-800/80">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Indexed Date
                  </span>
                  <span className="text-neutral-300">{addedDate}</span>
                </div>

                {/* Verification */}
                <div className="flex items-center justify-between py-2 border-b border-neutral-800/80">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-[#8E78E6]" />
                    Verification
                  </span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    Verified AI Tool
                  </span>
                </div>

                {/* Website URL */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    Website URL
                  </span>
                  {websiteSource && websiteSource !== '#' ? (
                    <a
                      href={websiteSource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8E78E6] hover:underline truncate max-w-[150px] font-medium"
                    >
                      {websiteHostname}
                    </a>
                  ) : (
                    <span className="text-neutral-500">N/A</span>
                  )}
                </div>
              </div>
            </div>

            {/* Related Tools Card */}
            {relatedTools.length > 0 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#6E56CF]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Related {tool.category} Tools
                  </h3>
                </div>

                <div className="space-y-3">
                  {relatedTools.map((relTool) => (
                    <ToolCard key={relTool.id} tool={relTool} viewMode="grid" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        toolName={tool.name}
        toolSlug={tool.slug || tool.id}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};
