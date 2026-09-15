import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, Mail, Lock, User, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, loginAsDemo } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginAsDemo();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border border-[#232328] bg-[#101015] p-5 sm:p-6 shadow-2xl scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 rounded-xl p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors touch-target-44 flex items-center justify-center"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-5 sm:mb-6 pt-1">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#6E56CF] to-[#9E86FF] p-0.5 mb-3 shadow-glow-sm">
            <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-[#6E56CF]" />
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-white">
            {isRegisterMode ? 'Join AI Orbit' : 'Welcome to AI Orbit'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {isRegisterMode
              ? 'Create an account to save tools and contribute reviews'
              : 'Sign in to access your saved tools and write reviews'}
          </p>
        </div>

        {/* 1-Click Demo Login Button */}
        <button
          type="button"
          onClick={handleDemoClick}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#6E56CF]/40 bg-[#6E56CF]/15 px-4 py-3 text-xs font-semibold text-[#8E78E6] hover:bg-[#6E56CF]/25 hover:text-white transition-all shadow-glow-sm mb-4 min-h-[44px]"
        >
          <Sparkles className="h-4 w-4 text-[#8E78E6]" />
          <span>Quick Demo Login (1-Click Reviewer Access)</span>
        </button>

        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#232328]" />
          </div>
          <span className="relative bg-[#101015] px-3 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            or continue with email
          </span>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 h-4 w-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full h-11 sm:h-10 pl-9 pr-3 rounded-xl border border-[#232328] bg-[#0b0b0e] text-xs text-white placeholder:text-zinc-600 focus:border-[#6E56CF] focus:outline-none focus:ring-1 focus:ring-[#6E56CF]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 sm:h-10 pl-9 pr-3 rounded-xl border border-[#232328] bg-[#0b0b0e] text-xs text-white placeholder:text-zinc-600 focus:border-[#6E56CF] focus:outline-none focus:ring-1 focus:ring-[#6E56CF]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 sm:h-10 pl-9 pr-3 rounded-xl border border-[#232328] bg-[#0b0b0e] text-xs text-white placeholder:text-zinc-600 focus:border-[#6E56CF] focus:outline-none focus:ring-1 focus:ring-[#6E56CF]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs transition-all disabled:opacity-50 mt-2 min-h-[44px]"
          >
            {isSubmitting
              ? 'Processing...'
              : isRegisterMode
              ? 'Create Account'
              : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#202026] text-center">
          <p className="text-xs text-zinc-400">
            {isRegisterMode ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              className="text-[#8E78E6] font-semibold hover:underline py-1"
            >
              {isRegisterMode ? 'Sign In' : 'Create one now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
