import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-black text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-[#6E56CF] mb-6 shadow-glow-sm">
        <Sparkles className="h-8 w-8" />
      </div>

      <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono text-zinc-400 mb-3">
        404 ERROR
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Page or Tool Not Found
      </h1>

      <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-8 leading-relaxed">
        The AI tool or resource you’re looking for doesn’t exist, has been migrated, or the URL may be incorrect.
      </p>

      <Link
        to="/tools"
        className="flex items-center gap-2 rounded-xl bg-white text-black hover:bg-zinc-200 px-5 py-2.5 text-xs font-bold transition-all shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to AI Tools</span>
      </Link>
    </div>
  );
};
