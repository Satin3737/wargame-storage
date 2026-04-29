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

App Router project. Top-level layout:

- `app/` — Next.js App Router entry (`layout.tsx`, `page.tsx`, route-colocated `*.module.scss`). Global `<html>`/`<body>` and the Geist font CSS variable (`--f-geist-sans`) live in `app/layout.tsx`.
- `store/` — Zustand stores. `create-store.ts` exports a `createStore` factory that composes `persist` → `devtools` → `immer` middleware in that order; every store goes through it. `partializeInclude` / `partializeExclude` whitelist/blacklist persisted fields. `example-store.ts` is the canonical pattern (`IState` interface → `IStore` interface extending it with actions → `initialState` constant → `partialize` passed to `createStore`).
- `styles/` — global SCSS (`general.scss` is imported once in `app/layout.tsx`; also `reboot`, `helper`, `responsive`).
- `assets/`, `public/` — static assets.
- Path alias `@/*` → repo root (e.g. `@/styles/general.scss`, `@/store/...`).

Stack: **dexie** + `dexie-export-import` + `dexie-react-hooks` (IndexedDB) alongside zustand `persist` (localStorage); `zod` for validation, `axios` for HTTP, `react-toastify` for notifications, `@phosphor-icons/react` for icons, `date-fns`, `clsx`.

## Code style (enforced by Prettier / ESLint)

- 4-space indent, single quotes, semicolons, `printWidth: 120`, `bracketSpacing: false` (so `{foo}` not `{ foo }`), `arrowParens: 'avoid'`, no trailing commas.
- Import order (auto-sorted): third-party → `@/types/*` → `@/*` → relative → `*.module.scss` last.
- `no-explicit-any` is an error (rest args excepted). Unused vars/args prefixed `_` are ignored.
- Class member ordering is enforced — see `eslint.config.ts` for the full order (static fields → instance fields by visibility → constructor → accessors → methods).