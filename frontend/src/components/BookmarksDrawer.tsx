import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, Bookmark, Trash2, ArrowUpRight } from 'lucide-react';

export const BookmarksDrawer: React.FC = () => {
  const { bookmarks, isBookmarksOpen, setIsBookmarksOpen, toggleBookmark, user, setIsAuthModalOpen } =
    useAuth();

  if (!isBookmarksOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-full sm:max-w-md flex-col border-l border-[#232328] bg-[#0e0e12] p-4 sm:p-6 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#202026]">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-[#6E56CF]" />
            <h3 className="text-sm font-bold text-white">Saved AI Tools</h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
              {bookmarks.length}
            </span>
          </div>

          <button
            onClick={() => setIsBookmarksOpen(false)}
            className="rounded-xl p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors touch-target-44 flex items-center justify-center"
            aria-label="Close bookmarks drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin">
          {!user ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Bookmark className="h-10 w-10 text-zinc-600 mb-3" />
              <p className="text-sm font-semibold text-white mb-1">Sign in to sync saved tools</p>
              <p className="text-xs text-zinc-400 mb-4 max-w-xs leading-relaxed">
                Log in to keep your personal bookmarks synced across all devices and sessions.
              </p>
              <button
                onClick={() => {
                  setIsBookmarksOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="rounded-xl bg-[#6E56CF] hover:bg-[#7D67D9] px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-glow-sm min-h-[44px]"
              >
                Sign In / Demo Login
              </button>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Bookmark className="h-10 w-10 text-zinc-600 mb-3" />
              <p className="text-sm font-semibold text-white mb-1">No saved tools yet</p>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                Click the bookmark icon on any tool card or detail page to collect your favorites here.
              </p>
            </div>
          ) : (
            bookmarks.map((tool) => (
              <div
                key={tool.id}
                className="group flex items-center justify-between gap-3 rounded-xl border border-[#202026] bg-[#121217] p-3 hover:border-zinc-700 transition-all w-full min-w-0"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={tool.iconUrl || tool.icon || ''}
                    alt={tool.name}
                    className="h-10 w-10 rounded-xl object-cover bg-neutral-900 shrink-0 border border-neutral-800"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        tool.name
                      )}&background=18181b&color=fff`;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/tools/${tool.slug || tool.id}`}
                      onClick={() => setIsBookmarksOpen(false)}
                      className="text-xs font-bold text-white hover:text-[#8E78E6] transition-colors truncate block"
                    >
                      {tool.name}
                    </Link>
                    <span className="text-[10px] text-neutral-400 truncate block">
                      {tool.category} · {tool.pricing}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/tools/${tool.slug || tool.id}`}
                    onClick={() => setIsBookmarksOpen(false)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors touch-target-44 flex items-center justify-center"
                    title="View tool"
                    aria-label={`View ${tool.name}`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => toggleBookmark(tool)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors touch-target-44 flex items-center justify-center"
                    title="Remove from saved"
                    aria-label={`Remove ${tool.name} from saved`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {user && bookmarks.length > 0 && (
          <div className="pt-4 border-t border-[#202026]">
            <p className="text-[11px] text-zinc-500 text-center">
              All bookmarks are synced with your cloud profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
