# BrickCitySwap — CLAUDE.md

This file documents the codebase structure, development workflows, and conventions for AI assistants working on this project.

---

## Project Overview

**BrickCitySwap** is a student housing and general marketplace platform for RIT (Rochester Institute of Technology) students. It lets students list and discover subleases/rentals, sell/buy goods, and connect with each other in a campus-verified community.

The public-facing site at the repo root is a **Coming Soon** landing page. The full application lives under `Figma_Output/` and was bootstrapped from a Figma design export.

---

## Repository Layout

```
BrickCitySwap/
├── CLAUDE.md                  # This file
├── README.md                  # Minimal root readme
├── index.html                 # "Coming Soon" landing page (root)
└── Figma_Output/              # Main application (work here)
    ├── index.html             # HTML entry point
    ├── package.json           # Dependencies & scripts
    ├── vite.config.ts         # Vite + Tailwind + path alias config
    ├── .env                   # Supabase credentials (gitignored)
    ├── .env.example           # Template for .env
    ├── postcss.config.mjs     # PostCSS (empty; Tailwind v4 uses Vite plugin)
    ├── ATTRIBUTIONS.md        # Third-party licenses
    ├── supabase/
    │   └── migration.sql      # Database schema, RLS, triggers, seed data
    └── src/
        ├── main.tsx           # React root render
        ├── lib/
        │   ├── supabase.ts        # Supabase client singleton
        │   ├── database.types.ts  # TypeScript types for all DB tables
        │   └── api.ts             # Data access functions (CRUD for listings, images, etc.)
        ├── app/
        │   ├── App.tsx        # Root component, view routing, global dialogs
        │   └── components/
        │       ├── auth-context.tsx          # Auth Context (Supabase Auth)
        │       ├── auth-view.tsx             # Sign in / sign up UI
        │       ├── header.tsx                # Top nav bar
        │       ├── footer.tsx                # Footer
        │       ├── home-view.tsx             # Landing / home page
        │       ├── hero-section.tsx          # Hero banner component
        │       ├── listings-view.tsx         # Housing & marketplace browse page
        │       ├── my-listings-view.tsx      # User's own listings management
        │       ├── listing-card.tsx          # Listing card + shared Listing type
        │       ├── listing-detail-dialog.tsx # Full listing detail modal (w/ image gallery)
        │       ├── create-listing-dialog.tsx # Create listing form (w/ image upload)
        │       ├── contact-dialog.tsx        # Message seller modal
        │       ├── filter-sidebar.tsx        # Filter panel for listings
        │       ├── messaging-context.tsx     # In-memory messaging (Phase 2: Supabase Realtime)
        │       ├── messages-view.tsx         # Chat UI
        │       ├── pricing-view.tsx          # Subscription tier page
        │       ├── email-verification-view.tsx # Email verification UI
        │       ├── sample-data.tsx           # Legacy mock data (reference only)
        │       └── ui/                       # shadcn/ui component library (48+ files)
        ├── assets/            # Static assets (images, etc.)
        └── styles/
            ├── index.css      # Imports all other style files
            ├── tailwind.css   # Tailwind CSS v4 directives
            ├── theme.css      # CSS variables for light/dark theme
            └── fonts.css      # Font declarations
```

---

## Development Setup

All commands must be run from the **`Figma_Output/`** directory.

```bash
cd Figma_Output
npm install       # Install dependencies
npm run dev       # Start dev server (Vite, http://localhost:5173)
npm run build     # Production build (outputs to dist/)
```

> Note: The project uses `pnpm` overrides in package.json to pin Vite to 6.3.5. Use `npm` or `pnpm` — both work. Do not use `yarn`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript |
| Build tool | Vite 6 |
| **Backend** | **Supabase** (managed Postgres + Auth + Storage + Realtime) |
| **Auth** | **Supabase Auth** (email/password, JWT sessions) |
| **Database** | **Supabase PostgreSQL** with Row Level Security |
| **Storage** | **Supabase Storage** (public bucket for listing images) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| UI primitives | Radix UI (48+ `@radix-ui/react-*` packages) |
| Component library | shadcn/ui (in `src/app/components/ui/`) |
| Additional UI | Material UI (`@mui/material`) |
| Icons | `lucide-react` + `@mui/icons-material` |
| Forms | `react-hook-form` |
| Animations | `motion` (Framer Motion successor) |
| Toasts | `sonner` |
| Charts | `recharts` |
| Date utilities | `date-fns` |
| Drag and drop | `react-dnd` |
| Theme | `next-themes` |

---

## Architecture

### Routing

There is **no React Router**. Navigation is managed by a `View` type and `useState` in `App.tsx`:

```ts
type View = 'home' | 'housing' | 'marketplace' | 'profile' | 'my-listings' | 'pricing';
```

To add a new page/view:
1. Add its string literal to the `View` type in `App.tsx`
2. Create a `*-view.tsx` component in `src/app/components/`
3. Add a conditional render block in `App.tsx`
4. Add navigation in `header.tsx`

### State Management

- **Auth state:** React Context via `AuthProvider` / `useAuth()` hook (`auth-context.tsx`)
- **UI state:** Local `useState` in each component
- **No global state library** (Redux, Zustand, Jotai, etc.)

### Supabase Backend

The app uses **Supabase** as a managed backend. All data access goes through `src/lib/api.ts` which uses the Supabase JS client (`src/lib/supabase.ts`).

**Environment variables** (set in `.env`):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Database schema** is in `supabase/migration.sql`. Tables:
- `schools` — college communities (RIT seeded)
- `profiles` — user profiles (auto-created on signup via DB trigger)
- `listings` — housing + marketplace (unified table with type discriminator)
- `listing_images` — images per listing (stored in Supabase Storage)
- `saved_listings` — user favorites

All tables have **Row Level Security** enabled. Listings are publicly readable; writes require auth and ownership.

### Auth Context API

```ts
const { user, accessToken, signIn, signUp, signOut, loading, updateProfile } = useAuth();
```

`user` shape:
```ts
interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: string; // 'free' | 'poster' | 'premium'
  schoolId: string | null;
  avatarUrl: string | null;
}
```

Auth is powered by **Supabase Auth**. `signIn`/`signUp` call Supabase directly. On signup, a database trigger auto-creates a profile row and matches the user's email domain to a school.

### Data Access Layer

All database operations go through `src/lib/api.ts`:
```ts
import { fetchListings, createListing, uploadListingImage, ... } from '@/lib/api';
```

### Listings

The shared `Listing` type is defined in `listing-card.tsx` using **snake_case** field names matching the DB schema. `ListingsView` accepts a `type` prop (`'housing' | 'marketplace'`) and fetches from Supabase.

### Dialogs

Global dialogs are instantiated once in `App.tsx` and controlled by state passed down:
- `CreateListingDialog` — create a new listing
- `ContactDialog` — message a seller
- `ListingDetailDialog` — view full listing detail

Pass `onContact`, `onView` callbacks down to `ListingsView` and `ListingCard` to trigger these dialogs.

---

## Styling Conventions

### Tailwind CSS v4

- Uses the Vite plugin (`@tailwindcss/vite`), **not** a `tailwind.config.js` file.
- CSS variables for theming are in `src/styles/theme.css`.
- Dark mode is supported via CSS variables — do not use Tailwind's `dark:` prefix manually; it is managed by `next-themes`.

### Path Alias

`@` maps to `src/`. Always use this alias for imports:

```ts
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/app/components/auth-context';
```

### Class Names

Use `cn()` for conditional Tailwind classes (imported from `@/lib/utils` or inline from `clsx`/`tailwind-merge`):

```ts
import { cn } from '@/lib/utils';
className={cn('base-class', condition && 'conditional-class')}
```

### Branding Colors

The branding uses the "Discreet Palette":
- Primary orange: `#F76902` (hover: `#D85802`)
- Primary cream: `#FFF6EE` (light backgrounds)
- Secondary dark brown: `#402E32` (dark text, footer)
- Accent tan: `#B5866E` (secondary/muted text)
- Font: **Merriweather** (serif)
- Use these inline or via CSS variables defined in `theme.css`.

---

## Component Conventions

### shadcn/ui Components

All shadcn/ui components live in `src/app/components/ui/`. **Do not edit these files** unless absolutely necessary — they are generated components. Add new shadcn components to this directory following the same pattern.

### Feature Components

Feature components live directly in `src/app/components/`. Naming convention: `kebab-case.tsx` with a named export matching the PascalCase component name.

```ts
// file: my-feature.tsx
export function MyFeature({ prop }: Props) { ... }
```

### Props Typing

Always define a local `interface` or `type` for component props (no inline object types in function signatures for complex props).

---

## Subscription Tiers

```
free      — Browse only, sees ads
poster    — $2.99/month or $25/year — can post listings
(higher tiers TBD)
```

Guard listing creation:
```ts
if (!user) { setCurrentView('profile'); return; }
```

---

## What's Implemented vs. TODO

### Implemented (Phase 1)
- Supabase Auth (sign up / sign in / sign out with real persistence)
- Profile auto-creation on signup (DB trigger matches email to school)
- Listing CRUD (create, read, update status, delete) via Supabase
- Image upload to Supabase Storage during listing creation
- Image gallery in listing detail dialog
- Browse listings fetched from real database
- My Listings page with real data
- Database schema with RLS policies
- Multi-school support (schools table)

### TODO (Phase 2+)

| Feature | Notes |
|---------|-------|
| In-app messaging | Schema is commented out in `migration.sql`. Use Supabase Realtime for live delivery. |
| Payment/subscriptions | `pricing-view.tsx` is UI only — integrate Stripe |
| RIT email enforcement | Validate `@rit.edu` domain on signup (currently accepts any email) |
| Saved/favorited listings | API functions exist in `api.ts`, UI needs to be wired |
| Admin/reporting | Add admin role to profiles, build admin views |

---

## Testing

**No test infrastructure is currently configured.** There are no test files, no Vitest config, and no Jest config.

When adding tests, the recommended setup for this stack is:
- **Vitest** (`vitest`) for unit/integration tests
- **React Testing Library** (`@testing-library/react`) for component tests
- Add a `vitest.config.ts` at `Figma_Output/` level

---

## Build & Deployment

```bash
cd Figma_Output
npm run build    # Outputs to Figma_Output/dist/
```

The root `index.html` is a separate static page (Coming Soon) and is **not** part of the Vite build. Deploy it independently or replace it with the Vite build output when the app is ready to launch.

---

## Vite Config Notes

From `vite.config.ts`:
- Both the `react()` and `tailwindcss()` plugins are required — **do not remove either**.
- Raw asset imports are supported for `.svg` and `.csv` files.
- **Never** add `.css`, `.tsx`, or `.ts` to `assetsInclude`.

---

## Git Workflow

- Default development branch: `master`
- Feature branches follow the pattern: `claude/<description>-<session-id>`
- No CI/CD or pre-commit hooks are configured.

---

## File Creation Guidelines

- Place new views in `Figma_Output/src/app/components/<name>-view.tsx`
- Place new shared/utility components in `Figma_Output/src/app/components/`
- Place new shadcn/ui primitives in `Figma_Output/src/app/components/ui/`
- Do not create files at the repo root unless they are static assets or config for the root landing page
- Do not create a `tailwind.config.js` — Tailwind v4 is configured via the Vite plugin
