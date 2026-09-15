import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  mode?: 'grid' | 'list' | 'detail';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 8,
  mode = 'grid',
}) => {
  if (mode === 'detail') {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 animate-pulse space-y-6 sm:space-y-8">
        {/* Back breadcrumb */}
        <div className="h-4 w-32 rounded bg-neutral-900" />

        {/* Hero */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-8 flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-neutral-900 shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            <div className="h-7 sm:h-8 w-48 sm:w-64 rounded bg-neutral-900" />
            <div className="h-4 w-full max-w-xl rounded bg-neutral-900/70" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-20 rounded-full bg-neutral-900" />
              <div className="h-6 w-24 rounded-full bg-neutral-900" />
            </div>
          </div>
          <div className="h-11 w-full sm:w-36 rounded-xl bg-neutral-900 shrink-0" />
        </div>

        {/* Content columns */}
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
    );
  }

  if (mode === 'list') {
    return (
      <div className="space-y-3 sm:space-y-3.5 w-full" aria-busy="true" aria-label="Loading list">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 rounded-2xl border border-neutral-800/80 bg-neutral-950 p-4 sm:p-4.5 animate-pulse w-full min-w-0"
          >
            <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-neutral-900 shrink-0" />
              <div className="space-y-2 flex-1 max-w-md min-w-0">
                <div className="h-4 w-36 rounded bg-neutral-800" />
                <div className="h-3 w-full rounded bg-neutral-900/60" />
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60">
              <div className="h-6 w-16 rounded-md bg-neutral-900" />
              <div className="h-9 w-20 rounded-xl bg-neutral-800" />
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
      aria-label="Loading tools"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between h-[210px] rounded-2xl border border-neutral-800/80 bg-neutral-950 p-4.5 sm:p-5 animate-pulse w-full min-w-0"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-neutral-900 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded bg-neutral-800" />
                  <div className="h-3 w-16 rounded-full bg-neutral-900" />
                </div>
              </div>
              <div className="h-8 w-8 rounded-xl bg-neutral-900" />
            </div>

            <div className="space-y-2 mt-2">
              <div className="h-3 w-full rounded bg-neutral-900" />
              <div className="h-3 w-4/5 rounded bg-neutral-900" />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-neutral-900" />
            <div className="h-6 w-16 rounded-xl bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
};
