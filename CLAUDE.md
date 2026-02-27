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
    ├── postcss.config.mjs     # PostCSS (empty; Tailwind v4 uses Vite plugin)
    ├── ATTRIBUTIONS.md        # Third-party licenses
    └── src/
        ├── main.tsx           # React root render
        ├── app/
        │   ├── App.tsx        # Root component, view routing, global dialogs
        │   └── components/
        │       ├── auth-context.tsx          # Auth React Context provider
        │       ├── auth-view.tsx             # Sign in / sign up UI
        │       ├── header.tsx                # Top nav bar
        │       ├── footer.tsx                # Footer
        │       ├── home-view.tsx             # Landing / home page
        │       ├── hero-section.tsx          # Hero banner component
        │       ├── listings-view.tsx         # Housing & marketplace browse page
        │       ├── my-listings-view.tsx      # User's own listings management
        │       ├── listing-card.tsx          # Listing card + shared Listing type
        │       ├── listing-detail-dialog.tsx # Full listing detail modal
        │       ├── create-listing-dialog.tsx # Create new listing form/modal
        │       ├── contact-dialog.tsx        # Message seller modal
        │       ├── filter-sidebar.tsx        # Filter panel for listings
        │       ├── pricing-view.tsx          # Subscription tier page
        │       ├── email-verification-view.tsx # Email verification UI
        │       ├── sample-data.tsx           # In-memory mock data (dev only)
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
  subscriptionTier: string; // 'free' | 'poster' | ...
}
```

> **Important:** Auth is currently a stub. `signIn`/`signUp` only set in-memory state. No real backend calls are made. `accessToken` is always `null`.

### Listings & Mock Data

The shared `Listing` type is defined in `listing-card.tsx`. All mock data lives in `sample-data.tsx`:
- 10 housing listings (subleases/rentals, $550–$900/month)
- 6 marketplace listings (electronics, textbooks, furniture, clothing)

`ListingsView` accepts a `type` prop (`'housing' | 'marketplace'`) to filter and display the appropriate listings.

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

RIT orange is the primary brand color:
- Primary: `#F76902`
- Darker variant: `#D85802`
- Use these inline or via Tailwind utilities that reference CSS variables.

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

## Known TODOs / Placeholder Implementations

The following are stubs that need real backend integration:

| File | TODO |
|------|------|
| `auth-context.tsx` | Real auth (JWT/session, RIT email verification) |
| `create-listing-dialog.tsx` | Real listing creation API call |
| `contact-dialog.tsx` | Real messaging system |
| `pricing-view.tsx` | Real payment/subscription processing |
| `my-listings-view.tsx` | Real user listings fetch from backend |
| `sample-data.tsx` | Replace with real API data fetching |

When implementing backend calls, use the `accessToken` from `useAuth()` for authenticated requests.

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
