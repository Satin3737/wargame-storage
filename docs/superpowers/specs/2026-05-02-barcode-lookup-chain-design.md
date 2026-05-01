# Barcode Lookup Chain — Design Spec

**Date:** 2026-05-02

## Overview

Replace the single-provider `upcitemdb-service` with a multi-provider barcode lookup chain using the strategy pattern. Providers are tried in order; the first `found` result wins. If all providers are exhausted the service returns `not-found`.

**Chain order:** UPCitemDB → go-upc.com → upcdatabase.org → `not-found`

---

## Architecture

### File Structure

```
services/barcode-lookup-service/
  index.ts                        # re-exports barcodeLookupService + IUpcLookupResult
  types.ts                        # IBarcodeLookupProvider interface + IUpcLookupResult
  barcode-lookup-service.ts       # BarcodeLookupService — holds IBarcodeLookupProvider[], walks chain
  providers/
    upcitemdb-provider.ts
    go-upc-provider.ts
    upcdatabase-provider.ts
schemas/
  upc-response-schema.ts          # existing (unchanged)
  go-upc-response-schema.ts       # new
  upcdatabase-response-schema.ts  # new
```

The old `services/upcitemdb-service/` directory is deleted. `services/index.ts` re-exports `barcodeLookupService` (renamed from `upcLookupService`). The call site in `product-form.tsx` is updated to the new name.

### Provider Interface

```ts
interface IBarcodeLookupProvider {
    lookup(barcode: string): Promise<IUpcLookupResult>;
}
```

### Chain Runner (`BarcodeLookupService`)

- Constructor receives `IBarcodeLookupProvider[]`.
- `lookup(barcode)`: iterates providers in order. On `found` — return immediately. On `not-found`, `rate-limited`, or `error` — try next. If all exhausted — return `not-found`.
- The singleton exported from `index.ts` is constructed with `[upcitemdbProvider, goUpcProvider, upcDatabaseProvider]`.

---

## API Keys

| Provider | Env var | Required |
|----------|---------|----------|
| UPCitemDB | — | No key needed |
| go-upc.com | `NEXT_PUBLIC_GO_UPC_API_KEY` | Yes |
| upcdatabase.org | `NEXT_PUBLIC_UPCDATABASE_API_KEY` | Yes |

Both keys are validated at module load time (when the singleton is constructed). A missing key throws immediately so the app fails fast rather than failing silently at lookup time.

---

## Providers

All providers share: 8 s axios timeout, same `IUpcLookupResult` return type.

### UPCitemDB

- `GET https://api.upcitemdb.com/prod/trial/lookup?upc=<barcode>`
- No auth header required.
- Existing Zod schema (`upcResponseSchema`) and logic preserved.

### go-upc.com

- `GET https://go-upc.com/api/v1/code/<barcode>`
- `Authorization: Bearer <NEXT_PUBLIC_GO_UPC_API_KEY>`
- Response shape: `{code: {name, description, brand, ...}}`
- Zod schema: `goUpcResponseSchema` — validates `code.name` (string, optional).

### upcdatabase.org

- `GET https://api.upcdatabase.org/product/<barcode>?apikey=<NEXT_PUBLIC_UPCDATABASE_API_KEY>`
- Response shape: `{title, description, ...}`
- Zod schema: `upcDatabaseResponseSchema` — validates `title` (string, optional).

---

## Error Mapping (all providers)

| Condition | Result |
|-----------|--------|
| Parse success + title/name present | `found` |
| Parse success + no title/name | `not-found` |
| HTTP 429 | `rate-limited` |
| Zod parse failure | `error` |
| Network / timeout | `error` |

---

## Schemas

Three separate Zod schemas, one per provider, colocated in `schemas/`. Each only validates the fields the provider actually uses (title/name). `schemas/index.ts` exports all three.

---

## Consumer Impact

- `product-form.tsx`: import changes from `upcLookupService` → `barcodeLookupService`. Call signature (`lookup(barcode)`) and return type (`IUpcLookupResult`) are unchanged.
- No other consumers.
