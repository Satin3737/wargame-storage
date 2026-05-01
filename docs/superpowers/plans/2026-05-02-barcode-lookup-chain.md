# Barcode Lookup Chain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-provider `upcitemdb-service` with a strategy-pattern chain that tries UPCitemDB → go-upc.com → upcdatabase.org in order, returning the first `found` result.

**Architecture:** A `IBarcodeLookupProvider` interface is implemented by three provider classes. `BarcodeLookupService` holds a `IBarcodeLookupProvider[]` and iterates it; the first `found` wins. The singleton is constructed in the barrel `index.ts`, which also validates required env vars at module load.

**Tech Stack:** axios, zod, Next.js `NEXT_PUBLIC_*` env vars, TypeScript 6.

---

## File Map

| Action | Path |
|--------|------|
| Create | `services/barcode-lookup-service/types.ts` |
| Create | `services/barcode-lookup-service/barcode-lookup-service.ts` |
| Create | `services/barcode-lookup-service/providers/upcitemdb-provider.ts` |
| Create | `services/barcode-lookup-service/providers/go-upc-provider.ts` |
| Create | `services/barcode-lookup-service/providers/upcdatabase-provider.ts` |
| Create | `services/barcode-lookup-service/index.ts` |
| Create | `schemas/go-upc-response-schema.ts` |
| Create | `schemas/upcdatabase-response-schema.ts` |
| Create | `.env.local.example` |
| Modify | `schemas/index.ts` |
| Modify | `services/index.ts` |
| Modify | `components/product-form/product-form.tsx` |
| Delete | `services/upcitemdb-service/` (entire directory) |

---

### Task 1: Add Zod schemas for the two new providers

**Files:**
- Create: `schemas/go-upc-response-schema.ts`
- Create: `schemas/upcdatabase-response-schema.ts`
- Modify: `schemas/index.ts`

- [ ] **Step 1: Create `schemas/go-upc-response-schema.ts`**

```ts
import {z} from 'zod';

export const goUpcResponseSchema = z.object({
    code: z
        .object({
            name: z.string().optional()
        })
        .optional()
});

export type IGoUpcResponse = z.infer<typeof goUpcResponseSchema>;
```

- [ ] **Step 2: Create `schemas/upcdatabase-response-schema.ts`**

```ts
import {z} from 'zod';

export const upcDatabaseResponseSchema = z.object({
    title: z.string().optional()
});

export type IUpcDatabaseResponse = z.infer<typeof upcDatabaseResponseSchema>;
```

- [ ] **Step 3: Update `schemas/index.ts`**

Replace the entire file with:

```ts
export * from './product-schema';
export * from './upc-response-schema';
export * from './go-upc-response-schema';
export * from './upcdatabase-response-schema';
```

- [ ] **Step 4: Verify**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add schemas/go-upc-response-schema.ts schemas/upcdatabase-response-schema.ts schemas/index.ts
git commit -m "feat: add Zod schemas for go-upc and upcdatabase providers"
```

---

### Task 2: Create types — provider interface and result union

**Files:**
- Create: `services/barcode-lookup-service/types.ts`

- [ ] **Step 1: Create `services/barcode-lookup-service/types.ts`**

```ts
export type IUpcLookupResult =
    | {kind: 'found'; name: string}
    | {kind: 'not-found'}
    | {kind: 'rate-limited'}
    | {kind: 'error'};

export interface IBarcodeLookupProvider {
    lookup(barcode: string): Promise<IUpcLookupResult>;
}
```

- [ ] **Step 2: Verify**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add services/barcode-lookup-service/types.ts
git commit -m "feat: add IBarcodeLookupProvider interface and IUpcLookupResult type"
```

---

### Task 3: Create UPCitemDB provider

**Files:**
- Create: `services/barcode-lookup-service/providers/upcitemdb-provider.ts`

- [ ] **Step 1: Create `services/barcode-lookup-service/providers/upcitemdb-provider.ts`**

```ts
import axios from 'axios';
import {upcResponseSchema} from '@/schemas';
import type {IBarcodeLookupProvider, IUpcLookupResult} from '../types';

export class UpcItemDbProvider implements IBarcodeLookupProvider {
    private readonly endpoint = 'https://api.upcitemdb.com/prod/trial/lookup';

    public async lookup(barcode: string): Promise<IUpcLookupResult> {
        try {
            const {data} = await axios.get(this.endpoint, {
                params: {upc: barcode},
                timeout: 8000
            });

            const parsed = upcResponseSchema.safeParse(data);
            if (!parsed.success) return {kind: 'error'};

            const title = parsed.data.items?.[0]?.title?.trim();
            if (!title) return {kind: 'not-found'};

            return {kind: 'found', name: title};
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 429) {
                return {kind: 'rate-limited'};
            }
            return {kind: 'error'};
        }
    }
}
```

- [ ] **Step 2: Verify**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add services/barcode-lookup-service/providers/upcitemdb-provider.ts
git commit -m "feat: add UpcItemDbProvider"
```

---

### Task 4: Create go-upc.com provider

**Files:**
- Create: `services/barcode-lookup-service/providers/go-upc-provider.ts`

- [ ] **Step 1: Create `services/barcode-lookup-service/providers/go-upc-provider.ts`**

```ts
import axios from 'axios';
import {goUpcResponseSchema} from '@/schemas';
import type {IBarcodeLookupProvider, IUpcLookupResult} from '../types';

export class GoUpcProvider implements IBarcodeLookupProvider {
    private readonly endpoint = 'https://go-upc.com/api/v1/code';
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public async lookup(barcode: string): Promise<IUpcLookupResult> {
        try {
            const {data} = await axios.get(`${this.endpoint}/${barcode}`, {
                headers: {Authorization: `Bearer ${this.apiKey}`},
                timeout: 8000
            });

            const parsed = goUpcResponseSchema.safeParse(data);
            if (!parsed.success) return {kind: 'error'};

            const name = parsed.data.code?.name?.trim();
            if (!name) return {kind: 'not-found'};

            return {kind: 'found', name};
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 429) {
                return {kind: 'rate-limited'};
            }
            return {kind: 'error'};
        }
    }
}
```

- [ ] **Step 2: Verify**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add services/barcode-lookup-service/providers/go-upc-provider.ts
git commit -m "feat: add GoUpcProvider"
```

---

### Task 5: Create upcdatabase.org provider

**Files:**
- Create: `services/barcode-lookup-service/providers/upcdatabase-provider.ts`

- [ ] **Step 1: Create `services/barcode-lookup-service/providers/upcdatabase-provider.ts`**

```ts
import axios from 'axios';
import {upcDatabaseResponseSchema} from '@/schemas';
import type {IBarcodeLookupProvider, IUpcLookupResult} from '../types';

export class UpcDatabaseProvider implements IBarcodeLookupProvider {
    private readonly endpoint = 'https://api.upcdatabase.org/product';
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public async lookup(barcode: string): Promise<IUpcLookupResult> {
        try {
            const {data} = await axios.get(`${this.endpoint}/${barcode}`, {
                params: {apikey: this.apiKey},
                timeout: 8000
            });

            const parsed = upcDatabaseResponseSchema.safeParse(data);
            if (!parsed.success) return {kind: 'error'};

            const title = parsed.data.title?.trim();
            if (!title) return {kind: 'not-found'};

            return {kind: 'found', name: title};
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 429) {
                return {kind: 'rate-limited'};
            }
            return {kind: 'error'};
        }
    }
}
```

- [ ] **Step 2: Verify**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add services/barcode-lookup-service/providers/upcdatabase-provider.ts
git commit -m "feat: add UpcDatabaseProvider"
```

---

### Task 6: Create BarcodeLookupService chain runner

**Files:**
- Create: `services/barcode-lookup-service/barcode-lookup-service.ts`

- [ ] **Step 1: Create `services/barcode-lookup-service/barcode-lookup-service.ts`**

```ts
import type {IBarcodeLookupProvider, IUpcLookupResult} from './types';

class BarcodeLookupService {
    private readonly providers: IBarcodeLookupProvider[];

    constructor(providers: IBarcodeLookupProvider[]) {
        this.providers = providers;
    }

    public async lookup(barcode: string): Promise<IUpcLookupResult> {
        const trimmed = barcode.trim();
        if (!trimmed) return {kind: 'not-found'};

        for (const provider of this.providers) {
            const result = await provider.lookup(trimmed);
            if (result.kind === 'found') return result;
        }

        return {kind: 'not-found'};
    }
}

export default BarcodeLookupService;
```

- [ ] **Step 2: Verify**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add services/barcode-lookup-service/barcode-lookup-service.ts
git commit -m "feat: add BarcodeLookupService chain runner"
```

---

### Task 7: Wire up singleton and create barrel

**Files:**
- Create: `services/barcode-lookup-service/index.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Create `services/barcode-lookup-service/index.ts`**

```ts
import BarcodeLookupService from './barcode-lookup-service';
import {GoUpcProvider} from './providers/go-upc-provider';
import {UpcDatabaseProvider} from './providers/upcdatabase-provider';
import {UpcItemDbProvider} from './providers/upcitemdb-provider';

const goUpcKey = process.env.NEXT_PUBLIC_GO_UPC_API_KEY;
const upcDatabaseKey = process.env.NEXT_PUBLIC_UPCDATABASE_API_KEY;

if (!goUpcKey) throw new Error('NEXT_PUBLIC_GO_UPC_API_KEY is not set');
if (!upcDatabaseKey) throw new Error('NEXT_PUBLIC_UPCDATABASE_API_KEY is not set');

const barcodeLookupService = new BarcodeLookupService([
    new UpcItemDbProvider(),
    new GoUpcProvider(goUpcKey),
    new UpcDatabaseProvider(upcDatabaseKey)
]);

export default barcodeLookupService;
export type {IUpcLookupResult} from './types';
```

- [ ] **Step 2: Create `.env.local.example`**

```
NEXT_PUBLIC_GO_UPC_API_KEY=your_go_upc_key_here
NEXT_PUBLIC_UPCDATABASE_API_KEY=your_upcdatabase_key_here
```

- [ ] **Step 3: Verify**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add services/barcode-lookup-service/index.ts .env.local.example
git commit -m "feat: wire up barcodeLookupService singleton with env var validation"
```

---

### Task 8: Update services barrel and product-form consumer

**Files:**
- Modify: `services/index.ts`
- Modify: `components/product-form/product-form.tsx`

- [ ] **Step 1: Update `services/index.ts`**

Replace the entire file with:

```ts
export {default as exportService} from './export-service';
export {default as hapticsService} from './haptics-service';
export {default as toastService} from './toast-service';
export {default as barcodeLookupService, type IUpcLookupResult} from './barcode-lookup-service';
```

- [ ] **Step 2: Update `components/product-form/product-form.tsx` line 10**

Change:

```ts
import {hapticsService, toastService, upcLookupService} from '@/services';
```

To:

```ts
import {barcodeLookupService, hapticsService, toastService} from '@/services';
```

- [ ] **Step 3: Update `components/product-form/product-form.tsx` line 102**

Change:

```ts
const result = await upcLookupService.lookup(trimmed);
```

To:

```ts
const result = await barcodeLookupService.lookup(trimmed);
```

- [ ] **Step 4: Verify**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add services/index.ts components/product-form/product-form.tsx
git commit -m "feat: wire barcodeLookupService into services barrel and product-form"
```

---

### Task 9: Delete old upcitemdb-service and final verification

**Files:**
- Delete: `services/upcitemdb-service/` (entire directory)

- [ ] **Step 1: Delete old service directory**

```bash
rm -rf services/upcitemdb-service
```

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: no errors.

- [ ] **Step 3: Run type check**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: remove upcitemdb-service — replaced by barcode-lookup-service"
```

---

### Task 10: Create `.env.local` with real keys and smoke-test

- [ ] **Step 1: Create `.env.local`** (not committed — already in `.gitignore` by Next.js convention)

```
NEXT_PUBLIC_GO_UPC_API_KEY=<your real go-upc.com key>
NEXT_PUBLIC_UPCDATABASE_API_KEY=<your real upcdatabase.org key>
```

Obtain keys by signing up at:
- go-upc.com: https://go-upc.com/dashboard (free tier: 100 req/month)
- upcdatabase.org: https://upcdatabase.org/api (free tier: 100 req/day)

- [ ] **Step 2: Start dev server**

```bash
pnpm dev
```

Expected: server starts without throwing `is not set` errors.

- [ ] **Step 3: Manual smoke test**

Navigate to `http://localhost:3000/add`, enter a known barcode (e.g. `0012000161155` — Pepsi 2L), click Поиск. Expected: toast shows product name found.

- [ ] **Step 4: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: add .env.local.example with barcode API key placeholders"
```
