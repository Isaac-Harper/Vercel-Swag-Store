# Vercel Swag Store

A Next.js 16 storefront for Vercel/Next.js-themed merchandise.

**Deployed:** https://vercel-swag-store-eta.vercel.app

## What's inside

- **Home** (`/`) — hero + featured products carousel
- **Search** (`/search`) — full-text search, category filter, pagination
- **Product detail** (`/products/[slug]`) — dynamic page with streamed stock, OG image, Add to Cart
- **Cart** (`/cart`) — session cart (httpOnly cookie token), quantity edits, checkout
- **Markdown endpoints** (`/md/...`) — same content served as `text/markdown` for AI agents (Claude, GPTBot, etc.), advertised via `Link` headers and the `/robots.txt` Content-Signal policy

## Architecture

```
src/
  app/               # App Router: page.tsx, layout.tsx, route handlers, md/ alternates
  components/        # layout/, product/, cart/, search/, ui/ — one component per file
  lib/
    api/             # fetch wrappers: products, cart, categories, promo, store
    cart.ts          # cookie read/write for the cart token
    markdown.ts      # markdownResponse + product markdown helpers
  actions/           # server actions: cart mutations, checkout
  types/             # Zod-validated API response envelopes
  proxy.ts           # Next.js middleware — see below
```

Backend API lives at `$PRODUCTS_API_URL` (default `https://vercel-swag-store-api.vercel.app/api`). Responses are validated with Zod at the client boundary (`src/lib/api/`).

## Cache Components + Suspense

`cacheComponents: true` is enabled in `next.config.js`. Data fetchers under `src/lib/api/` use `'use cache'` with `cacheLife` / `cacheTag`:

| Fetcher | TTL | Notes |
|---|---|---|
| `listProducts`, `getProduct`, `listCategories` | `hours` | Catalog data |
| `getStoreConfig` | `days` | Static store config |
| `getActivePromo` | `minutes` | Promo banner |
| `fetchCartByToken` | `minutes` + `cartCacheTag(token)` | Invalidated on cart mutations |
| `getProductStock` | **uncached** | Real-time stock; wrapped by `getProductStockCached` where staleness is acceptable |

Suspense boundaries stream the volatile parts around the cached shell:

- `app/layout.tsx` — `<CartBadgeAsync>` streams into the header
- `app/page.tsx` — `<Featured>` and `<HomeJsonLd>` each in their own boundary
- `app/products/[slug]/page.tsx` — `<ProductStockAndCart>` streams live stock
- `app/search/page.tsx` — separate boundaries for form state and results
- `app/cart/page.tsx` — cart page receives unawaited promises that its inner Suspense resolves

Net effect: the cached catalog paints immediately; stock, cart counts, and cart contents arrive as they resolve.

## `src/proxy.ts`

Markdown content negotiation, nothing else. Inspects `Accept`; if `text/markdown` outranks `text/html`, it rewrites `/`, `/search`, and `/products/:slug` to the parallel `/md/...` route handlers. Browsers are unaffected. No auth, no transforms, no other routes.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `PRODUCTS_API_URL` | no (has default) | Backend API base URL |
| `VERCEL_API_BYPASS_TOKEN` | in protected deploys | Sent as `x-vercel-protection-bypass` on API requests |
| `NEXT_PUBLIC_SITE_URL` | no (has default) | Canonical site URL — OG images, sitemap, JSON-LD, markdown absolute links |

`VERCEL_ENV` is auto-injected by Vercel; non-production deploys receive `X-Robots-Tag: noindex`.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm start
```

## Test

```bash
pnpm test:setup   # playwright install (first time)
pnpm test:e2e     # Playwright — browser flows
pnpm test:api     # Playwright — request-level checks
pnpm test:unit    # Jest + Testing Library
pnpm test         # all three
```

`tests/playwright.e2e-config.ts` boots `pnpm dev` automatically. To run against a deployed URL instead, set `PLAYWRIGHT_BASE_URL` (the dev-server boot is skipped). Browsers covered: chromium, firefox, webkit, mobile-chrome.

| Suite | Spec | What it covers |
|---|---|---|
| e2e | `home.spec.ts` | Hero renders; featured grid streams in; header link navigates to `/search` |
| e2e | `search.spec.ts` | Results + pagination render; product card opens detail page; submitting `q` updates the URL |
| e2e | `cart.spec.ts` | Add-to-cart bumps the header badge optimistically; `/cart` opens the drawer dialog |
| api | `agent-friendly.spec.ts` | `robots.txt` (AI bot rules, Content-Signal, sitemap); `Accept: text/markdown` negotiation on `/` and `/products/[slug]`; `Link: rel="alternate"` + `Vary: Accept` headers |
| unit | `page.test.tsx` | Home page renders a `<main>` landmark under jsdom |
