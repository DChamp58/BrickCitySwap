# BrickCitySwap

A student housing and general marketplace platform for RIT (Rochester Institute of Technology) students. BrickCitySwap lets students list and discover subleases/rentals, sell/buy goods, and connect with each other in a campus-verified community.

---

## Features

- **Housing Listings** — Browse and post subleases and rentals near RIT with detailed parameters (bedrooms, bathrooms, housing type, distance from campus, gender preference, availability dates)
- **Marketplace** — Buy and sell textbooks, electronics, furniture, and more with condition ratings
- **Supabase Auth** — Secure email/password sign-up and sign-in with persistent JWT sessions
- **Image Uploads** — Attach multiple photos per listing via Supabase Storage with in-app gallery viewer
- **Make an Offer** — Negotiation system: sellers mark listings as "Open to Offers," buyers submit offers inline
- **Saved Listings** — Bookmark favorites and view them in a dedicated Saved page
- **In-App Messaging** — Contact sellers directly; conversation threads per listing
- **Profile Management** — Edit display name, avatar, and account settings; change password
- **My Listings** — Manage your own active, pending, and sold listings
- **Subscription Tiers** — Free browsing; Poster tier ($2.99/mo or $25/yr) unlocks listing creation
- **Dark Mode** — Full light/dark theme via CSS variables and `next-themes`
- **Privacy Policy & Terms of Service** — Dedicated legal pages

---

## Repository Structure

```
BrickCitySwap/
├── index.html              # "Coming Soon" landing page (root)
├── sitemap.xml             # Sitemap for search engine indexing
├── vercel.json             # Root Vercel deployment config
├── package.json            # Root build script (orchestrates full deploy)
├── app/                    # Pre-built app assets (served at /app by Vercel)
└── Figma_Output/           # Main application source (develop here)
    ├── index.html          # HTML entry point
    ├── package.json        # Dependencies & scripts
    ├── vite.config.ts      # Vite + Tailwind + path alias config
    ├── vercel.json         # SPA rewrite rules for Vercel
    ├── .env.example        # Template for environment variables
    ├── ATTRIBUTIONS.md     # Third-party licenses
    ├── supabase/
    │   └── migration.sql   # Database schema, RLS policies, triggers, seed data
    └── src/
        ├── main.tsx        # React root render
        ├── lib/
        │   ├── supabase.ts         # Supabase client singleton
        │   ├── database.types.ts   # TypeScript types for all DB tables
        │   └── api.ts              # Data access layer (CRUD for listings, images, etc.)
        ├── app/
        │   ├── App.tsx             # Root component, view routing, global dialogs
        │   └── components/
        │       ├── auth-context.tsx              # Auth context (Supabase Auth)
        │       ├── auth-view.tsx                 # Sign in / sign up UI
        │       ├── header.tsx                    # Top navigation bar
        │       ├── footer.tsx                    # Footer
        │       ├── home-view.tsx                 # Landing / home page
        │       ├── hero-section.tsx              # Hero banner
        │       ├── listings-view.tsx             # Housing & marketplace browse page
        │       ├── listing-card.tsx              # Listing card + shared Listing type
        │       ├── listing-detail-dialog.tsx     # Full listing detail modal (image gallery, offers)
        │       ├── create-listing-dialog.tsx     # Create listing form (with image upload)
        │       ├── edit-listing-dialog.tsx       # Edit existing listing
        │       ├── contact-dialog.tsx            # Message seller modal
        │       ├── filter-sidebar.tsx            # Filter panel for listings
        │       ├── my-listings-view.tsx          # User's own listings management
        │       ├── saved-view.tsx                # Saved/favorited listings
        │       ├── saved-context.tsx             # Saved listings state
        │       ├── messages-view.tsx             # Chat / messaging UI
        │       ├── messaging-context.tsx         # Messaging state
        │       ├── notifications-context.tsx     # Notification state
        │       ├── profile-view.tsx              # User profile page
        │       ├── edit-profile-dialog.tsx       # Edit display name and avatar
        │       ├── change-password-dialog.tsx    # Change password
        │       ├── pricing-view.tsx              # Subscription tier page
        │       ├── payment-view.tsx              # Payment / checkout UI
        │       ├── privacy-view.tsx              # Privacy Policy page
        │       ├── terms-view.tsx                # Terms of Service page
        │       ├── email-verification-view.tsx   # Email verification UI
        │       └── ui/                           # shadcn/ui component library (48+ files)
        └── styles/
            ├── index.css       # Imports all other style files
            ├── tailwind.css    # Tailwind CSS v4 directives
            ├── theme.css       # CSS variables for light/dark theme
            └── fonts.css       # Font declarations
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite 6 |
| Backend | Supabase (Postgres + Auth + Storage + Realtime) |
| Auth | Supabase Auth (email/password, JWT) |
| Database | Supabase PostgreSQL with Row Level Security |
| Storage | Supabase Storage (public bucket for listing images) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| UI Primitives | Radix UI (48+ packages) |
| Component Library | shadcn/ui |
| Additional UI | Material UI |
| Icons | Lucide React + MUI Icons |
| Forms | React Hook Form |
| Animations | Motion (Framer Motion successor) |
| Toasts | Sonner |
| Charts | Recharts |
| Date Utilities | date-fns |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or pnpm)
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/dchamp58/brickcityswap.git
cd BrickCitySwap
```

### 2. Set up Supabase

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** and run the full contents of `Figma_Output/supabase/migration.sql` — this creates all tables, RLS policies, triggers, and seeds the RIT school record
3. Go to **Project Settings → API** and copy your **Project URL** and **anon public** key

### 3. Configure environment variables

```bash
cd Figma_Output
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Install dependencies and run

```bash
# From the Figma_Output/ directory
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> Use `npm` or `pnpm`. Do not use `yarn`.

### 5. Production build

```bash
npm run build   # Outputs to Figma_Output/dist/
```

---

## Database Schema

The schema lives in `Figma_Output/supabase/migration.sql`. Core tables:

| Table | Description |
|-------|-------------|
| `schools` | College communities (RIT seeded by default) |
| `profiles` | User profiles, auto-created on signup via DB trigger |
| `listings` | Housing + marketplace listings (unified table with type discriminator) |
| `listing_images` | Images per listing, stored in Supabase Storage |
| `saved_listings` | User-favorited listings |

All tables have **Row Level Security** enabled. Listings are publicly readable; writes require authentication and ownership.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon (public) API key |

Never commit `.env` — it is gitignored. The `.env.example` file provides the template.

---

## Subscription Tiers

| Tier | Price | Capabilities |
|------|-------|-------------|
| Free | $0 | Browse listings |
| Poster | $2.99/mo or $25/yr | Create and manage listings |

Payment processing (Stripe) is planned for a future phase. The pricing and payment UI is in place.

---

## Architecture Notes

**Routing** — There is no React Router. Navigation is handled by a `View` union type and `useState` in `App.tsx`. To add a page: add its literal to the `View` type, create a `*-view.tsx` component, add a render block in `App.tsx`, and add a nav link in `header.tsx`.

**Auth** — `AuthProvider` / `useAuth()` from `auth-context.tsx`. On signup, a Postgres trigger auto-creates a profile row and matches the user's email domain to a school.

**Data access** — All Supabase calls go through `src/lib/api.ts`. Components never call the Supabase client directly.

**Styling** — Tailwind v4 via the Vite plugin (no `tailwind.config.js`). Theming via CSS variables in `theme.css`. Dark mode managed by `next-themes`. Use `cn()` from `@/lib/utils` for conditional class names.

**Branding** — Primary orange `#F76902`, cream `#FFF6EE`, dark brown `#402E32`, accent tan `#B5866E`. Font: Merriweather (serif).

---

## Deployment

The project is configured for [Vercel](https://vercel.com):

- Root `vercel.json` routes `/app/*` to the built React SPA
- `Figma_Output/vercel.json` provides SPA rewrites for client-side routing
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in your Vercel project settings

---

## Roadmap

| Feature | Status |
|---------|--------|
| Supabase Auth + real DB | Done |
| Housing & marketplace listings | Done |
| Image upload to Supabase Storage | Done |
| Make an Offer / negotiation system | Done |
| Saved listings | Done |
| Profile management | Done |
| In-app messaging | UI complete; Supabase Realtime integration planned |
| Payment / Stripe integration | UI complete; Stripe integration planned |
| RIT email enforcement (`@rit.edu`) | Planned |
| Admin / reporting dashboard | Planned |
