import React from 'react';

interface SkeletonCardProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  viewMode = 'grid',
  count = 6,
}) => {
  if (viewMode === 'list') {
    return (
      <div className="space-y-3 sm:space-y-3.5 w-full" aria-busy="true" aria-label="Loading tools in list mode">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 rounded-2xl border border-neutral-800/80 bg-neutral-950 p-4 sm:p-4.5 animate-pulse w-full min-w-0"
          >
            <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
              {/* Logo square skeleton */}
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0" />

              {/* Text content skeleton */}
              <div className="space-y-2 flex-1 max-w-lg min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-28 sm:w-36 rounded bg-neutral-800" />
                  <div className="h-4 w-14 rounded-full bg-neutral-900 border border-neutral-800" />
                  <div className="h-4 w-12 rounded-full bg-neutral-900 border border-neutral-800" />
                </div>
                <div className="h-3 w-full max-w-md rounded bg-neutral-900" />
              </div>
            </div>

            {/* Right actions skeleton */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60 w-full sm:w-auto">
              <div className="h-4 w-16 sm:w-20 rounded bg-neutral-900" />
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-neutral-900" />
                <div className="h-9 w-14 rounded-xl bg-neutral-900" />
                <div className="h-9 w-20 rounded-xl bg-neutral-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
      aria-busy="true"
      aria-label="Loading tools in grid mode"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col justify-between h-[210px] rounded-2xl border border-neutral-800/80 bg-neutral-950 p-4.5 sm:p-5 animate-pulse w-full min-w-0"
        >
          <div>
            {/* Top header skeleton */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded bg-neutral-800" />
                  <div className="h-3 w-16 rounded-full bg-neutral-900" />
                </div>
              </div>
              <div className="h-8 w-8 rounded-xl bg-neutral-900" />
            </div>

            {/* Tagline skeleton */}
            <div className="space-y-2 mt-3">
              <div className="h-3 w-full rounded bg-neutral-900" />
              <div className="h-3 w-4/5 rounded bg-neutral-900" />
            </div>
          </div>

          {/* Bottom footer skeleton */}
          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-neutral-900" />
            <div className="flex items-center gap-2">
              <div className="h-5 w-14 rounded-full bg-neutral-900" />
              <div className="h-7 w-16 rounded-xl bg-neutral-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
