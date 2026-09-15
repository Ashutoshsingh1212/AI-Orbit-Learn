import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { PlatformModal, type PlatformTab } from './PlatformModal';
import { AiOrbitLogo } from './AiOrbitLogo';

export const Footer: React.FC = () => {
  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [platformTab, setPlatformTab] = useState<PlatformTab>('api');
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPlatformModal = (tab: PlatformTab) => {
    setPlatformTab(tab);
    setPlatformModalOpen(true);
  };

  return (
    <>
      <footer className="w-full border-t border-[#1c1c22] bg-black text-white pt-10 sm:pt-12 pb-8 mt-16 sm:mt-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-16 pb-10 sm:pb-12 border-b border-[#1c1c22]">
            {/* Brand info */}
            <div className="max-w-sm">
              <div className="mb-3">
                <AiOrbitLogo iconSize={28} textSize="text-base sm:text-lg" />
              </div>
              <p className="text-sm font-medium text-zinc-300 mb-2">The Home of Everything AI.</p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Discover, compare, and explore the frontier AI tools, models, and systems shaping the global intelligence ecosystem.
              </p>
            </div>

            {/* Quick links columns */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {/* Explore Column */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Explore</h3>
                <ul className="space-y-2.5 text-xs text-zinc-400">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?category=Coding')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Coding
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?category=' + encodeURIComponent('Text & Writing'))}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Writing
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?category=' + encodeURIComponent('Image Generation'))}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Image & Vision
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?category=Video')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Generative Video
                    </button>
                  </li>
                </ul>
              </div>

              {/* Categories Column */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Categories</h3>
                <ul className="space-y-2.5 text-xs text-zinc-400">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?category=Audio')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Voice & Audio
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?category=Productivity')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Productivity
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?category=' + encodeURIComponent('Marketing Ops'))}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Marketing Ops
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?category=' + encodeURIComponent('Deep Research'))}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Deep Research
                    </button>
                  </li>
                </ul>
              </div>

              {/* Directory Column */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Directory</h3>
                <ul className="space-y-2.5 text-xs text-zinc-400">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?sort=popular')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Most Popular
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?sort=rating')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Top Rated
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?pricing=Free')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Free AI Tools
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/tools?pricing=Freemium')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Freemium Tools
                    </button>
                  </li>
                </ul>
              </div>

              {/* Platform Column */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-3">Platform</h3>
                <ul className="space-y-2.5 text-xs text-zinc-400">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/platform/api')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      API Documentation
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/platform/badging')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Verified Badging
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/platform/terms')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavClick('/platform/privacy')}
                      className="hover:text-white transition-colors text-left cursor-pointer py-1 block"
                    >
                      Privacy Policy
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-500 text-center sm:text-left">
              © 2026 AI Orbit. Built for the modern generative era. All rights reserved.
            </p>

            <button
              onClick={scrollToTop}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-[#121216] text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all cursor-pointer touch-target-44"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Platform Documentation & Governance Modal (Available as fallback) */}
      <PlatformModal
        isOpen={platformModalOpen}
        initialTab={platformTab}
        onClose={() => setPlatformModalOpen(false)}
      />
    </>
  );
};
