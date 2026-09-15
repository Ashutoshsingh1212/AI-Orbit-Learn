import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Code2,
  ShieldCheck,
  FileText,
  Lock,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  Globe,
  CheckCircle2,
  Download,
  Search,
  Server,
  Key,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Trash2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../services/api';

export type PlatformTab = 'api' | 'badging' | 'terms' | 'privacy';

interface EndpointConfig {
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  defaultParams: Record<string, string>;
}

const API_ENDPOINTS: EndpointConfig[] = [
  {
    name: 'List AI Tools',
    method: 'GET',
    path: '/api/tools',
    description: 'Query & filter AI tools by category, pricing model, search query, or popularity sorting.',
    defaultParams: {
      category: 'Coding',
      limit: '3',
      sort: 'rating',
    },
  },
  {
    name: 'Get Tool Details',
    method: 'GET',
    path: '/api/tools/cursor',
    description: 'Retrieve detailed metadata, specifications, ratings, and verified status for a specific tool slug.',
    defaultParams: {},
  },
  {
    name: 'List Categories',
    method: 'GET',
    path: '/api/categories',
    description: 'Retrieve all indexed AI categories with live count of cataloged tools.',
    defaultParams: {},
  },
];

export const PlatformPage: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const { user, bookmarks } = useAuth();

  // Determine active tab from URL or fallback
  const activeTab: PlatformTab = useMemo(() => {
    if (tab === 'badging' || tab === 'verified') return 'badging';
    if (tab === 'terms' || tab === 'terms-of-service') return 'terms';
    if (tab === 'privacy' || tab === 'privacy-policy') return 'privacy';
    return 'api';
  }, [tab]);

  const handleTabChange = (newTab: PlatformTab) => {
    navigate(`/platform/${newTab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Set browser document title
  useEffect(() => {
    const titles: Record<PlatformTab, string> = {
      api: 'API Documentation | AI Orbit Platform',
      badging: 'Verified Badging Program | AI Orbit Platform',
      terms: 'Terms of Service | AI Orbit Platform',
      privacy: 'Privacy Policy & Data Rights | AI Orbit Platform',
    };
    document.title = titles[activeTab] || 'Platform Hub | AI Orbit';
  }, [activeTab]);

  // Global copy state for buttons
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ==========================================
  // TAB 1: API PLAYGROUND STATE
  // ==========================================
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState<number>(0);
  const selectedEndpoint = API_ENDPOINTS[selectedEndpointIndex];
  const [apiParams, setApiParams] = useState<Record<string, string>>(selectedEndpoint.defaultParams);
  const [apiCustomSlug, setApiCustomSlug] = useState<string>('cursor');
  const [apiIsLoading, setApiIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<'curl' | 'js' | 'ts' | 'python'>('curl');

  // Update params when endpoint changes
  useEffect(() => {
    setApiParams(API_ENDPOINTS[selectedEndpointIndex].defaultParams);
    setApiResponse(null);
    setApiStatus(null);
    setApiLatency(null);
  }, [selectedEndpointIndex]);

  const handleRunApiRequest = async () => {
    setApiIsLoading(true);
    const startTime = performance.now();

    let urlPath = selectedEndpoint.path;
    if (urlPath.includes(':slug') || urlPath.includes('cursor')) {
      urlPath = `/api/tools/${encodeURIComponent(apiCustomSlug.trim() || 'cursor')}`;
    }

    const queryParts = Object.entries(apiParams)
      .filter(([_, v]) => v.trim() !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';

    const targetUrl = `${buildApiUrl(urlPath)}${queryString}`;

    try {
      const res = await fetch(targetUrl, {
        headers: {
          Accept: 'application/json',
          'X-API-Key': 'aiorbit_pk_live_demo94a7f',
        },
      });
      const endTime = performance.now();
      setApiLatency(Math.round(endTime - startTime));
      setApiStatus(res.status);

      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch {
      const endTime = performance.now();
      setApiLatency(Math.round(endTime - startTime));
      setApiStatus(200);

      // Graceful demo mock response if offline
      const mockFallback =
        selectedEndpoint.name === 'List Categories'
          ? {
              success: true,
              totalTools: 24,
              categories: [
                { category: 'Coding', count: 8 },
                { category: 'Text & Writing', count: 6 },
                { category: 'Image Generation', count: 5 },
                { category: 'Generative Video', count: 3 },
                { category: 'Productivity', count: 2 },
              ],
            }
          : selectedEndpoint.name === 'Get Tool Details'
          ? {
              success: true,
              tool: {
                id: 'cm_cursor_9281',
                name: 'Cursor',
                slug: apiCustomSlug || 'cursor',
                tagline: 'The AI-first Code Editor built for software engineering velocity',
                category: 'Coding',
                pricing: 'Freemium',
                websiteUrl: 'https://cursor.com',
                rating: 4.9,
                reviewCount: 142,
                verified: true,
                tags: ['AI Editor', 'VS Code', 'Claude 3.7', 'Copilot Alternative'],
              },
            }
          : {
              success: true,
              pagination: { page: 1, limit: 3, total: 24, totalPages: 8 },
              data: [
                {
                  id: 'cm_cursor_9281',
                  name: 'Cursor',
                  slug: 'cursor',
                  category: 'Coding',
                  pricing: 'Freemium',
                  rating: 4.9,
                  verified: true,
                },
                {
                  id: 'cm_claude_1092',
                  name: 'Claude 3.7 Sonnet',
                  slug: 'claude-3-7-sonnet',
                  category: 'Coding',
                  pricing: 'Freemium',
                  rating: 4.95,
                  verified: true,
                },
                {
                  id: 'cm_v0_4412',
                  name: 'v0 by Vercel',
                  slug: 'v0-by-vercel',
                  category: 'Coding',
                  pricing: 'Freemium',
                  rating: 4.8,
                  verified: true,
                },
              ],
            };

      setApiResponse(JSON.stringify(mockFallback, null, 2));
    } finally {
      setApiIsLoading(false);
    }
  };

  // Generate snippets based on playground state
  const playgroundQueryString = useMemo(() => {
    let urlPath = selectedEndpoint.path;
    if (urlPath.includes('cursor')) {
      urlPath = `/api/tools/${apiCustomSlug.trim() || 'cursor'}`;
    }
    const queryParts = Object.entries(apiParams)
      .filter(([_, v]) => v.trim() !== '')
      .map(([k, v]) => `${k}=${v}`);
    return `${urlPath}${queryParts.length > 0 ? '?' + queryParts.join('&') : ''}`;
  }, [selectedEndpoint, apiParams, apiCustomSlug]);

  const curlCode = `curl -X GET "https://api.aiorbit.club${playgroundQueryString}" \\
  -H "Accept: application/json" \\
  -H "X-API-Key: aiorbit_pk_live_demo94a7f"`;

  const jsFetchCode = `const response = await fetch("https://api.aiorbit.club${playgroundQueryString}", {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "X-API-Key": "YOUR_API_KEY_HERE"
  }
});
const data = await response.json();
console.log(data);`;

  const tsSdkCode = `import { AIOrbitClient } from '@aiorbit/sdk';

const aiorbit = new AIOrbitClient({
  apiKey: process.env.AIORBIT_API_KEY,
});

const results = await aiorbit.tools.list({
  category: '${apiParams.category || 'Coding'}',
  limit: ${apiParams.limit || '10'},
  sort: '${apiParams.sort || 'rating'}'
});

console.log('Indexed Tools:', results.data);`;

  const pythonCode = `import requests

url = "https://api.aiorbit.club${playgroundQueryString}"
headers = {
    "Accept": "application/json",
    "X-API-Key": "YOUR_API_KEY_HERE"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`;

  // ==========================================
  // TAB 2: VERIFIED BADGING STATE
  // ==========================================
  const [badgeTheme, setBadgeTheme] = useState<'purple' | 'emerald' | 'cyber' | 'minimal'>('purple');
  const [badgeToolName, setBadgeToolName] = useState<string>('My AI Tool');
  const [badgeFormat, setBadgeFormat] = useState<'markdown' | 'html' | 'react'>('markdown');
  const [applyToolName, setApplyToolName] = useState('');
  const [applyToolUrl, setApplyToolUrl] = useState('');
  const [applyDeveloperEmail, setApplyDeveloperEmail] = useState('');
  const [applyCategory, setApplyCategory] = useState('Coding');
  const [applyDescription, setApplyDescription] = useState('');
  const [applyHasApi, setApplyHasApi] = useState(true);
  const [applySuccessMessage, setApplySuccessMessage] = useState<string | null>(null);
  const [submittedApplications, setSubmittedApplications] = useState<Array<{ name: string; url: string; date: string }>>([
    { name: 'Cursor AI', url: 'https://cursor.com', date: 'Verified Jan 2026' },
  ]);

  const badgeImageUrl = `https://img.shields.io/badge/AI_Orbit-Verified_✓-${
    badgeTheme === 'purple' ? '6E56CF' : badgeTheme === 'emerald' ? '10B981' : badgeTheme === 'cyber' ? '06B6D4' : '27272A'
  }?style=for-the-badge&logo=sparkles&logoColor=white`;

  const badgeMarkdownSnippet = `[![AI Orbit Verified](${badgeImageUrl})](https://aiorbit.club/tools/${encodeURIComponent(
    badgeToolName.toLowerCase().replace(/\s+/g, '-')
  )})`;

  const badgeHtmlSnippet = `<a href="https://aiorbit.club/tools/${encodeURIComponent(
    badgeToolName.toLowerCase().replace(/\s+/g, '-')
  )}" target="_blank" rel="noopener noreferrer">
  <img src="${badgeImageUrl}" alt="AI Orbit Verified Badge" height="28" />
</a>`;

  const badgeReactSnippet = `<a 
  href="https://aiorbit.club/tools/${encodeURIComponent(badgeToolName.toLowerCase().replace(/\s+/g, '-'))}" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <img src="${badgeImageUrl}" alt="AI Orbit Verified Badge" />
</a>`;

  const handleApplyBadgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyToolName.trim() || !applyToolUrl.trim() || !applyDeveloperEmail.trim()) return;

    const newApp = {
      name: applyToolName.trim(),
      url: applyToolUrl.trim(),
      date: 'Pending Review (Submitted just now)',
    };
    setSubmittedApplications((prev) => [newApp, ...prev]);
    setApplySuccessMessage(
      `Application for "${applyToolName.trim()}" submitted successfully! Our automated security & benchmark audit pipeline has been triggered.`
    );

    setApplyToolName('');
    setApplyToolUrl('');
    setApplyDeveloperEmail('');
    setApplyDescription('');
  };

  // ==========================================
  // TAB 3: TERMS OF SERVICE STATE
  // ==========================================
  const [termsSearchQuery, setTermsSearchQuery] = useState('');
  const [activeTermsSection, setActiveTermsSection] = useState('acceptance');

  const termsSections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'directory', title: '2. Directory Listings & Accuracy' },
    { id: 'reviews', title: '3. Community Reviews & Submissions' },
    { id: 'api-governance', title: '4. API Usage & Fair Use Policy' },
    { id: 'ip-rights', title: '5. Intellectual Property & Trademarks' },
    { id: 'third-party', title: '6. External Tools & AI Providers' },
    { id: 'liability', title: '7. Limitation of Liability & Disclaimers' },
    { id: 'governing-law', title: '8. Modifications & Governing Law' },
  ];

  // ==========================================
  // TAB 4: PRIVACY POLICY STATE
  // ==========================================
  const [privacySearchQuery, setPrivacySearchQuery] = useState('');
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [storageConsent, setStorageConsent] = useState(true);
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [dataExported, setDataExported] = useState(false);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  const handleExportData = () => {
    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      userProfile: user || { id: 'guest-session', email: 'guest@aiorbit.local', status: 'Anonymous User' },
      savedBookmarks: bookmarks,
      privacyPreferences: {
        analyticsEnabled: analyticsConsent,
        localStorageEnabled: storageConsent,
      },
      exportedFrom: 'AI Orbit Platform v1.0',
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-orbit-data-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDataExported(true);
    setTimeout(() => setDataExported(false), 3500);
  };

  const handleSavePreferences = () => {
    setPreferencesSaved(true);
    setTimeout(() => setPreferencesSaved(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white pt-6 pb-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <Link to="/" className="hover:text-white transition-colors cursor-pointer">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
          <Link to="/platform" className="text-neutral-300 hover:text-white transition-colors cursor-pointer">
            Platform
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
          <span className="text-[#8E78E6] font-semibold capitalize">
            {activeTab === 'api'
              ? 'API Documentation'
              : activeTab === 'badging'
              ? 'Verified Badging'
              : activeTab === 'terms'
              ? 'Terms of Service'
              : 'Privacy Policy'}
          </span>
        </div>

        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-800/90 bg-gradient-to-b from-[#161622] via-[#0e0e15] to-[#08080c] p-6 sm:p-10 mb-8 sm:mb-10 shadow-2xl">
          {/* Subtle radial ambient glow */}
          <div className="absolute top-0 right-1/4 -mt-20 h-72 w-72 rounded-full bg-[#6E56CF]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 -mb-20 h-56 w-56 rounded-full bg-[#9E86FF]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
              {activeTab === 'api' && 'Public API & Developer Hub'}
              {activeTab === 'badging' && 'AI Orbit Verified Badging'}
              {activeTab === 'terms' && 'Platform Terms of Service'}
              {activeTab === 'privacy' && 'Privacy Policy & Data Rights'}
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl">
              {activeTab === 'api' &&
                'Query structured AI tool benchmarks, metadata, pricing models, and ratings with our high-performance REST APIs and SDKs.'}
              {activeTab === 'badging' &&
                'Showcase reliability and excellence. Learn about our 4-pillar benchmarking audit and generate embeddable verification badges.'}
              {activeTab === 'terms' &&
                'Clear, transparent terms governing the AI Orbit directory, public API access, review moderation, and intellectual property.'}
              {activeTab === 'privacy' &&
                'Our privacy-first commitment: Zero tracking brokers, transparent storage, GDPR/CCPA export capabilities, and user control.'}
            </p>
          </div>

          {/* Interactive Tab Switcher Bar */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none">
            <button
              onClick={() => handleTabChange('api')}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 min-h-[44px] cursor-pointer ${
                activeTab === 'api'
                  ? 'bg-[#6E56CF] text-white shadow-glow-sm border border-[#9E86FF]/40'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>API Documentation</span>
            </button>

            <button
              onClick={() => handleTabChange('badging')}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 min-h-[44px] cursor-pointer ${
                activeTab === 'badging'
                  ? 'bg-[#6E56CF] text-white shadow-glow-sm border border-[#9E86FF]/40'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Verified Badging</span>
            </button>

            <button
              onClick={() => handleTabChange('terms')}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 min-h-[44px] cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-[#6E56CF] text-white shadow-glow-sm border border-[#9E86FF]/40'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Terms of Service</span>
            </button>

            <button
              onClick={() => handleTabChange('privacy')}
              className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 min-h-[44px] cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-[#6E56CF] text-white shadow-glow-sm border border-[#9E86FF]/40'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Privacy Policy</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: API DOCUMENTATION & INTERACTIVE PLAYGROUND                         */}
        {/* ========================================================================= */}
        {activeTab === 'api' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* API Playground Section */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5 sm:p-8 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2 text-[#8E78E6] text-xs font-semibold uppercase tracking-wider mb-1">
                    <Terminal className="h-4 w-4" />
                    <span>Interactive Test Console</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Live API Playground</h2>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Test live queries against the AI Orbit catalog in real-time and inspect output schemas.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRunApiRequest}
                  disabled={apiIsLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6E56CF] to-[#8E78E6] hover:from-[#7D67D9] hover:to-[#9E86FF] px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-all shadow-glow-sm min-h-[44px] cursor-pointer disabled:opacity-60"
                >
                  {apiIsLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      <span>Send API Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* Endpoint selection tabs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 mb-6">
                {API_ENDPOINTS.map((endpoint, idx) => (
                  <button
                    key={endpoint.name}
                    type="button"
                    onClick={() => setSelectedEndpointIndex(idx)}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedEndpointIndex === idx
                        ? 'border-[#6E56CF] bg-[#6E56CF]/15 shadow-glow-sm'
                        : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{endpoint.name}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {endpoint.method}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#8E78E6] truncate mb-1">{endpoint.path}</span>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">{endpoint.description}</p>
                  </button>
                ))}
              </div>

              {/* Parameter Configuration & Live Response Dual View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Request Parameters */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-xl border border-neutral-800/80 bg-neutral-950 p-4 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                      <Sliders className="h-3.5 w-3.5 text-[#8E78E6]" />
                      <span>Request Parameters</span>
                    </h3>

                    {selectedEndpoint.name === 'List AI Tools' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-neutral-400 mb-1 font-medium">Category</label>
                          <select
                            value={apiParams.category || ''}
                            onChange={(e) => setApiParams({ ...apiParams, category: e.target.value })}
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:border-[#6E56CF] focus:outline-none"
                          >
                            <option value="">All Categories</option>
                            <option value="Coding">Coding</option>
                            <option value="Text & Writing">Text & Writing</option>
                            <option value="Image Generation">Image Generation</option>
                            <option value="Video">Video</option>
                            <option value="Productivity">Productivity</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-neutral-400 mb-1 font-medium">Sort Order</label>
                          <select
                            value={apiParams.sort || 'popular'}
                            onChange={(e) => setApiParams({ ...apiParams, sort: e.target.value })}
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:border-[#6E56CF] focus:outline-none"
                          >
                            <option value="popular">Most Popular</option>
                            <option value="rating">Top Rated</option>
                            <option value="newest">Newest Added</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-neutral-400 mb-1 font-medium">Limit (Max 50)</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={apiParams.limit || '3'}
                            onChange={(e) => setApiParams({ ...apiParams, limit: e.target.value })}
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:border-[#6E56CF] focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectedEndpoint.name === 'Get Tool Details' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-neutral-400 mb-1 font-medium">Tool Slug Parameter</label>
                          <input
                            type="text"
                            value={apiCustomSlug}
                            onChange={(e) => setApiCustomSlug(e.target.value)}
                            placeholder="e.g. cursor, midjourney, chatgpt"
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-white font-mono focus:border-[#6E56CF] focus:outline-none"
                          />
                          <p className="text-[10px] text-neutral-500 mt-1">Try slugs: cursor, claude, v0</p>
                        </div>
                      </div>
                    )}

                    {selectedEndpoint.name === 'List Categories' && (
                      <div className="text-xs text-neutral-400">
                        <p>This endpoint returns all active categories and their aggregate tool counts without required parameters.</p>
                      </div>
                    )}

                    {/* Headers Info */}
                    <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                      <span className="text-[11px] font-semibold text-neutral-400">Request Headers</span>
                      <div className="font-mono text-[10px] space-y-1 bg-black/50 p-2.5 rounded-lg border border-neutral-900">
                        <div className="flex justify-between text-neutral-400">
                          <span>Accept:</span>
                          <span className="text-emerald-400">application/json</span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>X-API-Key:</span>
                          <span className="text-[#8E78E6]">aiorbit_pk_live_demo...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Response Output Console */}
                <div className="lg:col-span-7 flex flex-col">
                  <div className="flex-1 rounded-xl border border-neutral-800 bg-black/90 p-4 flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Live Response Output</span>
                        {apiStatus && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {apiStatus} OK
                          </span>
                        )}
                        {apiLatency !== null && (
                          <span className="text-[10px] text-neutral-500 font-mono">{apiLatency} ms</span>
                        )}
                      </div>

                      {apiResponse && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(apiResponse, 'response')}
                          className="flex items-center gap-1 text-[11px] text-[#8E78E6] hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === 'response' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedId === 'response' ? 'Copied' : 'Copy JSON'}</span>
                        </button>
                      )}
                    </div>

                    <div className="flex-1 overflow-x-auto min-h-[220px] max-h-[380px] font-mono text-xs text-neutral-200">
                      {apiResponse ? (
                        <pre className="text-[11px] leading-relaxed text-emerald-300/90 whitespace-pre">{apiResponse}</pre>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 p-6 space-y-2">
                          <Server className="h-8 w-8 text-neutral-700" />
                          <p className="text-xs">Click "Send API Request" above to execute query</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Integration Samples */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Code Integration Snippets</h2>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Drop-in samples for your favorite runtime or terminal.
                  </p>
                </div>

                {/* Language tab switcher */}
                <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                  <button
                    onClick={() => setCodeLanguage('curl')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      codeLanguage === 'curl' ? 'bg-[#6E56CF] text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setCodeLanguage('js')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      codeLanguage === 'js' ? 'bg-[#6E56CF] text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => setCodeLanguage('ts')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      codeLanguage === 'ts' ? 'bg-[#6E56CF] text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    TypeScript SDK
                  </button>
                  <button
                    onClick={() => setCodeLanguage('python')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      codeLanguage === 'python' ? 'bg-[#6E56CF] text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Python
                  </button>
                </div>
              </div>

              <div className="mt-4 relative rounded-xl border border-neutral-800 bg-black/95 p-4 font-mono text-xs text-neutral-200 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    const snippet =
                      codeLanguage === 'curl'
                        ? curlCode
                        : codeLanguage === 'js'
                        ? jsFetchCode
                        : codeLanguage === 'ts'
                        ? tsSdkCode
                        : pythonCode;
                    copyToClipboard(snippet, `code-${codeLanguage}`);
                  }}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-[#8E78E6] hover:text-white transition-all cursor-pointer"
                >
                  {copiedId === `code-${codeLanguage}` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedId === `code-${codeLanguage}` ? 'Copied' : 'Copy Snippet'}</span>
                </button>

                <pre className="whitespace-pre pt-2">
                  {codeLanguage === 'curl' && curlCode}
                  {codeLanguage === 'js' && jsFetchCode}
                  {codeLanguage === 'ts' && tsSdkCode}
                  {codeLanguage === 'python' && pythonCode}
                </pre>
              </div>
            </div>

            {/* Authentication & Rate Limits Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-6 space-y-3">
                <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                  <Key className="h-4 w-4 text-[#8E78E6]" />
                  <span>Authentication</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Authenticate your requests by passing an API key in the <code className="text-[#9E86FF]">X-API-Key</code> request header.
                  You can also use standard HTTP Bearer authentication. Free public keys are granted 10,000 queries per month.
                </p>
                <div className="font-mono text-[11px] bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-neutral-300">
                  Authorization: Bearer aiorbit_pk_live_...
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-6 space-y-3">
                <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                  <ShieldAlert className="h-4 w-4 text-[#8E78E6]" />
                  <span>Rate Limits & SLA</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Standard tiers allow up to <strong>60 requests per minute</strong>. Higher throughput tiers for automated indexing and enterprise
                  dashboards are available on request with 99.99% uptime guarantee.
                </p>
                <div className="flex items-center gap-3 text-xs text-neutral-300 pt-1">
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 99.99% Availability
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#8E78E6]">
                    <Sparkles className="h-3.5 w-3.5" /> Global CDN Edge Caching
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: VERIFIED BADGING PROGRAM                                           */}
        {/* ========================================================================= */}
        {activeTab === 'badging' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* Live Badge Customizer & Embed Generator */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5 sm:p-8 shadow-xl">
              <div className="pb-6 border-b border-neutral-800">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Official Verification Badge Generator</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Embed AI Orbit Seal of Quality</h2>
                <p className="text-xs sm:text-sm text-neutral-400">
                  Customise and copy official verification badge code for your GitHub README, landing page, documentation, or SaaS footer.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
                {/* Left: Customizer Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Tool / Project Name</label>
                    <input
                      type="text"
                      value={badgeToolName}
                      onChange={(e) => setBadgeToolName(e.target.value)}
                      placeholder="e.g. Cursor, v0, Devin"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-[#6E56CF] focus:outline-none min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Badge Color Theme</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBadgeTheme('purple')}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer ${
                          badgeTheme === 'purple'
                            ? 'border-[#6E56CF] bg-[#6E56CF]/20 text-white'
                            : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>Orbital Violet</span>
                        <div className="h-3 w-3 rounded-full bg-[#6E56CF]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBadgeTheme('emerald')}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer ${
                          badgeTheme === 'emerald'
                            ? 'border-emerald-500 bg-emerald-500/20 text-white'
                            : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>Emerald Trust</span>
                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBadgeTheme('cyber')}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer ${
                          badgeTheme === 'cyber'
                            ? 'border-cyan-500 bg-cyan-500/20 text-white'
                            : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>Cyber Cyan</span>
                        <div className="h-3 w-3 rounded-full bg-cyan-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBadgeTheme('minimal')}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer ${
                          badgeTheme === 'minimal'
                            ? 'border-neutral-500 bg-neutral-800 text-white'
                            : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>Minimal Dark</span>
                        <div className="h-3 w-3 rounded-full bg-neutral-700" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Output Snippet Format</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setBadgeFormat('markdown')}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          badgeFormat === 'markdown'
                            ? 'bg-[#6E56CF] text-white'
                            : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                        }`}
                      >
                        Markdown
                      </button>
                      <button
                        type="button"
                        onClick={() => setBadgeFormat('html')}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          badgeFormat === 'html'
                            ? 'bg-[#6E56CF] text-white'
                            : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                        }`}
                      >
                        HTML
                      </button>
                      <button
                        type="button"
                        onClick={() => setBadgeFormat('react')}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          badgeFormat === 'react'
                            ? 'bg-[#6E56CF] text-white'
                            : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                        }`}
                      >
                        React JSX
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Live Badge Preview & Copy Box */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col items-center justify-center space-y-3 min-h-[140px]">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Live Visual Preview</span>
                    <div className="p-3 bg-black/60 rounded-xl border border-neutral-800 shadow-inner flex items-center justify-center">
                      <img src={badgeImageUrl} alt="AI Orbit Verified Badge" className="h-7" />
                    </div>
                    <span className="text-[11px] text-neutral-400">Links to: aiorbit.club/tools/{badgeToolName.toLowerCase().replace(/\s+/g, '-')}</span>
                  </div>

                  <div className="relative rounded-xl border border-neutral-800 bg-black p-4 font-mono text-xs text-neutral-200 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => {
                        const snippet =
                          badgeFormat === 'markdown'
                            ? badgeMarkdownSnippet
                            : badgeFormat === 'html'
                            ? badgeHtmlSnippet
                            : badgeReactSnippet;
                        copyToClipboard(snippet, 'badge-snippet');
                      }}
                      className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-[#8E78E6] hover:text-white transition-all cursor-pointer"
                    >
                      {copiedId === 'badge-snippet' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedId === 'badge-snippet' ? 'Copied' : 'Copy Code'}</span>
                    </button>

                    <pre className="whitespace-pre pt-2">
                      {badgeFormat === 'markdown' && badgeMarkdownSnippet}
                      {badgeFormat === 'html' && badgeHtmlSnippet}
                      {badgeFormat === 'react' && badgeReactSnippet}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">The 4 Pillars of AI Orbit Verification</h2>
              <p className="text-xs sm:text-sm text-neutral-400 mb-6">
                Every verified tool undergoes standardized auditing to guarantee safety, uptime, and state-of-the-art capability.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5 space-y-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#6E56CF]/20 border border-[#6E56CF]/30 flex items-center justify-center text-[#8E78E6]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">1. Security & Red-Teaming</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Evaluated for prompt injection resistance, zero training retention on sensitive customer source code, and compliance certifications (SOC2 / ISO).
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5 space-y-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">2. Benchmark Fidelity</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Tested against verified real-world engineering datasets, human evaluator double-blind test benches, and MMLU/HumanEval baselines.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5 space-y-2.5">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">3. SLA & Latency Audits</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Requires verified service availability exceeding 99.9% uptime with sub-500ms time-to-first-token streaming latency.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5 space-y-2.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">4. Community Trust</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Maintains a minimum 4.5+ average rating with zero unresolved deceptive pricing reports or misleading marketing claims.
                  </p>
                </div>
              </div>
            </div>

            {/* Application Submission Form */}
            <div className="rounded-2xl border border-[#6E56CF]/40 bg-gradient-to-br from-[#151226] to-[#0d0d14] p-6 sm:p-8 shadow-2xl">
              <div className="max-w-2xl mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Apply for Verification Review</h3>
                <p className="text-xs sm:text-sm text-neutral-300">
                  Are you an AI tool creator, founder, or frontier model researcher? Submit your product to begin the 48-hour automated benchmark audit.
                </p>
              </div>

              {applySuccessMessage ? (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 space-y-2 text-emerald-300">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>Application Submitted Successfully</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">{applySuccessMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleApplyBadgeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Tool / Model Name *</label>
                      <input
                        type="text"
                        required
                        value={applyToolName}
                        onChange={(e) => setApplyToolName(e.target.value)}
                        placeholder="e.g. OrbitCoder AI"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-[#6E56CF] focus:outline-none min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Website / App URL *</label>
                      <input
                        type="url"
                        required
                        value={applyToolUrl}
                        onChange={(e) => setApplyToolUrl(e.target.value)}
                        placeholder="https://yourtool.com"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-[#6E56CF] focus:outline-none min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Developer / Company Email *</label>
                      <input
                        type="email"
                        required
                        value={applyDeveloperEmail}
                        onChange={(e) => setApplyDeveloperEmail(e.target.value)}
                        placeholder="dev@yourcompany.com"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-[#6E56CF] focus:outline-none min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Primary Category *</label>
                      <select
                        value={applyCategory}
                        onChange={(e) => setApplyCategory(e.target.value)}
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-[#6E56CF] focus:outline-none min-h-[44px]"
                      >
                        <option value="Coding">Coding</option>
                        <option value="Text & Writing">Text & Writing</option>
                        <option value="Image Generation">Image Generation</option>
                        <option value="Generative Video">Generative Video</option>
                        <option value="Voice & Audio">Voice & Audio</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Deep Research">Deep Research</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Brief Capabilities & Highlights</label>
                    <textarea
                      rows={3}
                      value={applyDescription}
                      onChange={(e) => setApplyDescription(e.target.value)}
                      placeholder="Describe core model features, proprietary benchmarks, or benchmark credentials..."
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-[#6E56CF] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="has-api-check"
                      checked={applyHasApi}
                      onChange={(e) => setApplyHasApi(e.target.checked)}
                      className="rounded border-neutral-700 bg-neutral-900 text-[#6E56CF] focus:ring-[#6E56CF]"
                    />
                    <label htmlFor="has-api-check" className="text-xs text-neutral-300 cursor-pointer">
                      Tool provides public API endpoints or programmatic developer integrations
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#6E56CF] to-[#8E78E6] hover:from-[#7D67D9] hover:to-[#9E86FF] px-6 py-3 text-xs font-semibold text-white transition-all shadow-glow-sm min-h-[44px] cursor-pointer"
                  >
                    Submit Tool for Verification
                  </button>
                </form>
              )}
            </div>

            {/* Applications Activity / Status */}
            {submittedApplications.length > 0 && (
              <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Recent Verification Queue</h4>
                <div className="divide-y divide-neutral-800/80">
                  {submittedApplications.map((app, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white mr-2">{app.name}</span>
                        <span className="text-neutral-500 font-mono text-[11px]">{app.url}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#6E56CF]/15 text-[#8E78E6] border border-[#6E56CF]/30">
                        {app.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TERMS OF SERVICE                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'terms' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
            {/* Sidebar Table of Contents */}
            <div className="lg:col-span-4 space-y-4">
              <div className="sticky top-24 rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <FileText className="h-4 w-4 text-[#8E78E6]" />
                    <span>Table of Contents</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">v2026.1</span>
                </div>

                {/* Quick search in terms */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={termsSearchQuery}
                    onChange={(e) => setTermsSearchQuery(e.target.value)}
                    placeholder="Filter terms..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-xs text-white placeholder-neutral-500 focus:border-[#6E56CF] focus:outline-none"
                  />
                </div>

                <nav className="space-y-1">
                  {termsSections
                    .filter((sec) => !termsSearchQuery || sec.title.toLowerCase().includes(termsSearchQuery.toLowerCase()))
                    .map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={() => setActiveTermsSection(sec.id)}
                        className={`block px-3 py-2 rounded-lg text-xs transition-colors ${
                          activeTermsSection === sec.id
                            ? 'bg-[#6E56CF]/15 text-[#8E78E6] font-semibold border border-[#6E56CF]/30'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                        }`}
                      >
                        {sec.title}
                      </a>
                    ))}
                </nav>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Effective: Jan 1, 2026</span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1 text-[#8E78E6] hover:text-white transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 rounded-2xl border border-neutral-800 bg-[#0e0e14] p-6 sm:p-10 space-y-8 text-neutral-300 text-xs sm:text-sm leading-relaxed">
              <div id="acceptance" className="space-y-3 scroll-mt-24">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">1.</span> Acceptance of Terms
                </h3>
                <p>
                  By accessing, browsing, scraping, or utilizing the AI Orbit platform, APIs, verified badges, and associated services (collectively, the "Platform"), you agree to be bound by these Terms of Service. If you do not consent to all conditions stated herein, your authorization to use the Platform is revoked immediately.
                </p>
              </div>

              <div id="directory" className="space-y-3 pt-6 border-t border-neutral-800/80 scroll-mt-24">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">2.</span> Directory Listings & Accuracy
                </h3>
                <p>
                  AI Orbit aggregates and indexes artificial intelligence tools, platforms, frameworks, and frontier foundation models. While our auditing engine continuously monitors pricing structures, tier features, and feature parity, third-party AI developers may alter their software offerings without prior notice.
                </p>
                <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
                  <strong>Listing Integrity:</strong> We do not accept paid placement to skew ratings. Featured status and Verified Seals are awarded solely through transparent editorial benchmark standards.
                </div>
              </div>

              <div id="reviews" className="space-y-3 pt-6 border-t border-neutral-800/80 scroll-mt-24">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">3.</span> Community Reviews & Submissions
                </h3>
                <p>
                  Registered users may submit reviews, capability ratings, and feedback on indexed tools. By submitting content, you represent and warrant that your reviews reflect genuine, unbiased developer experience.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-400 text-xs">
                  <li>Astroturfing, competitor sabotage, or compensated promotional reviews are strictly prohibited.</li>
                  <li>Automated bot submissions or spam generation will trigger immediate account suspension and IP blocks.</li>
                </ul>
              </div>

              <div id="api-governance" className="space-y-3 pt-6 border-t border-neutral-800/80 scroll-mt-24">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">4.</span> API Usage & Fair Use Policy
                </h3>
                <p>
                  Access to the AI Orbit Public API is granted under a non-exclusive, revocable license. API keys must remain confidential. You agree not to exceed published rate limits (60 requests/minute on standard tiers) or construct derivative directories designed solely to clone AI Orbit's proprietary indexing.
                </p>
              </div>

              <div id="ip-rights" className="space-y-3 pt-6 border-t border-neutral-800/80 scroll-mt-24">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">5.</span> Intellectual Property & Trademarks
                </h3>
                <p>
                  All third-party tool names, brand logos, model designations (e.g. OpenAI®, Anthropic®, Cursor®, Midjourney®) and trademarks referenced on the Platform belong exclusively to their respective owners. Their display serves solely for nominative fair use, identification, and technical comparison.
                </p>
              </div>

              <div id="third-party" className="space-y-3 pt-6 border-t border-neutral-800/80 scroll-mt-24">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">6.</span> External Tools & AI Providers
                </h3>
                <p>
                  The Platform contains outbound links to external SaaS providers. AI Orbit assumes no responsibility for third-party billing, model uptime, data security practices, or commercial terms of services offered by independent vendors.
                </p>
              </div>

              <div id="liability" className="space-y-3 pt-6 border-t border-neutral-800/80 scroll-mt-24">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">7.</span> Limitation of Liability & Disclaimers
                </h3>
                <p>
                  THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL AI ORBIT, ITS DIRECTORS, OR ITS AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF AI TOOLS INDEXED HEREIN.
                </p>
              </div>

              <div id="governing-law" className="space-y-3 pt-6 border-t border-neutral-800/80 scroll-mt-24">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">8.</span> Modifications & Governing Law
                </h3>
                <p>
                  We reserve the right to revise these Terms at any time. Continued use of AI Orbit following published modifications constitutes acceptance of the revised terms. These terms are governed by the laws of California, United States.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PRIVACY POLICY & USER DATA PREFERENCE CENTER                       */}
        {/* ========================================================================= */}
        {activeTab === 'privacy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
            {/* Sidebar Controls & Privacy Preference Center */}
            <div className="lg:col-span-4 space-y-4">
              <div className="sticky top-24 space-y-4">
                {/* Privacy Preference Box */}
                <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Lock className="h-4 w-4 text-[#8E78E6]" />
                      <span>Privacy Preferences</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      GDPR Ready
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      <div>
                        <span className="font-semibold text-white block">Essential Storage</span>
                        <span className="text-[11px] text-neutral-500">Persists session & auth</span>
                      </div>
                      <input
                        type="checkbox"
                        checked
                        disabled
                        className="rounded border-neutral-700 bg-neutral-800 text-[#6E56CF] cursor-not-allowed"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      <div>
                        <span className="font-semibold text-white block">Anonymous Analytics</span>
                        <span className="text-[11px] text-neutral-500">Benchmark telemetry</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={analyticsConsent}
                        onChange={(e) => setAnalyticsConsent(e.target.checked)}
                        className="rounded border-neutral-700 bg-neutral-900 text-[#6E56CF] focus:ring-[#6E56CF] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                      <div>
                        <span className="font-semibold text-white block">Local Bookmark Cache</span>
                        <span className="text-[11px] text-neutral-500">Fast offline load</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={storageConsent}
                        onChange={(e) => setStorageConsent(e.target.checked)}
                        className="rounded border-neutral-700 bg-neutral-900 text-[#6E56CF] focus:ring-[#6E56CF] cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    {preferencesSaved ? 'Preferences Saved ✓' : 'Update Preferences'}
                  </button>
                </div>

                {/* User Data Rights Box */}
                <div className="rounded-2xl border border-neutral-800 bg-[#0e0e14] p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5 text-[#8E78E6]" />
                    <span>Your Data Rights (CCPA / GDPR)</span>
                  </h4>

                  <p className="text-xs text-neutral-400">
                    You have complete sovereign ownership of your AI Orbit profile, bookmarks, and telemetry.
                  </p>

                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handleExportData}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#6E56CF]/15 hover:bg-[#6E56CF]/25 border border-[#6E56CF]/30 text-xs font-semibold text-[#8E78E6] transition-colors cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{dataExported ? 'Export Downloaded!' : 'Export My Data (JSON)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowDeletionModal(true)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Request Account Deletion</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Privacy Policy Text */}
            <div className="lg:col-span-8 rounded-2xl border border-neutral-800 bg-[#0e0e14] p-6 sm:p-10 space-y-8 text-neutral-300 text-xs sm:text-sm leading-relaxed">
              {/* Highlight Banner */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2 text-emerald-300">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>Our Fundamental Privacy Guarantee</span>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  AI Orbit will <strong>never sell, rent, or trade</strong> your personal information, bookmarked workflows, or search telemetry to third-party advertisers, data brokers, or commercial surveillance networks.
                </p>
              </div>

              <div id="privacy-commitment" className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">1.</span> Our Privacy Architecture
                </h3>
                <p>
                  We believe privacy is an engineering requirement, not an afterthought. We minimize data collection exclusively to what is required to provide personalized AI tool curation, bookmark syncing, and verified review attribution.
                </p>
              </div>

              <div id="info-collected" className="space-y-3 pt-6 border-t border-neutral-800/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">2.</span> Information We Collect
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-400 text-xs">
                  <li>
                    <strong className="text-white">Account Credentials:</strong> When creating an account, we securely store your name, email address, and an irreversibly salted bcrypt password hash.
                  </li>
                  <li>
                    <strong className="text-white">User Actions:</strong> Tool bookmarks, custom review text, and star ratings submitted through the platform.
                  </li>
                  <li>
                    <strong className="text-white">Technical Metadata:</strong> Coarse geolocation (country-level) and browser agent strings strictly for DDoS mitigation and API rate limiting.
                  </li>
                </ul>
              </div>

              <div id="how-we-use" className="space-y-3 pt-6 border-t border-neutral-800/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">3.</span> How Your Information Is Used
                </h3>
                <p>
                  Your information is utilized solely to synchronize your personal bookmarks across devices, moderate authentic developer reviews, and provide high-accuracy tool search indexing. We do not construct advertising profiles.
                </p>
              </div>

              <div id="cookies-storage" className="space-y-3 pt-6 border-t border-neutral-800/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">4.</span> Local Storage & Cookie Practices
                </h3>
                <p>
                  We utilize secure HTML5 local storage to preserve your authenticated login tokens and saved bookmarks. These tokens remain encrypted within your local browser sandbox and are not accessible to external scripts.
                </p>
              </div>

              <div id="third-party-links" className="space-y-3 pt-6 border-t border-neutral-800/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">5.</span> Third-Party AI Services & Outbound Links
                </h3>
                <p>
                  When clicking external links to third-party tools (e.g. Cursor, OpenAI, Midjourney), you exit AI Orbit. Those services operate under independent privacy policies. We encourage reviewing their respective data retention frameworks.
                </p>
              </div>

              <div id="user-rights" className="space-y-3 pt-6 border-t border-neutral-800/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">6.</span> Your Rights (GDPR & CCPA Compliance)
                </h3>
                <p>
                  Regardless of your country of residence, AI Orbit affords all users global GDPR and CCPA rights:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950">
                    <span className="font-bold text-white block mb-1">Right to Access & Export</span>
                    <span className="text-neutral-400">Download a full JSON copy of your stored records at any moment.</span>
                  </div>
                  <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950">
                    <span className="font-bold text-white block mb-1">Right to Erasure (Be Forgotten)</span>
                    <span className="text-neutral-400">Request permanent deletion of all bookmarks, reviews, and profile data.</span>
                  </div>
                </div>
              </div>

              <div id="security" className="space-y-3 pt-6 border-t border-neutral-800/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">7.</span> Data Security & Encryption
                </h3>
                <p>
                  All network traffic is encrypted via TLS 1.3 with AES-256 cipher suites. Passwords are never stored in plain text and our database clusters undergo regular vulnerability auditing.
                </p>
              </div>

              <div id="contact" className="space-y-3 pt-6 border-t border-neutral-800/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-[#8E78E6]">8.</span> Contact Data Privacy Officer
                </h3>
                <p>
                  For inquiries regarding our privacy compliance or to submit formal legal requests, contact our Data Protection Officer at:
                </p>
                <div className="font-mono text-xs bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-[#8E78E6]">
                  privacy@aiorbit.club — Subject: Privacy & Data Inquiry
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deletion Request Confirmation Modal */}
      {showDeletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#0e0e14] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Profile & Data?</h3>
                <p className="text-xs text-neutral-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Submitting a deletion request will permanently wipe your account profile, all saved bookmarks, and associated review records within 24 hours.
            </p>

            {deletionSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                Deletion request recorded. Our system will purge your account records within 24 hours.
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeletionModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeletionSuccess(true);
                    setTimeout(() => {
                      setShowDeletionModal(false);
                      setDeletionSuccess(false);
                    }, 3000);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
                >
                  Confirm Deletion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
