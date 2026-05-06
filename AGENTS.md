<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js / React you know

Versions in this repo are newer than typical training data and contain breaking changes:

- **Next.js 16.2** with `reactCompiler: true` enabled in `next.config.ts` — do not write manual `useMemo` / `useCallback` / `memo`; the React Compiler handles memoization. Read the relevant guide in `node_modules/next/dist/docs/` before writing code that touches Next APIs (routing, caching, fetching, metadata, fonts, etc.).
- **React 19.2**, **TypeScript 6**, **ESLint 10** (flat config). Heed deprecation notices.
- Package manager is **pnpm**.
<!-- END:nextjs-agent-rules -->

## Commands

```bash
pnpm dev       # next dev (http://localhost:3000)
pnpm build     # next build
pnpm start     # production server
pnpm lint      # eslint
pnpm format    # prettier write across ts/tsx/js/jsx/css/scss/json/html
```

No test framework is configured.

## Architecture

A wargame shop inventory app (UI labels in Russian). Routes: `/` (product grid + filter), `/add`, `/edit/[id]`, `/export`.

### Layer overview

- `app/` — App Router pages; route-colocated `*.module.scss`. Global `<html>`/`<body>` and the Geist font CSS variable (`--f-geist-sans`) live in `app/layout.tsx`. Pages are thin: they render layout shells and delegate to components.
- `db/` — Dexie (IndexedDB) layer. `WargameDb` extends `Dexie` and owns the `products` table (indexed on `id, name, category, qty, updatedAt`). `ProductsService` (singleton `productsService`) is the only write path — `create`, `update`, `incrementQty`, `mergeWithExisting`, `remove`. `IProduct` / `IProductDraft` types live here too.
- `hooks/` — `useLiveQuery`-based hooks (`useProduct`, `useProducts`, `useSimilarProducts`, `useAllProducts`). All are `'use client'` and return live-reactive data from Dexie. `useProducts` accepts an `IProductsFilter` (category, search, sort, out-of-stock, price-reduction, used flags) and does client-side filtering/sorting. `useObjectUrl` manages a `URL.createObjectURL` lifecycle.
- `schemas/` — Zod schemas: `productFormSchema` (validates add/edit form).
- `helpers/` — Pure utilities. `compareProducts` drives the sort in `useProducts`.
- `services/` — Singleton service classes:
  - `exportService` — builds an `.xlsx` via `exceljs` (dynamically imported) with embedded photos, then delivers it via the Web Share API (files) or a fallback `<a download>`.
  - `toastService` — thin wrapper around `react-toastify`.
  - `hapticsService` — vibration feedback.
  - `imageOptimizer` — optimizes images using `compressorjs` before storage.
  - `storageService` — manages localStorage with typed keys (e.g., remembers last selected category).
- `components/` — All client components. Organised as:
  - `components/ui/` — design-system primitives (`Button`, `IconButton`, `TextInput`, `Select`, `Checkbox`, `Modal`, `Spinner`, `ConfirmModal`, `TextArea`). Import from `@/components` barrel or the direct sub-path.
  - `components/app-header/` — top bar with optional back link.
  - `components/page-shell/` — scroll container that wraps every page body.
  - `components/product-form/` — add/edit form. Uses TanStack React Form with custom field components (`TextField`, `TextAreaField`, `NumberField`, `CategoryField`, `PhotoField`) and form context. `ProductFormMode` enum selects create vs. edit behaviour.
  - `components/product-grid/` — home-page grid. Contains `FilterBar`, `ProductCard`, and `PhotoModal`.
  - `components/toast-host/` — mounts `<ToastContainer>`.
- `store/` — Zustand stores with `immer` + `persist` + `devtools` middleware, wired via `createStore` in `store/create-store.ts`. Currently one store: `useProductGridStore` holds filter state, pagination, and scroll position for the product grid; filter + page are persisted to `localStorage`, `scrollY` is excluded. Use `partializeExclude` / `partializeInclude` helpers when adding new stores.
- `constants/` — `Category` const-object + `ICategory` type + `CategoryValues` array + `CategoryLabel` Russian labels.
- `styles/` — global SCSS (`general.scss` imported once in `app/layout.tsx`; also `reboot`, `helper`, `responsive`).
- Path alias `@/*` → repo root.

Stack: **dexie** + `dexie-react-hooks` + `dexie-export-import` (IndexedDB); **zustand** + `immer` (client UI state); `zod`; `exceljs` (dynamic import, xlsx export); `react-toastify`; `@phosphor-icons/react`; `clsx`; `@tanstack/react-form` (form handling); `@zxing/browser` (barcode scanning); `compressorjs` (image optimization).

## Code style (enforced by Prettier / ESLint)

- 4-space indent, single quotes, semicolons, `printWidth: 120`, `bracketSpacing: false` (so `{foo}` not `{ foo }`), `arrowParens: 'avoid'`, no trailing commas.
- Import order (auto-sorted): third-party → `@/types/*` → `@/*` → relative → `*.module.scss` last.
- `no-explicit-any` is an error (rest args excepted). Unused vars/args prefixed `_` are ignored.
- Class member ordering is enforced — see `eslint.config.ts` for the full order (static fields → instance fields by visibility → constructor → accessors → methods).