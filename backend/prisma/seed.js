"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    // Clean existing data
    await prisma.bookmark.deleteMany();
    await prisma.review.deleteMany();
    await prisma.tool.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    const passwordHash = await bcryptjs_1.default.hash('password123', 10);
    // 1. Create Users
    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Alex Rivera',
                email: 'alex@example.com',
                passwordHash,
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                role: 'USER',
            },
        }),
        prisma.user.create({
            data: {
                name: 'Sophia Chen',
                email: 'sophia@example.com',
                passwordHash,
                avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                role: 'USER',
            },
        }),
        prisma.user.create({
            data: {
                name: 'Marcus Vance',
                email: 'marcus@example.com',
                passwordHash,
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                role: 'USER',
            },
        }),
        prisma.user.create({
            data: {
                name: 'Elena Rostova',
                email: 'elena@example.com',
                passwordHash,
                avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                role: 'USER',
            },
        }),
        prisma.user.create({
            data: {
                name: 'David Kim',
                email: 'david@example.com',
                passwordHash,
                avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                role: 'USER',
            },
        }),
        prisma.user.create({
            data: {
                name: 'Demo Reviewer',
                email: 'demo@aiorbit.club',
                passwordHash,
                avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                role: 'ADMIN',
            },
        }),
    ]);
    const [alex, sophia, marcus, elena, david, demo] = users;
    // 2. Create Categories
    const categoriesData = [
        {
            name: 'Coding',
            slug: 'coding',
            description: 'AI code generation, pairing, bug fixing, and developer acceleration engines.',
            icon: 'Code',
        },
        {
            name: 'Writing',
            slug: 'writing',
            description: 'Long-form editorial, copywriting, tone correction, and summarization assistants.',
            icon: 'FileText',
        },
        {
            name: 'Image',
            slug: 'image',
            description: 'Diffusion models, concept art rendering, photorealistic imagery, and graphic design.',
            icon: 'Image',
        },
        {
            name: 'Video',
            slug: 'video',
            description: 'Generative video generation, timeline automation, VFX synthesis, and smart avatars.',
            icon: 'Video',
        },
        {
            name: 'Audio',
            slug: 'audio',
            description: 'Voice cloning, speech-to-text, sound generation, and music synthesis engines.',
            icon: 'Mic',
        },
        {
            name: 'Productivity',
            slug: 'productivity',
            description: 'Workspace automation, AI note-taking, semantic task orchestration, and calendar intelligence.',
            icon: 'Zap',
        },
        {
            name: 'Marketing',
            slug: 'marketing',
            description: 'Growth automation, conversion optimization, campaign drafting, and multi-channel SEO.',
            icon: 'TrendingUp',
        },
        {
            name: 'Research',
            slug: 'research',
            description: 'Academic paper synthesis, real-time citation analysis, and deep reasoning discovery.',
            icon: 'Compass',
        },
        {
            name: 'Education',
            slug: 'education',
            description: 'Personalized AI tutoring, curriculum generation, flashcards, and language acquisition.',
            icon: 'GraduationCap',
        },
    ];
    const categoryMap = {};
    for (const cat of categoriesData) {
        const created = await prisma.category.create({ data: cat });
        categoryMap[cat.slug] = created.id;
    }
    // 3. Create Tools
    const toolsData = [
        // CODING
        {
            name: 'Cursor',
            slug: 'cursor',
            description: 'The AI-first code editor designed for pair programming with frontier models.',
            longDescription: 'Cursor is an advanced fork of VS Code deeply integrated with frontier LLMs. It features multi-file editing with Composer, inline contextual predictions, instant codebase semantic indexing, and conversational terminal debugging. Engineers use Cursor to write, refactor, and migrate systems at unprecedented velocity.',
            logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://cursor.com',
            pricing: 'Freemium',
            pricingDetails: 'Free tier with limited fast requests. Pro at $20/month with unlimited Claude 3.5 & GPT-4o.',
            rating: 4.9,
            reviewCount: 342,
            viewsCount: 18400,
            bookmarkCount: 890,
            verified: true,
            trending: true,
            featured: true,
            platforms: 'MacOS, Windows, Linux',
            features: JSON.stringify([
                'Composer multi-file autonomous code edits',
                'Semantic codebase vector indexing',
                'Inline Copilot++ smart tab completions',
                'Interactive AI chat with direct workspace context',
                'Rules for AI project customization (.cursorrules)'
            ]),
            useCases: JSON.stringify([
                'Full-stack application scaffolding',
                'Refactoring legacy codebases across multiple files',
                'Automated test generation and lint diagnostics'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Hobby', price: '$0', period: 'forever', description: 'Basic completion & 50 fast requests', features: ['Standard completions', '2,000 slow requests/mo', 'Community support'] },
                { name: 'Pro', price: '$20', period: 'per month', popular: true, description: 'Power features for working engineers', features: ['500 fast premium requests/mo', 'Unlimited slow requests', 'Composer multi-file edit', 'Unlimited smart rewrites'] },
                { name: 'Business', price: '$40', period: 'per seat/mo', description: 'Enterprise security & team pooling', features: ['Centralized billing', 'Privacy mode enforced', 'Admin telemetry & SSO'] }
            ]),
            pros: JSON.stringify(['Flawless VS Code extension compatibility', 'Superb multi-file context tracking', 'Extremely low-latency tab completions']),
            cons: JSON.stringify(['Can exhaust fast tier quotas during heavy sprint weeks', 'Heavy memory consumption on massive repos']),
            categoryId: categoryMap['coding'],
        },
        {
            name: 'GitHub Copilot',
            slug: 'github-copilot',
            description: 'Your enterprise-grade AI pair programmer integrated into your preferred IDE.',
            longDescription: 'GitHub Copilot turns natural language prompts into coding suggestions across dozens of languages. Backed by OpenAI models and GitHub public repo intelligence, it offers chat assistance, automated pull request summaries, CLI commands, and security vulnerability detection.',
            logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://github.com/features/copilot',
            pricing: 'Paid',
            pricingDetails: 'Individual plans starting at $10/month or $100/year. 30-day free trial available.',
            rating: 4.7,
            reviewCount: 520,
            viewsCount: 22100,
            bookmarkCount: 640,
            verified: true,
            trending: false,
            featured: true,
            platforms: 'VS Code, JetBrains, Neovim, Visual Studio, CLI',
            features: JSON.stringify([
                'Real-time autocomplete suggestions',
                'Copilot Chat with IDE context awareness',
                'Pull request review summaries and unit test generator',
                'Copilot Workspace for issue-to-code execution',
                'Enterprise IP indemnification guarantee'
            ]),
            useCases: JSON.stringify([
                'Speeding up boilerplate API routing',
                'Writing repetitive unit test mocks',
                'Learning syntax in unfamiliar programming languages'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Individual', price: '$10', period: 'per month', description: 'For individual developers and hobbyists', features: ['Code autocompletion', 'Copilot Chat in IDE & CLI', 'Multi-model selector'] },
                { name: 'Business', price: '$19', period: 'per user/mo', popular: true, description: 'For teams needing centralized controls', features: ['Organizational policy management', 'IP indemnity', 'Content exclusion controls'] },
                { name: 'Enterprise', price: '$39', period: 'per user/mo', description: 'Tailored enterprise AI ecosystem', features: ['Custom knowledge bases', 'Copilot in GitHub.com docs', 'Executive audit logs'] }
            ]),
            pros: JSON.stringify(['Native integration with GitHub pull requests', 'Great enterprise compliance and security policies', 'Supports virtually every code editor']),
            cons: JSON.stringify(['Multi-file refactoring is slower than specialized editor forks', 'Context window can truncate large frameworks']),
            categoryId: categoryMap['coding'],
        },
        {
            name: 'Replit Agent',
            slug: 'replit-agent',
            description: 'An autonomous software engineer that builds and deploys complete web apps from prompts.',
            longDescription: 'Replit Agent takes high-level project descriptions and autonomously designs the database schema, frontend UI, backend services, and cloud hosting environment. It self-diagnoses runtime errors, installs npm/python packages, and provides instant sharing URLs.',
            logoUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://replit.com',
            pricing: 'Freemium',
            pricingDetails: 'Core workspace free; Replit Agent requires Replit Core membership starting at $15/month.',
            rating: 4.6,
            reviewCount: 215,
            viewsCount: 14200,
            bookmarkCount: 430,
            verified: true,
            trending: true,
            featured: false,
            platforms: 'Web Browser, Mobile iOS/Android',
            features: JSON.stringify([
                'End-to-end full-stack app construction from prompt',
                'Automated database provisioning (PostgreSQL)',
                'Iterative natural language refinement loop',
                'Instant one-click global production deployment',
                'Real-time collaborative multiplayer coding'
            ]),
            useCases: JSON.stringify([
                'Prototyping MVP web applications in under 15 minutes',
                'Building internal employee micro-tools and webhooks',
                'Rapid validation of startup concepts'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Starter', price: '$0', period: 'forever', description: 'Basic public Repls with shared compute', features: ['Unlimited public projects', 'Basic community AI', 'Shared CPU/RAM'] },
                { name: 'Core', price: '$15', period: 'per month', popular: true, description: 'Access to the autonomous Replit Agent', features: ['Replit Agent credits included', 'Private Repls', 'Persistent compute servers'] },
                { name: 'Teams', price: '$40', period: 'per member/mo', description: 'Team collaboration and shared workspaces', features: ['Shared team compute pools', 'SSO & role-based permissions', 'Priority model response'] }
            ]),
            pros: JSON.stringify(['Builds full-stack working apps without local dev environment', 'Instant cloud deployment', 'Multiplayer collaboration']),
            cons: JSON.stringify(['Complex custom enterprise architectures require manual override', 'Agent token consumption can add up']),
            categoryId: categoryMap['coding'],
        },
        {
            name: 'Phind',
            slug: 'phind',
            description: 'Search engine optimized for developers with deep code retrieval and synthesis.',
            longDescription: 'Phind is an intelligent answer engine designed for programmers. It combines high-speed web search over technical documentation with fine-tuned code models, returning exact code snippets, official API references, and runnable debugging solutions without ads or SEO spam.',
            logoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://phind.com',
            pricing: 'Freemium',
            pricingDetails: 'Generous free search with Phind-70B. Phind Pro is $20/month for frontier model access.',
            rating: 4.8,
            reviewCount: 180,
            viewsCount: 9800,
            bookmarkCount: 310,
            verified: false,
            trending: false,
            featured: false,
            platforms: 'Web Browser, VS Code Extension',
            features: JSON.stringify([
                'Technical web indexing targeted at Stack Overflow and official docs',
                'Custom 70B programming model with ultra-fast streaming',
                'VS Code extension with terminal auto-fix',
                'Deep research mode for complex algorithmic questions',
                'Code execution playground'
            ]),
            useCases: JSON.stringify([
                'Resolving obscure compiler and package dependency bugs',
                'Understanding bleeding-edge open source APIs with scarce docs',
                'Migrating syntax across library major version bumps'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: 'Fast developer search', features: ['Phind Model search', '500+ daily searches', 'Basic web citations'] },
                { name: 'Pro', price: '$20', period: 'per month', popular: true, description: 'Power developer tools', features: ['Claude 3.5 & GPT-4o access', 'Deep search reasoning passes', 'VS Code extension integration'] }
            ]),
            pros: JSON.stringify(['Extremely up-to-date documentation citations', 'Zero SEO fluff in search results', 'Fastest technical search response times']),
            cons: JSON.stringify(['Less versatile for creative, non-technical queries']),
            categoryId: categoryMap['coding'],
        },
        // WRITING
        {
            name: 'Claude',
            slug: 'claude',
            description: 'Anthropic’s conversational AI assistant known for nuanced reasoning, coding, and writing.',
            longDescription: 'Claude (powered by Claude 3.5 Sonnet and Opus) is renowned for its articulate, human-sounding tone, immense 200k context window, and exceptional reasoning capabilities. Its Artifacts interface allows users to run React widgets, interactive charts, and drafts side-by-side with conversation.',
            logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://claude.ai',
            pricing: 'Freemium',
            pricingDetails: 'Free access with daily quota limits. Claude Pro is $20/month with 5x higher usage and priority access.',
            rating: 4.9,
            reviewCount: 480,
            viewsCount: 26000,
            bookmarkCount: 1120,
            verified: true,
            trending: true,
            featured: true,
            platforms: 'Web Browser, iOS, Android, API',
            features: JSON.stringify([
                'Interactive Artifacts window for live React, HTML, and diagrams',
                'Industry-leading 200,000 token context window',
                'Natural, articulate tone with minimal robotic clichés',
                'Deep vision and document analysis (PDFs, spreadsheets, slides)',
                'Projects workspace for team knowledge sharing'
            ]),
            useCases: JSON.stringify([
                'Synthesizing 100-page financial reports or legal filings',
                'Writing compelling long-form technical blog posts and essays',
                'Interactive rapid prototyping with Artifacts'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: 'Standard access to Claude 3.5 Sonnet', features: ['Daily usage allowance', 'Access to web & mobile apps', 'Artifacts interactive preview'] },
                { name: 'Pro', price: '$20', period: 'per month', popular: true, description: '5x higher message quotas and priority access', features: ['Claude 3.5 Sonnet & Haiku models', 'Priority bandwidth during peak hours', 'Projects with file uploads'] },
                { name: 'Team', price: '$25', period: 'per user/mo', description: 'Collaborative workspaces for organizations', features: ['Centralized user admin', 'Shared project repositories', 'Expanded context controls'] }
            ]),
            pros: JSON.stringify(['Highest quality writing tone among all LLMs', 'Artifacts view changes frontend ideation', 'Exceptional nuanced reasoning']),
            cons: JSON.stringify(['Strict rate limits during peak worldwide usage on Pro', 'No live native web browsing engine']),
            categoryId: categoryMap['writing'],
        },
        {
            name: 'ChatGPT',
            slug: 'chatgpt',
            description: 'OpenAI’s flagship generative AI system for writing, coding, reasoning, and multimodal research.',
            longDescription: 'ChatGPT is the industry pioneer in generative artificial intelligence. Featuring GPT-4o and the OpenAI o1 reasoning family, ChatGPT supports Advanced Voice Mode, canvas document co-editing, Python code interpreter, and custom GPT app discovery.',
            logoUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://chatgpt.com',
            pricing: 'Freemium',
            pricingDetails: 'Free tier with GPT-4o mini; Plus is $20/month; Pro is $200/month for o1 power users.',
            rating: 4.8,
            reviewCount: 920,
            viewsCount: 38000,
            bookmarkCount: 1450,
            verified: true,
            trending: true,
            featured: true,
            platforms: 'Web, MacOS, Windows, iOS, Android',
            features: JSON.stringify([
                'OpenAI o1 and GPT-4o multimodal reasoning',
                'Real-time low-latency Advanced Voice Mode',
                'Canvas mode for granular text and code refinement',
                'Code Interpreter with sandbox Python environment',
                'Browse with Bing and custom GPT store ecosystem'
            ]),
            useCases: JSON.stringify([
                'Drafting executive communications and board memos',
                'Data analysis with uploaded Excel and CSV datasets',
                'Real-time voice practice and multilingual translation'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: 'Everyday assistance with standard models', features: ['GPT-4o mini unlimited', 'Limited GPT-4o access', 'Custom GPT store exploration'] },
                { name: 'Plus', price: '$20', period: 'per month', popular: true, description: 'Power intelligence for individuals', features: ['Unlimited GPT-4o access', 'OpenAI o1 reasoning previews', 'Advanced Voice Mode', 'Canvas editing'] },
                { name: 'Team', price: '$25', period: 'per user/mo', description: 'Secure workspace for collaborative teams', features: ['Admin console and usage data', 'Workspace GPTs sharing', 'Excludes data from model training'] }
            ]),
            pros: JSON.stringify(['Vast ecosystem of custom plugins and integrations', 'Advanced Voice Mode feels magical', 'Solid data analytics sandbox']),
            cons: JSON.stringify(['Can sound overly agreeable or robotic without custom instructions']),
            categoryId: categoryMap['writing'],
        },
        {
            name: 'Jasper',
            slug: 'jasper',
            description: 'AI marketing copilot built for enterprise brand voice, campaign creation, and content ops.',
            longDescription: 'Jasper is a dedicated generative platform for marketing teams. It enforces brand guidelines, tone of voice, style guides, and product catalog knowledge across blog articles, email cadences, social posts, and ad creative.',
            logoUrl: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://jasper.ai',
            pricing: 'Free Trial',
            pricingDetails: '7-day free trial; Creator plan from $39/month billed annually; Pro plan from $59/month.',
            rating: 4.5,
            reviewCount: 310,
            viewsCount: 11200,
            bookmarkCount: 390,
            verified: true,
            trending: false,
            featured: false,
            platforms: 'Web Browser, Chrome Extension',
            features: JSON.stringify([
                'Company Knowledge Base and brand voice enforcement',
                'End-to-end multi-channel campaign generator',
                'Built-in SEO mode with SurferSEO integration',
                'Over 50 battle-tested marketing copywriting templates',
                'Enterprise asset governance and plagiarism checker'
            ]),
            useCases: JSON.stringify([
                'Generating consistent ad copy variants for Meta & Google Ads',
                'Scaling corporate blog production with brand compliance',
                'Repurposing executive webinars into multi-part newsletters'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Creator', price: '$39', period: 'per month', description: 'For solo creators and freelancers', features: ['1 brand voice profile', '50 knowledge assets', 'SEO mode'] },
                { name: 'Pro', price: '$59', period: 'per seat/mo', popular: true, description: 'For small marketing departments', features: ['3 brand voices', 'Collaborative workspaces', 'AI image generation'] },
                { name: 'Business', price: 'Custom', period: 'annual contract', description: 'Full enterprise marketing suite', features: ['Unlimited brand voices', 'Custom API access', 'Dedicated account manager'] }
            ]),
            pros: JSON.stringify(['Maintains strict brand voice consistency', 'Strong SEO workflow integrations', 'Rich library of marketing-specific templates']),
            cons: JSON.stringify(['Significantly more expensive than raw foundation model access', 'Steep learning curve for casual users']),
            categoryId: categoryMap['writing'],
        },
        {
            name: 'Grammarly',
            slug: 'grammarly',
            description: 'AI communication assistant for real-time clarity, grammar, tone, and sentence rewriting.',
            longDescription: 'Grammarly works across thousands of apps—from Google Docs to Gmail, Slack, and Figma—delivering context-aware writing improvements. Its generative AI features offer tone adjustment, instant paragraph rewriting, and citation generation.',
            logoUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://grammarly.com',
            pricing: 'Freemium',
            pricingDetails: 'Generous free grammar & spelling checker; Premium at $12/month billed annually.',
            rating: 4.7,
            reviewCount: 780,
            viewsCount: 24500,
            bookmarkCount: 950,
            verified: true,
            trending: false,
            featured: false,
            platforms: 'MacOS, Windows, iOS, Android, Browser Extensions',
            features: JSON.stringify([
                'Real-time grammar, punctuation, and clarity corrections',
                'Tone detector and audience alignment metrics',
                'Contextual rewriting for brevity and impact',
                'Plagiarism scanner against billions of web pages',
                'Generative prompts for instant email draft replies'
            ]),
            useCases: JSON.stringify([
                'Polishing client-facing proposals and corporate emails',
                'Checking academic manuscripts for tone and clarity',
                'Preventing embarrassing typos in Slack and LinkedIn'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: 'Essential spelling & grammar suggestions', features: ['Grammar & punctuation', 'Conciseness detection', '100 AI prompts/mo'] },
                { name: 'Premium', price: '$12', period: 'per month', popular: true, description: 'Advanced clarity and tone rewrites', features: ['Full-sentence rewrites', 'Tone adjustments', 'Vocabulary ideas', '1,000 AI prompts/mo'] },
                { name: 'Business', price: '$15', period: 'per member/mo', description: 'Company-wide brand and style guides', features: ['Centralized style guide', 'Brand tones', 'Analytics dashboard', 'Priority support'] }
            ]),
            pros: JSON.stringify(['Works natively anywhere you type on desktop or web', 'Subtle, unobtrusive suggestions', 'Excellent tone analyzer']),
            cons: JSON.stringify(['Sometimes suggests overly conservative or dry phrasing']),
            categoryId: categoryMap['writing'],
        },
        // IMAGE
        {
            name: 'Midjourney',
            slug: 'midjourney',
            description: 'The benchmark generative text-to-image platform known for photorealism and artistic mastery.',
            longDescription: 'Midjourney creates breathtaking visuals from natural language prompts. Renowned for its aesthetic coherence, lighting realism, and cinematic composition, it is favored by film directors, art directors, product concept designers, and digital illustrators worldwide.',
            logoUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://midjourney.com',
            pricing: 'Paid',
            pricingDetails: 'Plans start from $10/month (Basic) to $30/month (Standard with unlimited Relax GPU hours).',
            rating: 4.9,
            reviewCount: 840,
            viewsCount: 31200,
            bookmarkCount: 1600,
            verified: true,
            trending: true,
            featured: true,
            platforms: 'Web Canvas, Discord',
            features: JSON.stringify([
                'State-of-the-art visual aesthetics and coherent lighting',
                'Web editor with inpainting, outpainting, and pan controls',
                'Character reference (--cref) and style reference (--sref) parity',
                'High-resolution upscaling and aspect ratio customization',
                'Extensive community gallery and prompt exploration'
            ]),
            useCases: JSON.stringify([
                'Concept art and moodboards for film and video games',
                'Editorial magazine covers and photorealistic product shots',
                'Architectural visualization and interior design ideation'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Basic', price: '$10', period: 'per month', description: '3.3 hours of Fast GPU time per month', features: ['General commercial terms', 'Access to member gallery', 'Optional credit top-ups'] },
                { name: 'Standard', price: '$30', period: 'per month', popular: true, description: '15 hours Fast GPU + unlimited Relax GPU', features: ['Unlimited Relax GPU generations', 'Direct web creation access', 'Community gallery voting'] },
                { name: 'Pro', price: '$60', period: 'per month', description: 'Stealth generation mode for professionals', features: ['Stealth image creation', '30 hours Fast GPU time', 'Concurrent fast jobs pool'] }
            ]),
            pros: JSON.stringify(['Unmatched visual composition and artistic finesse', 'Style and character consistency parameters', 'Dedicated web canvas']),
            cons: JSON.stringify(['No free trial available', 'Discord workflow still confusing for non-technical users']),
            categoryId: categoryMap['image'],
        },
        {
            name: 'Leonardo AI',
            slug: 'leonardo-ai',
            description: 'Generative production platform tailored for digital artists, game assets, and graphic design.',
            longDescription: 'Leonardo AI combines custom-trained diffusion models with production workflows like real-time canvas editing, texture generation for 3D meshes, and brand asset generation. It gives creators fine-grained control over prompt adherence, negative prompts, and pose guidance.',
            logoUrl: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://leonardo.ai',
            pricing: 'Freemium',
            pricingDetails: 'Free plan with 150 daily generation tokens; Apprentice plan at $10/month.',
            rating: 4.7,
            reviewCount: 310,
            viewsCount: 16800,
            bookmarkCount: 620,
            verified: true,
            trending: false,
            featured: false,
            platforms: 'Web Browser, iOS App',
            features: JSON.stringify([
                'Real-time interactive canvas with instant sketch-to-image feedback',
                'Custom fine-tuned community model fine-tuning studio',
                '3D texture synthesis and normal map export',
                'Motion tool for turning stills into animated micro-clips',
                'ControlNet edge, depth, and character pose locks'
            ]),
            useCases: JSON.stringify([
                'Game development sprite generation and texture design',
                'Fantasy character model design with consistent outfits',
                'Graphic design background elements and vector icons'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: '150 tokens replenished every 24 hours', features: ['Standard generation queue', 'Up to 30 upscale actions', 'Community model access'] },
                { name: 'Apprentice', price: '$10', period: 'per month', popular: true, description: '8,500 fast tokens monthly', features: ['Fast generation priority', 'Unlimited relax queue', 'Private generation option'] },
                { name: 'Artisan', price: '$24', period: 'per month', description: '25,000 tokens for professional studio workflows', features: ['Custom model training allowance', 'Concurrent rendering jobs', 'High-res batch generation'] }
            ]),
            pros: JSON.stringify(['Generous daily free tier allowance', 'ControlNet pose and composition guidance', 'Interactive real-time canvas']),
            cons: JSON.stringify(['UI can feel overwhelming with dozens of model sliders']),
            categoryId: categoryMap['image'],
        },
        {
            name: 'Canva Magic Studio',
            slug: 'canva-magic-studio',
            description: 'Integrated AI design suite inside Canva for instant layouts, background removal, and asset creation.',
            longDescription: 'Canva Magic Studio embeds AI directly into Canva’s drag-and-drop design ecosystem. Users can generate vector illustrations, resize designs across 10 social channels with one click, erase unwanted photo objects, and generate video scripts with matching layouts.',
            logoUrl: 'https://images.unsplash.com/photo-1572044160445-b32c96c4293f?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://canva.com',
            pricing: 'Freemium',
            pricingDetails: 'Free access to core editing tools; Canva Pro is $15/month or $120/year.',
            rating: 4.8,
            reviewCount: 650,
            viewsCount: 29000,
            bookmarkCount: 880,
            verified: true,
            trending: false,
            featured: true,
            platforms: 'Web, Windows, MacOS, iOS, Android',
            features: JSON.stringify([
                'Magic Switch for instant layout reformatting across all sizes',
                'Magic Eraser and one-click background remover',
                'Magic Media text-to-image and text-to-video generation',
                'Brand Kit automated color palette and font application',
                'Magic Write AI assistant for presentations and documents'
            ]),
            useCases: JSON.stringify([
                'Social media marketing banners and carousel graphics',
                'Pitch decks and investor presentation design',
                'Quick product photo touchups and promo flyers'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: 'Essential drag-and-drop design tools', features: ['Basic Magic Write access', '250,000+ templates', '5GB cloud storage'] },
                { name: 'Pro', price: '$15', period: 'per month', popular: true, description: 'Full Magic Studio suite for creators', features: ['Unlimited background remover', 'Magic Switch reformatting', '100M+ stock assets', '1TB cloud storage'] },
                { name: 'Teams', price: '$30', period: 'per month (for 3)', description: 'Collaborative brand governance', features: ['Brand controls & workflows', 'Centralized billing', 'Team design asset pooling'] }
            ]),
            pros: JSON.stringify(['Most accessible design tool in the world', 'Incredible template library', 'Seamless one-click background remover']),
            cons: JSON.stringify(['Less granular control over raw diffusion parameters than Midjourney']),
            categoryId: categoryMap['image'],
        },
        // VIDEO
        {
            name: 'Runway Gen-3 Alpha',
            slug: 'runway-gen3',
            description: 'Frontier generative video and cinematic synthesis model for filmmakers and studios.',
            longDescription: 'Runway Gen-3 Alpha is a foundational video generation model capable of creating high-fidelity, photorealistic video clips from text prompts, static images, or existing footage. It features camera director controls (pan, zoom, orbit), motion brush painting, and multi-motion tracking.',
            logoUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://runwayml.com',
            pricing: 'Freemium',
            pricingDetails: 'Free plan with 125 credits; Standard plan at $12/month; Pro plan at $28/month.',
            rating: 4.8,
            reviewCount: 390,
            viewsCount: 23100,
            bookmarkCount: 970,
            verified: true,
            trending: true,
            featured: true,
            platforms: 'Web Browser, iOS App',
            features: JSON.stringify([
                'Gen-3 Alpha photorealistic video generation (5-10 second clips)',
                'Camera control (pan, tilt, pedestal, roll, orbit)',
                'Motion brush for animating specific zones in still photos',
                'Director Mode with precise cinematic lens parameters',
                'Lip sync video synthesis for multilingual dialogue'
            ]),
            useCases: JSON.stringify([
                'B-roll generation for advertisements and documentary films',
                'Visual effects pre-visualization and title sequences',
                'Social video creative concepts that would be cost-prohibitive to film'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Basic', price: '$0', period: 'forever', description: '125 one-time credits to explore', features: ['Gen-1 and Gen-2 access', 'Standard video resolution', 'Watermarked exports'] },
                { name: 'Standard', price: '$12', period: 'per month', popular: true, description: '625 credits monthly + credit topups', features: ['Gen-3 Alpha access', 'Remove watermarks', 'Upscale to 4K', 'Unlimited relax generations'] },
                { name: 'Pro', price: '$28', period: 'per month', description: '2250 monthly credits for active creators', features: ['High priority generation queue', '500GB asset storage', 'Custom AI voice generator'] }
            ]),
            pros: JSON.stringify(['Leading cinematic motion coherence', 'Granular camera motion control', 'Powerful motion brush']),
            cons: JSON.stringify(['High credit consumption for 10-second high-res renders', 'Occasional hand or limb warping']),
            categoryId: categoryMap['video'],
        },
        {
            name: 'Descript',
            slug: 'descript',
            description: 'Video and podcast editing as easy as editing a text document.',
            longDescription: 'Descript reimagines audio and video editing by transcribing footage into an editable text document. Delete a sentence in the transcript, and the corresponding video clip disappears automatically. Features include AI voice regeneration (Overdub), filler word removal, and Studio Sound enhancement.',
            logoUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://descript.com',
            pricing: 'Freemium',
            pricingDetails: 'Free plan with 1 transcription hour/month; Creator plan at $12/month.',
            rating: 4.7,
            reviewCount: 410,
            viewsCount: 15400,
            bookmarkCount: 520,
            verified: true,
            trending: false,
            featured: false,
            platforms: 'MacOS, Windows, Web Browser',
            features: JSON.stringify([
                'Text-based timeline video and audio editing',
                'One-click filler word removal (ums, uhs, repeated words)',
                'Studio Sound AI audio restoration that removes background noise and echoes',
                'AI Eye Contact correction for teleprompter reads',
                'AI voice cloning and script punch-ins'
            ]),
            useCases: JSON.stringify([
                'Editing podcast episodes in half the time of traditional DAWs',
                'Creating viral YouTube Shorts and TikToks with automated captions',
                'Polishing corporate webinar recordings and onboarding videos'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: '1 hour of transcription per month', features: ['720p video export', 'Standard filler word removal', 'Basic Studio Sound'] },
                { name: 'Creator', price: '$12', period: 'per month', popular: true, description: '10 hours of transcription per month', features: ['4K video export', 'Unlimited filler word removal', 'Studio Sound pro', 'Eye contact correction'] },
                { name: 'Pro', price: '$24', period: 'per month', description: '30 hours of transcription per month', features: ['Custom AI voice clones', 'Full stock library access', 'Priority translation queue'] }
            ]),
            pros: JSON.stringify(['Editing video via text saves hours of cutting', 'Studio Sound makes phone mics sound like Shure SM7B', 'Automated animated captions']),
            cons: JSON.stringify(['Desktop app can be resource heavy with 4K multi-cam timelines']),
            categoryId: categoryMap['video'],
        },
        // AUDIO
        {
            name: 'ElevenLabs',
            slug: 'elevenlabs',
            description: 'The industry-standard AI voice generator and multilingual speech synthesis platform.',
            longDescription: 'ElevenLabs produces natural, emotionally expressive speech synthesis in 29+ languages. Whether generating narration for audiobooks, dubbing videos with preserved original voice timbre, or deploying interactive conversational AI agents, ElevenLabs sets the quality bar for synthetic voice.',
            logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://elevenlabs.io',
            pricing: 'Freemium',
            pricingDetails: 'Free plan with 10,000 characters/month; Starter from $5/month; Creator from $22/month.',
            rating: 4.9,
            reviewCount: 610,
            viewsCount: 27800,
            bookmarkCount: 1180,
            verified: true,
            trending: true,
            featured: true,
            platforms: 'Web Browser, API, iOS App',
            features: JSON.stringify([
                'Hyper-realistic text-to-speech with emotional nuance and pacing control',
                'Voice cloning from a 60-second audio sample',
                'Automated video dubbing in 29 languages with lip sync matching',
                'Conversational AI voice agents with sub-300ms latency',
                'Sound effects generator for Foley and ambient audio tracks'
            ]),
            useCases: JSON.stringify([
                'Narrating audiobooks and educational long-form courses',
                'Dubbing marketing videos for international localization',
                'Real-time automated customer support voicebots'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: '10,000 characters per month', features: ['Text to speech in 29 languages', '3 custom voices', 'Commercial license excluded'] },
                { name: 'Starter', price: '$5', period: 'per month', popular: true, description: '30,000 characters + instant voice cloning', features: ['Instant voice cloning', 'Commercial license included', '10 custom voices'] },
                { name: 'Creator', price: '$22', period: 'per month', description: '100,000 characters for professional creators', features: ['Professional voice cloning', 'High-quality 192kbps audio', 'Projects long-form editor'] }
            ]),
            pros: JSON.stringify(['Indistinguishable from human voice actors', 'Low latency streaming API', 'Maintains emotional cadence across sentences']),
            cons: JSON.stringify(['Character limits can get eaten up quickly with long audiobooks']),
            categoryId: categoryMap['audio'],
        },
        {
            name: 'Suno',
            slug: 'suno',
            description: 'Generate complete, broadcast-quality songs with vocals and instrumentation from simple prompts.',
            longDescription: 'Suno produces radio-ready songs spanning any genre—from acoustic folk and synthwave to operatic rock and hip-hop. It writes original lyrics, arranges instrumentation, synthesizes soulful vocals, and generates full tracks in under 60 seconds.',
            logoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://suno.com',
            pricing: 'Freemium',
            pricingDetails: 'Free plan with 50 daily credits (10 songs); Pro plan at $8/month billed annually.',
            rating: 4.8,
            reviewCount: 420,
            viewsCount: 21900,
            bookmarkCount: 840,
            verified: true,
            trending: true,
            featured: false,
            platforms: 'Web Browser, iOS App',
            features: JSON.stringify([
                'Text-to-song generation with coherent verses, choruses, and bridges',
                'Custom lyrics input with musical style tags',
                'Song extension and instrumental stems separation',
                'Genre fusion (e.g. Baroque Hip-Hop, Acoustic Cyberpunk)',
                'Full commercial rights on paid subscription tiers'
            ]),
            useCases: JSON.stringify([
                'Original royalty-free theme songs for podcasts and Twitch streams',
                'Personalized musical birthday gifts and parody songs',
                'Rapid songwriting ideation for musicians and producers'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Basic', price: '$0', period: 'forever', description: '50 credits replenished daily (10 songs)', features: ['Non-commercial terms', 'Standard generation queue', 'Shared community feed'] },
                { name: 'Pro', price: '$8', period: 'per month', popular: true, description: '2,500 credits monthly (500 songs)', features: ['General commercial terms', 'Fast generation queue', 'Up to 10 concurrent jobs'] },
                { name: 'Premier', price: '$24', period: 'per month', description: '10,000 credits monthly (2,000 songs)', features: ['Highest priority queue', 'Commercial monetization', 'Stem isolation exports'] }
            ]),
            pros: JSON.stringify(['Astonishing melodic catchiness and vocal production', 'Generates full 4-minute songs', 'Generous daily free credits']),
            cons: JSON.stringify(['Cannot manually edit individual vocal notes or MIDI instruments']),
            categoryId: categoryMap['audio'],
        },
        // PRODUCTIVITY
        {
            name: 'Notion AI',
            slug: 'notion-ai',
            description: 'Connected AI workspace assistant that answers questions across your company docs and notes.',
            longDescription: 'Notion AI is embedded into every page of the Notion connected workspace. It can query across all your team’s wikis, project roadmaps, and meeting notes, auto-fill database properties, summarize transcripts, and draft action items in seconds.',
            logoUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://notion.so/product/ai',
            pricing: 'Freemium',
            pricingDetails: 'Free trial with limited responses; $8-$10/member/month add-on to Notion plans.',
            rating: 4.7,
            reviewCount: 540,
            viewsCount: 25100,
            bookmarkCount: 890,
            verified: true,
            trending: false,
            featured: true,
            platforms: 'MacOS, Windows, Web Browser, iOS, Android',
            features: JSON.stringify([
                'Q&A cross-document search over your entire workspace database',
                'Auto-fill database properties and summaries',
                'Writing assistant for tone adjustment, translation, and drafting',
                'Instant meeting action item extraction',
                'Enterprise permissions and workspace data fencing'
            ]),
            useCases: JSON.stringify([
                'Onboarding new employees by letting them ask questions about internal wikis',
                'Automating quarterly OKR status summaries across project boards',
                'Cleaning up messy customer discovery call notes'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free Trial', price: '$0', period: 'trial', description: '20 free AI responses per member', features: ['Basic page Q&A', 'Text rewriting', 'Meeting summaries'] },
                { name: 'Notion AI Add-on', price: '$8', period: 'per member/mo', popular: true, description: 'Unlimited Notion AI access billed annually', features: ['Unlimited Q&A over entire workspace', 'Autofill database columns', 'Frontier model integrations'] }
            ]),
            pros: JSON.stringify(['Answers pull directly from your verified internal documentation', 'Seamlessly integrated into existing Notion tables', 'Great privacy controls']),
            cons: JSON.stringify(['Only searches inside your Notion ecosystem']),
            categoryId: categoryMap['productivity'],
        },
        {
            name: 'Otter.ai',
            slug: 'otter-ai',
            description: 'AI meeting assistant that transcribes, summarizes, and captures action items in real time.',
            longDescription: 'Otter.ai automatically joins Zoom, Microsoft Teams, and Google Meet calls to transcribe spoken dialogue with speaker identification. It generates automated executive summaries, captures presentation slides, and answers post-meeting questions via Otter Chat.',
            logoUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://otter.ai',
            pricing: 'Freemium',
            pricingDetails: 'Free plan with 300 monthly transcription minutes; Pro plan at $10/month.',
            rating: 4.6,
            reviewCount: 380,
            viewsCount: 16200,
            bookmarkCount: 470,
            verified: true,
            trending: false,
            featured: false,
            platforms: 'Web, Zoom, Teams, Google Meet, iOS, Android',
            features: JSON.stringify([
                'Automated meeting participant bot for Zoom, Meet, and Teams',
                'Real-time live transcription with speaker separation',
                'Automated 30-second bulleted executive summary and action items',
                'Otter Chat Q&A across historical recorded meetings',
                'Automated slide screengrab and sync to timestamp'
            ]),
            useCases: JSON.stringify([
                'Capturing detailed notes during customer discovery and sales calls',
                'Catching up on 1-hour team standups in a 2-minute text summary',
                'Sharing automated follow-up emails with assigned task owners'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Basic', price: '$0', period: 'forever', description: '300 monthly transcription minutes (30 min/call)', features: ['Real-time transcription', 'Automated meeting summary', 'Otter AI Chat'] },
                { name: 'Pro', price: '$10', period: 'per month', popular: true, description: '1,200 monthly transcription minutes (90 min/call)', features: ['Advanced search and export (PDF/DOCX)', 'Team vocabulary customization', 'Automated slide capture'] },
                { name: 'Business', price: '$20', period: 'per user/mo', description: '6,000 monthly minutes (4 hours/call)', features: ['Admin usage analytics', 'Centralized billing', 'Automated Zoom webinar sync'] }
            ]),
            pros: JSON.stringify(['Reliable multi-speaker attribution', 'Action items are consistently accurate', 'Generous free monthly minutes']),
            cons: JSON.stringify(['Meeting bot joining unannounced can surprise clients']),
            categoryId: categoryMap['productivity'],
        },
        // MARKETING
        {
            name: 'Copy.ai',
            slug: 'copy-ai',
            description: 'AI marketing and sales platform for GTM workflow automation and outbound pipeline.',
            longDescription: 'Copy.ai has evolved from a simple copy generator into an enterprise Go-To-Market operating system. It aggregates CRM data, LinkedIn insights, and product documentation to generate hyper-personalized outbound sequences, inbound lead research briefs, and localized ad copy.',
            logoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://copy.ai',
            pricing: 'Freemium',
            pricingDetails: 'Free plan with 2,000 words in chat; Pro plan at $36/month with unlimited words.',
            rating: 4.6,
            reviewCount: 290,
            viewsCount: 13900,
            bookmarkCount: 410,
            verified: false,
            trending: false,
            featured: false,
            platforms: 'Web Browser, API',
            features: JSON.stringify([
                'Automated GTM workflows for sales prospecting and inbound enrichment',
                'Infobase for saving company value propositions and brand tones',
                'Over 90 marketing and sales copywriting workflows',
                'Multi-model routing (Claude, OpenAI, Gemini) based on task',
                'Zapier, HubSpot, and Salesforce integrations'
            ]),
            useCases: JSON.stringify([
                'Writing 100 personalized cold outbound emails from LinkedIn profiles',
                'Automating content translation across 20 European languages',
                'Creating social media calendar schedules from blog posts'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: '2,000 words in Chat for solo users', features: ['1 user seat', '200 bonus workflow credits', 'Infobase brand profile'] },
                { name: 'Pro', price: '$36', period: 'per month', popular: true, description: 'Unlimited words for marketing pros', features: ['5 seats included', 'Unlimited chat words', '500 workflow credits/mo'] },
                { name: 'Team', price: '$186', period: 'per month', description: 'Collaborative pipeline automation', features: ['20 user seats', '3,000 workflow credits/mo', 'Dedicated support'] }
            ]),
            pros: JSON.stringify(['Powerful GTM workflow automation builder', 'Integrates smoothly with modern sales stacks', 'Multi-model LLM selector']),
            cons: JSON.stringify(['Higher pricing entry point for individual creators']),
            categoryId: categoryMap['marketing'],
        },
        // RESEARCH
        {
            name: 'Perplexity',
            slug: 'perplexity',
            description: 'Conversational answer engine combining frontier AI reasoning with real-time web verification.',
            longDescription: 'Perplexity reimagines search by delivering concise, sourced answers backed by verifiable live web citations. Its Pro Search conducts multi-step reasoning, asks clarifying questions, inspects academic datasets, and writes live Python code to calculate statistics.',
            logoUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://perplexity.ai',
            pricing: 'Freemium',
            pricingDetails: 'Free unlimited quick search; Perplexity Pro is $20/month with 300+ daily Pro queries.',
            rating: 4.9,
            reviewCount: 710,
            viewsCount: 34500,
            bookmarkCount: 1390,
            verified: true,
            trending: true,
            featured: true,
            platforms: 'Web Browser, iOS, Android, Mac App, Chrome Extension',
            features: JSON.stringify([
                'Pro Search multi-step computational reasoning and follow-up query loops',
                'Interactive verified inline citations to reputable sources',
                'Choice of frontier models (Claude 3.5 Sonnet, GPT-4o, Sonar Large)',
                'Perplexity Pages for publishing formatted research reports',
                'File analysis for research PDFs, CSVs, and earnings transcripts'
            ]),
            useCases: JSON.stringify([
                'Investigating competitor product updates and financial disclosures',
                'Synthesizing medical or academic research with strict citation proofs',
                'Technical buying guides with real-time price comparisons'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: 'Unlimited standard searches', features: ['Standard web search', '5 Pro searches every 4 hours', 'Perplexity Collections'] },
                { name: 'Pro', price: '$20', period: 'per month', popular: true, description: 'The premier research experience', features: ['300+ daily Pro searches', 'Switch between Claude 3.5, GPT-4o & Sonar', 'Unlimited file uploads', '$5/mo API credits'] },
                { name: 'Enterprise Pro', price: '$40', period: 'per seat/mo', description: 'Team search with data privacy', features: ['SOC2 certified security', 'Internal knowledge base search', 'Centralized admin controls'] }
            ]),
            pros: JSON.stringify(['Every single statement is backed by clickable web links', 'Pro Search synthesizes complex technical topics reliably', 'Clean, ad-free interface']),
            cons: JSON.stringify(['Occasionally cites paywalled journals it cannot fully penetrate']),
            categoryId: categoryMap['research'],
        },
        {
            name: 'Google Gemini',
            slug: 'google-gemini',
            description: 'Google’s multimodal frontier AI with deep integration into Google Workspace and YouTube.',
            longDescription: 'Gemini (powered by Gemini 1.5 Pro and Flash) boasts an industry-record 1M to 2M token context window. It effortlessly ingests entire audio recordings, hour-long video files, or thousand-page PDF documents, cross-referencing information with Google Search and Google Docs.',
            logoUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://gemini.google.com',
            pricing: 'Freemium',
            pricingDetails: 'Free tier with Gemini Flash; Gemini Advanced included in Google One AI Premium ($19.99/mo).',
            rating: 4.7,
            reviewCount: 680,
            viewsCount: 28900,
            bookmarkCount: 760,
            verified: true,
            trending: true,
            featured: true,
            platforms: 'Web Browser, Android, iOS, Google Workspace',
            features: JSON.stringify([
                'Industry-leading 1,000,000 to 2,000,000 token context window',
                'Native multimodal video, audio, and code reasoning',
                'Google Workspace extensions (Gmail, Drive, Docs, YouTube, Maps)',
                'Python code execution and interactive chart plotting',
                'Double-check responses with Google Search grounding'
            ]),
            useCases: JSON.stringify([
                'Analyzing entire 1-hour conference videos and keynote presentations',
                'Querying multiple lengthy financial PDFs simultaneously',
                'Summarizing unread threads and drafting replies inside Gmail'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Free', price: '$0', period: 'forever', description: 'Fast everyday assistance', features: ['Gemini 1.5 Flash model', 'Google Workspace extensions', 'Web & mobile apps'] },
                { name: 'Advanced', price: '$19.99', period: 'per month', popular: true, description: 'Google One AI Premium plan', features: ['Gemini 1.5 Pro with 1M token context', '2TB Google Drive cloud storage', 'Gemini in Docs, Gmail & Slides'] }
            ]),
            pros: JSON.stringify(['Unmatched 1M-2M token context window', 'Direct integration with Google Docs and Gmail', 'Included in 2TB Google One subscription']),
            cons: JSON.stringify(['Interface occasionally throttles complex multi-step reasoning']),
            categoryId: categoryMap['research'],
        },
        // EDUCATION
        {
            name: 'Khan Academy Khanmigo',
            slug: 'khanmigo',
            description: 'An AI-powered personal tutor that guides learners with Socratic questioning rather than giving answers.',
            longDescription: 'Khanmigo is an educational AI developed by Khan Academy. Built on ethical pedagogical principles, Khanmigo acts as a 1-on-1 Socratic tutor that asks guiding questions, diagnoses misconceptions in math and science, and supports teachers with automated lesson plan drafting.',
            logoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=128&auto=format&fit=crop&q=80',
            websiteUrl: 'https://khanacademy.org/khanmigo',
            pricing: 'Freemium',
            pricingDetails: 'Free for eligible teachers and students in participating districts; Individual learner plan at $4/month.',
            rating: 4.8,
            reviewCount: 260,
            viewsCount: 11500,
            bookmarkCount: 510,
            verified: true,
            trending: false,
            featured: false,
            platforms: 'Web Browser, iOS, Android',
            features: JSON.stringify([
                'Socratic dialogue that coaches students to discover solutions themselves',
                'Math problem scratchpad with step-by-step error detection',
                'Literary and historical character simulations for interactive roleplay',
                'Automated rubrics, lesson plans, and quiz generation for educators',
                'COPPA-compliant child safety fencing and teacher moderation dashboard'
            ]),
            useCases: JSON.stringify([
                'Helping middle and high school students with complex algebra proofs',
                'Generating dynamic lesson plans aligned with educational standards',
                'Debating historical figures like Aristotle or Harriet Tubman'
            ]),
            pricingTiers: JSON.stringify([
                { name: 'Educator', price: '$0', period: 'for verified teachers', description: 'Free AI teaching assistant tools', features: ['Lesson planning', 'Rubric generator', 'Student progress tracker'] },
                { name: 'Learner', price: '$4', period: 'per month', popular: true, description: 'Personal Socratic tutor for all subjects', features: ['Unlimited tutoring sessions', 'Math step debugger', 'Creative writing coach'] }
            ]),
            pros: JSON.stringify(['Promotes genuine understanding instead of copy-paste cheating', 'Safe for minors and classroom use', 'Extremely affordable']),
            cons: JSON.stringify(['Restricted to academic curriculum; refuses general web tasks']),
            categoryId: categoryMap['education'],
        },
    ];
    for (const tool of toolsData) {
        const createdTool = await prisma.tool.create({ data: tool });
        // Add realistic reviews for each tool
        const sampleReviews = [
            {
                rating: 5,
                title: `Indispensable in our engineering workflow`,
                content: `${createdTool.name} completely transformed how our team operates. The speed and quality of results saved us hundreds of hours this quarter.`,
                userId: alex.id,
            },
            {
                rating: 5,
                title: `Game changer for daily productivity`,
                content: `I was skeptical at first, but after one week using ${createdTool.name}, it's hard to imagine going back to the old manual way. Highly recommended!`,
                userId: sophia.id,
            },
            {
                rating: 4,
                title: `Great features with minor learning curve`,
                content: `Very impressed with the responsiveness and depth of ${createdTool.name}. The pricing tier is reasonable for professional users. A few edge cases could use polish, but overall 9/10.`,
                userId: marcus.id,
            },
        ];
        for (const r of sampleReviews) {
            await prisma.review.create({
                data: {
                    ...r,
                    toolId: createdTool.id,
                },
            });
        }
        // Add sample bookmark for demo user
        if (createdTool.trending || createdTool.featured) {
            await prisma.bookmark.create({
                data: {
                    userId: demo.id,
                    toolId: createdTool.id,
                },
            });
        }
    }
    console.log(`Seeding complete: ${toolsData.length} tools, ${categoriesData.length} categories, ${users.length} users.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
