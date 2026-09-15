import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bookmark, Menu, X, Sparkles, User as UserIcon, LogOut, ChevronRight, Search } from 'lucide-react';
import { AiOrbitLogo } from './AiOrbitLogo';

export const Navbar: React.FC = () => {
  const { user, bookmarks, setIsBookmarksOpen, setIsAuthModalOpen, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'All Tools', href: '/' },
    { name: 'Featured', href: '/?view=featured' },
    { name: 'Coding', href: '/?category=Coding' },
    { name: 'Writing', href: '/?category=' + encodeURIComponent('Text & Writing') },
    { name: 'Image Gen', href: '/?category=' + encodeURIComponent('Image Generation') },
    { name: 'Platform', href: '/platform' },
  ];

  const handleSearchClick = () => {
    if (location.pathname !== '/' && location.pathname !== '/tools') {
      navigate('/');
    }
    setTimeout(() => {
      const searchInput = document.getElementById('search-tools-input') as HTMLInputElement | null;
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileSearchQuery.trim()) return;
    setMobileMenuOpen(false);
    navigate(`/?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-black/95 backdrop-blur-md">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 group shrink-0 py-1" aria-label="AIORBIT Home">
            <AiOrbitLogo iconSize={30} textSize="text-sm sm:text-base" showBadge={true} />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs font-semibold uppercase tracking-wider">
          {navLinks.map((link) => {
            const isActive =
              (link.href === '/' && (location.pathname === '/' || location.pathname === '/tools') && !location.search) ||
              (link.href.includes('?') && location.search === link.href.slice(1));

            return (
              <Link
                key={link.name}
                to={link.href}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6E56CF] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (Search Trigger, Bookmarks & Auth) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-2.5 sm:px-3 py-2 text-xs text-neutral-400 hover:text-white hover:border-neutral-700 hover:bg-neutral-900 transition-all min-h-[38px] sm:min-h-[36px]"
            title="Search AI Tools"
            aria-label="Search tools"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[11px]">Search</span>
            <kbd className="hidden lg:inline-block rounded border border-neutral-800 bg-neutral-950 px-1 text-[9px] font-mono text-neutral-500">
              ⌘K
            </kbd>
          </button>

          {/* Saved Bookmarks Button */}
          <button
            type="button"
            onClick={() => setIsBookmarksOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-2.5 sm:px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-700 hover:bg-neutral-900 transition-all min-h-[38px] sm:min-h-[36px]"
            title="View saved tools"
            aria-label="Saved tools"
          >
            <Bookmark className="h-3.5 w-3.5 text-[#6E56CF]" />
            <span className="hidden sm:inline">Saved</span>
            {bookmarks.length > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#6E56CF] px-1 text-[10px] font-bold text-white">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* User Profile or Login */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 p-1 pr-2 text-xs font-medium text-white hover:border-neutral-700 transition-all min-h-[38px]"
                aria-label="User menu"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="max-w-[70px] sm:max-w-[100px] truncate hidden sm:inline">{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-800 bg-neutral-950 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsBookmarksOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-[#6E56CF]" />
                    My Bookmarks ({bookmarks.length})
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-[#6E56CF] hover:bg-[#7D67D9] px-3 sm:px-4 py-2 text-xs font-semibold text-white transition-all shadow-glow-sm min-h-[38px]"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span className="text-[11px] sm:text-xs">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-black/98 px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile In-Drawer Search Input */}
          <form onSubmit={handleMobileSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              placeholder="Search tools & models..."
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-white placeholder:text-neutral-500 focus:border-[#6E56CF] focus:outline-none"
            />
          </form>

          {/* Navigation Links with Min 44px Touch Targets */}
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 min-h-[44px] text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
              >
                <span>{link.name}</span>
                <ChevronRight className="h-4 w-4 text-neutral-600" />
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-500">AI Orbit Ecosystem</span>
            <div className="flex items-center gap-1 text-[#8E78E6]">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-semibold">Curated Index</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
