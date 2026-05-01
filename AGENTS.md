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
- `hooks/` — `useLiveQuery`-based hooks (`useProduct`, `useProducts`, `useSimilarProducts`). All are `'use client'` and return live-reactive data from Dexie. `useProducts` accepts an `IProductsFilter` (category, search, sort, out-of-stock flag) and does client-side filtering/sorting. `useObjectUrl` manages a `URL.createObjectURL` lifecycle.
- `schemas/` — Zod schemas: `productFormSchema` (validates add/edit form) and `upcResponseSchema` (validates UPC Item DB API responses).
- `helpers/` — Pure utilities. `compareProducts` drives the sort in `useProducts`.
- `services/` — Singleton service classes:
  - `upcLookupService` — calls `api.upcitemdb.com` to resolve a barcode to a product name; returns a discriminated union `{kind: 'found'|'not-found'|'rate-limited'|'error'}`.
  - `exportService` — builds an `.xlsx` via `exceljs` (dynamically imported) with embedded photos, then delivers it via the Web Share API (files) or a fallback `<a download>`.
  - `toastService` — thin wrapper around `react-toastify`.
  - `hapticsService` — vibration feedback.
- `components/` — All client components. Organised as:
  - `components/ui/` — design-system primitives (`Button`, `IconButton`, `TextInput`, `Select`, `Checkbox`, `Modal`, `Spinner`). Import from `@/components` barrel or the direct sub-path.
  - `components/app-header/` — top bar with optional back link.
  - `components/page-shell/` — scroll container that wraps every page body.
  - `components/product-form/` — add/edit form. Uses React context (`form-context.ts`) + a custom hook (`form-hook.ts`) to share state across sub-components (`BarcodeScanner`, `PhotoField`, `CategoryField`, `NumberField`, `TextField`, `SubmitButton`, `SimilarProducts`). `ProductFormMode` enum selects create vs. edit behaviour.
  - `components/product-grid/` — home-page grid. Contains `FilterBar`, `ProductCard`, and `PhotoModal`.
  - `components/toast-host/` — mounts `<ToastContainer>`.
- `constants/` — `Category` const-object + `ICategory` type + `CategoryValues` array + `CategoryLabel` Russian labels.
- `store/` — Zustand stores (not yet used by the main feature code). `createStore` factory composes `persist` → `devtools` → `immer`; see `example-store.ts` for the canonical pattern.
- `styles/` — global SCSS (`general.scss` imported once in `app/layout.tsx`; also `reboot`, `helper`, `responsive`).
- Path alias `@/*` → repo root.

Stack: **dexie** + `dexie-react-hooks` (IndexedDB); `zod`; `axios`; `exceljs` (dynamic import, xlsx export); `react-toastify`; `@phosphor-icons/react`; `clsx`.

## Code style (enforced by Prettier / ESLint)

- 4-space indent, single quotes, semicolons, `printWidth: 120`, `bracketSpacing: false` (so `{foo}` not `{ foo }`), `arrowParens: 'avoid'`, no trailing commas.
- Import order (auto-sorted): third-party → `@/types/*` → `@/*` → relative → `*.module.scss` last.
- `no-explicit-any` is an error (rest args excepted). Unused vars/args prefixed `_` are ignored.
- Class member ordering is enforced — see `eslint.config.ts` for the full order (static fields → instance fields by visibility → constructor → accessors → methods).