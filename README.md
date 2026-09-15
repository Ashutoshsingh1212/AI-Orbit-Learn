# AI Tools Directory Module (AI Orbit Theme)

A production-ready **AI Tools Directory** full-stack module inspired by the minimalist, premium dark aesthetic of [AI Orbit](https://aiorbit.club/).

Built with:
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide-React, React Router DOM
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, SQLite

---

## 🎨 1. Design & UI (AI Orbit Theme)

- **Strict Dark Theme**: Deep black canvas (`#000000` / `bg-black` / `bg-neutral-950`) with clean white and muted gray typography (`text-white`, `text-neutral-400`, `text-zinc-500`).
- **Card-Based Grid & List Views**: Cards with subtle border styling (`border-neutral-800`), smooth hover borders (`hover:border-neutral-700`), and pill-shaped category badges.
- **Minimalist & Fully Responsive**: Optimized for desktop (1440px+), tablet (768px), and mobile (390px/430px).

---

## 🧭 2. Frontend Pages & Routing

Configured in [`App.tsx`](file:///Users/ashutoshsingh/Desktop/DEMO%20PROJECT/frontend/src/App.tsx):
- `/` & `/tools` ➔ **Tools Listing Page** ([`ToolsPage.tsx`](file:///Users/ashutoshsingh/Desktop/DEMO%20PROJECT/frontend/src/pages/ToolsPage.tsx))
- `/tools/:id` ➔ **Tool Detail Page** ([`ToolDetailPage.tsx`](file:///Users/ashutoshsingh/Desktop/DEMO%20PROJECT/frontend/src/pages/ToolDetailPage.tsx))

### Listing Page Features:
- **Header**: Directory title, subtitle, and search bar with instant debouncing and keyboard shortcut (`⌘K` / `Ctrl+K` / `/`).
- **Category Filter Pills**: Filter by `"All"`, `"Text & Writing"`, `"Image Generation"`, `"Coding"`, `"Audio"`, and `"Productivity"` with live tool counts.
- **Tool Cards**: Displays tool icon/logo, name, short description, category tag, rating, pricing badge, and a **"View"** button.
- **View Toggle**: Switch effortlessly between **Grid View** and **Compact List View**.

### Detail Page (`/tools/:id`):
- **Breadcrumb Navigation**: Step-by-step breadcrumbs with a quick link back to the listing.
- **Tool Header**: Displays logo/icon, name, verified status badge, category, rating, and a primary **"Visit Website"** external button.
- **Detailed Overview**: Full markdown/text overview (`fullDescription`), key capabilities & features list, pricing model (`Free`, `Freemium`, `Paid`), and key metadata.
- **Community Reviews**: Rating summary and verified user feedback with an interactive modal to add reviews.
- **Related Tools**: Dynamic recommendation of tools from the same category.

### Component States:
- **Loading State**: Shimmer skeleton loaders matching card and detail layouts ([`LoadingSkeleton.tsx`](file:///Users/ashutoshsingh/Desktop/DEMO%20PROJECT/frontend/src/components/LoadingSkeleton.tsx)).
- **Empty State**: Friendly "No tools found matching your search" screen with a reset button ([`EmptyState.tsx`](file:///Users/ashutoshsingh/Desktop/DEMO%20PROJECT/frontend/src/components/EmptyState.tsx)).
- **Error State**: Clean error fallback card with retry functionality if the API fails ([`ErrorState.tsx`](file:///Users/ashutoshsingh/Desktop/DEMO%20PROJECT/frontend/src/components/ErrorState.tsx)).

---

## ⚙️ 3. Backend & Database (Express + Prisma + SQLite)

### Prisma Schema (`backend/prisma/schema.prisma`):
```prisma
model Tool {
  id              String     @id @default(uuid())
  name            String
  slug            String     @unique
  description     String     // Short tagline / summary
  fullDescription String     // Comprehensive overview / details
  category        String     // e.g. "Coding", "Text & Writing", "Image Generation", "Audio", "Productivity"
  pricing         String     // "Free", "Freemium", "Paid"
  url             String     // External tool URL
  rating          Float      @default(0.0)
  icon            String     // Icon/logo URL
  features        String?    // JSON array of key capabilities
  tags            String?    // JSON array of tags
  verified        Boolean    @default(true)
  reviews         Review[]
  bookmarks       Bookmark[]
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}
```

### Pre-Seeded Realistic Tools (`backend/prisma/seed.ts`):
1. **Cursor** (`Coding`, `Freemium`, 4.9 ★)
2. **ChatGPT** (`Text & Writing`, `Freemium`, 4.8 ★)
3. **Claude** (`Text & Writing`, `Freemium`, 4.9 ★)
4. **Midjourney** (`Image Generation`, `Paid`, 4.9 ★)
5. **Leonardo AI** (`Image Generation`, `Freemium`, 4.7 ★)
6. **GitHub Copilot** (`Coding`, `Paid`, 4.7 ★)
7. **ElevenLabs** (`Audio`, `Freemium`, 4.9 ★)
8. **Suno** (`Audio`, `Freemium`, 4.8 ★)
9. **Notion AI** (`Productivity`, `Freemium`, 4.7 ★)
10. **Perplexity** (`Productivity`, `Freemium`, 4.9 ★)

### Express REST Endpoints:
- `GET /api/tools`: Query tools with `search` and `category` parameters, plus optional pagination (`page`, `limit`) and sorting.
- `GET /api/tools/:id`: Fetch single tool by UUID **or** slug (e.g. `/api/tools/cursor`).
- `GET /api/tools/:id/related`: Fetch related tools from the same category.
- `GET /api/categories`: Fetch categories with active tool counts.
- `GET /api/tools/:id/reviews` & `POST /api/tools/:id/reviews`: View and add reviews.
- `GET /api/bookmarks` & `POST /api/tools/:id/bookmark`: Manage saved tools.
- `POST /api/auth/login` & `POST /api/auth/register`: Authentication with JWT.

---

## 🚀 Quick Start Guide

### 1. Setup & Database Seeding
```bash
npm run setup
```

### 2. Run in Development Mode
Starts both backend (`http://localhost:5001`) and frontend (`http://localhost:5174`) concurrently:
```bash
npm run dev
```

### 3. Run Automated Tests
```bash
npm test
```
Result: **35 / 35 tests passing**.

### 4. Build for Production
```bash
npm run build
```

---

## 🔑 Demo Account
- **Email**: `demo@aiorbit.club`
- **Password**: `password123`
*(Or click **"Quick Demo Login (1-Click Reviewer Access)"** in the Sign In modal)*
