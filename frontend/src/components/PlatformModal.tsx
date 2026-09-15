import React, { useState, useEffect } from 'react';
import {
  X,
  Code2,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Sparkles,
  Lock,
  Globe,
  Terminal,
} from 'lucide-react';

export type PlatformTab = 'api' | 'badging' | 'terms' | 'privacy';

interface PlatformModalProps {
  isOpen: boolean;
  initialTab?: PlatformTab;
  onClose: () => void;
}

export const PlatformModal: React.FC<PlatformModalProps> = ({
  isOpen,
  initialTab = 'api',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<PlatformTab>(initialTab);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [toolName, setToolName] = useState('');
  const [toolUrl, setToolUrl] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !toolUrl.trim()) return;
    setApplySuccess(true);
    setTimeout(() => {
      setToolName('');
      setToolUrl('');
      setApplySuccess(false);
    }, 4000);
  };

  const curlExample = `curl -X GET "https://api.aiorbit.club/api/tools?category=Coding&limit=5" \\
  -H "Accept: application/json" \\
  -H "X-API-Key: aiorbit_pk_live_94a7f28c"`;

  const tsExample = `import { AIOrbitClient } from '@aiorbit/sdk';

const client = new AIOrbitClient({
  apiKey: process.env.AIORBIT_API_KEY,
});

// Query verified frontier models & tools
const { data, pagination } = await client.tools.list({
  category: 'Coding',
  sort: 'rating',
  limit: 10,
});

console.log(\`Retrieved \${data.length} AI tools\`);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col rounded-2xl border border-neutral-800 bg-[#0d0d12] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-800/80 bg-neutral-950/80">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6E56CF]/20 border border-[#6E56CF]/30 text-[#8E78E6] shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">AI Orbit Platform</h2>
              <p className="text-[11px] sm:text-xs text-neutral-400 truncate">Developer docs, standards & governance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors touch-target-44 flex items-center justify-center shrink-0"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-neutral-800 bg-neutral-950/40 overflow-x-auto no-scrollbar scrollbar-none w-full min-w-0">
          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-3.5 text-xs font-semibold border-b-2 transition-all shrink-0 min-h-[44px] ${
              activeTab === 'api'
                ? 'border-[#6E56CF] text-white bg-[#6E56CF]/10 rounded-t-lg'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-[#8E78E6]" />
            <span>API Docs</span>
          </button>

          <button
            onClick={() => setActiveTab('badging')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-3.5 text-xs font-semibold border-b-2 transition-all shrink-0 min-h-[44px] ${
              activeTab === 'badging'
                ? 'border-[#6E56CF] text-white bg-[#6E56CF]/10 rounded-t-lg'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#8E78E6]" />
            <span>Verified Badging</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-3.5 text-xs font-semibold border-b-2 transition-all shrink-0 min-h-[44px] ${
              activeTab === 'terms'
                ? 'border-[#6E56CF] text-white bg-[#6E56CF]/10 rounded-t-lg'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-[#8E78E6]" />
            <span>Terms</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 py-3 px-3 sm:px-3.5 text-xs font-semibold border-b-2 transition-all shrink-0 min-h-[44px] ${
              activeTab === 'privacy'
                ? 'border-[#6E56CF] text-white bg-[#6E56CF]/10 rounded-t-lg'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Lock className="h-3.5 w-3.5 text-[#8E78E6]" />
            <span>Privacy</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm text-neutral-300 scrollbar-thin">
          {/* TAB 1: API DOCUMENTATION */}
          {activeTab === 'api' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">AI Orbit Public API (v1.0)</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Integrate structured AI model metadata, ratings, benchmark scores, and category indexes directly into your applications, IDE plugins, or workflow automations.
                </p>
              </div>

              {/* Endpoints Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Available Endpoints</h4>
                <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead className="border-b border-neutral-800 bg-white/[0.02] text-neutral-400 font-semibold">
                      <tr>
                        <th className="py-2.5 px-4">Method</th>
                        <th className="py-2.5 px-4">Endpoint</th>
                        <th className="py-2.5 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
                      <tr>
                        <td className="py-2.5 px-4 text-emerald-400 font-bold">GET</td>
                        <td className="py-2.5 px-4 text-white">/api/tools</td>
                        <td className="py-2.5 px-4 font-sans text-neutral-400">Query & filter tools (search, category, pricing, sort)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-emerald-400 font-bold">GET</td>
                        <td className="py-2.5 px-4 text-white">/api/tools/:slug</td>
                        <td className="py-2.5 px-4 font-sans text-neutral-400">Fetch tool details, reviews, and feature specs</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-emerald-400 font-bold">GET</td>
                        <td className="py-2.5 px-4 text-white">/api/categories</td>
                        <td className="py-2.5 px-4 font-sans text-neutral-400">List all categories with active tool counts</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 text-indigo-400 font-bold">POST</td>
                        <td className="py-2.5 px-4 text-white">/api/auth/register</td>
                        <td className="py-2.5 px-4 font-sans text-neutral-400">Register new user account for reviews & bookmarks</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Code Snippets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">cURL Request Example</h4>
                  <button
                    onClick={() => copyToClipboard(curlExample, 'curl')}
                    className="flex items-center gap-1.5 text-xs text-[#8E78E6] hover:text-[#9E86FF] transition-colors py-1 px-2 rounded-lg bg-neutral-900 border border-neutral-800"
                  >
                    {copiedCode === 'curl' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode === 'curl' ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-black/90 p-4 font-mono text-xs text-neutral-200 overflow-x-auto">
                  <pre className="whitespace-pre">{curlExample}</pre>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">TypeScript / Node.js SDK Example</h4>
                  <button
                    onClick={() => copyToClipboard(tsExample, 'ts')}
                    className="flex items-center gap-1.5 text-xs text-[#8E78E6] hover:text-[#9E86FF] transition-colors py-1 px-2 rounded-lg bg-neutral-900 border border-neutral-800"
                  >
                    {copiedCode === 'ts' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCode === 'ts' ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-black/90 p-4 font-mono text-xs text-neutral-200 overflow-x-auto">
                  <pre className="whitespace-pre">{tsExample}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERIFIED BADGING */}
          {activeTab === 'badging' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>AI Orbit Verified Seal of Quality</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Verified AI Badging Program</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  The AI Orbit Verified Badge signifies that an AI software system or frontier model has undergone systematic benchmarking, security evaluation, uptime auditing, and community validation.
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <ShieldCheck className="h-4 w-4 text-[#8E78E6]" />
                    <span>1. Security & Red-Teaming</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Evaluated for prompt injection resistance, data privacy controls, and adherence to zero-training-on-user-data policies.
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <CheckCircle2 className="h-4 w-4 text-[#8E78E6]" />
                    <span>2. Benchmark Consistency</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Independently tested against standard MMLU, HumanEval, and real-world developer pair-programming datasets.
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <Terminal className="h-4 w-4 text-[#8E78E6]" />
                    <span>3. SLA & Latency Audits</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Requires &gt;99.9% verified service availability with sub-500ms time-to-first-token inference metrics.
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <Globe className="h-4 w-4 text-[#8E78E6]" />
                    <span>4. Community Trust Rating</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Maintains a minimum 4.5+ average rating from verified engineering, research, and creative users.
                  </p>
                </div>
              </div>

              {/* Submit for Verification Box */}
              <div className="rounded-xl border border-[#6E56CF]/30 bg-[#6E56CF]/10 p-4 sm:p-5">
                <h4 className="text-sm font-bold text-white mb-2">Apply for Verification</h4>
                <p className="text-xs text-neutral-300 mb-4">
                  Are you an AI tool creator or model developer? Submit your product for verification review.
                </p>

                {applySuccess ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Application received! Our benchmark review team will evaluate your tool within 48 hours.</span>
                  </div>
                ) : (
                  <form onSubmit={handleApplyVerification} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Tool / Model Name"
                        value={toolName}
                        onChange={(e) => setToolName(e.target.value)}
                        required
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-[#6E56CF] focus:outline-none min-h-[44px]"
                      />
                      <input
                        type="url"
                        placeholder="Website or Documentation URL"
                        value={toolUrl}
                        onChange={(e) => setToolUrl(e.target.value)}
                        required
                        className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-[#6E56CF] focus:outline-none min-h-[44px]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#6E56CF] hover:bg-[#7D67D9] px-5 py-2.5 text-xs font-semibold text-white transition-all shadow-glow-sm min-h-[44px]"
                    >
                      Submit for Verification
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Terms of Service</h3>
                <p className="text-xs text-neutral-400">Effective Date: January 1, 2026</p>
              </div>

              <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-white mb-1">1. Acceptance of Terms</h4>
                  <p>
                    By accessing and using AI Orbit, you agree to comply with and be bound by these Terms of Service. If you do not agree, you should refrain from using our directory and associated APIs.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">2. Directory Listings & Accuracy</h4>
                  <p>
                    AI Orbit aggregates and indexes artificial intelligence tools, platforms, and models. While we endeavor to keep all pricing models, capabilities, and feature lists current, tool providers may update their offerings independently.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">3. User Reviews & Submissions</h4>
                  <p>
                    Users submitting reviews, ratings, or bookmarks must provide authentic, unbiased feedback. Commercial manipulation, automated spam reviews, or abusive language will result in immediate suspension.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">4. Intellectual Property</h4>
                  <p>
                    All product logos, brand names, and trademarks displayed within AI Orbit are the property of their respective owners. Their inclusion here is for descriptive identification and directory curation purposes.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">5. Limitation of Liability</h4>
                  <p>
                    AI Orbit is provided on an "as-is" and "as-available" basis. We are not liable for any service interruptions, pricing discrepancies, or outcomes resulting from the use of third-party AI software listed in our directory.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">Privacy Policy</h3>
                <p className="text-xs text-neutral-400">Last Updated: January 1, 2026</p>
              </div>

              <div className="space-y-4 text-xs text-neutral-300 leading-relaxed">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Our Core Privacy Commitment</span>
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-200/90">
                    AI Orbit will never sell, rent, or monetize your personal information or browsing history to third-party data brokers or advertising networks.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">1. Information We Collect</h4>
                  <p>
                    When creating an account, we store your name, email, and encrypted password hash to maintain your saved bookmarks and tool reviews. We do not collect telemetry from your third-party AI tool workflows.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">2. Local Storage & Authentication</h4>
                  <p>
                    We use secure browser local storage and session tokens strictly to persist your authenticated session and saved bookmarks across browser visits.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">3. Third-Party Links</h4>
                  <p>
                    Our directory links directly to official AI tool providers (e.g. OpenAI, Anthropic, Cursor, Midjourney). Please review their individual privacy policies when navigating to external websites.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">4. Your Rights (GDPR & CCPA)</h4>
                  <p>
                    You retain full ownership over your account data. You may request data export or complete deletion of your profile, bookmarks, and reviews at any time by contacting privacy@aiorbit.club.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-t border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>AI Orbit Directory</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors touch-target-44"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
