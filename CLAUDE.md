# CLAUDE.md — How Rich?

## 1. Project Overview

How Rich? is a production web application that translates billionaire net worth into intuitive, real-world scale comparisons.

Instead of abstract dollar figures, the system converts wealth into:

* Consumer goods (Big Macs, iPhones, Lamborghinis)
* Physical assets (homes, jets, yachts, aircraft carriers)
* Institutional benchmarks (NASA budget, national GDPs)
* Time-based depletion scenarios ("How Long Would It Last?")

The product is designed as **viral educational entertainment with neutral social commentary**.

Core principle: **Make incomprehensible numbers physically understandable.**

---

## 2. Current State (as of June 2026)

### What is live

* Billionaire selector — Top 10 from Forbes, refreshed daily
* Two comparison modes: **What Can They Buy?** and **How Long Would It Last?**
* Single-item comparison selection with category filter (All / Assets / Benchmarks / Consumer Goods)
* Canvas 2D visualization — near-square dot grid that scales from emoji icons down to 1px amber dots
* Share card — native share API, renders a branded result card
* Daily data refresh — Forbes billionaires + Coinbase gold price, via Vercel cron

### What exists in code but is not wired to the UI

* `ComparedToWhat` component (`components/modes/ComparedToWhat.tsx`)
* `ScaleLadder` component (`components/modes/ScaleLadder.tsx`)
* `lib/calculations/benchmarks.ts` and `lib/calculations/scaleLadder.ts`
* The `ComparisonMode` type includes `'benchmark'` and `'ladder'` but `ModeSelector` only exposes `'time'` and `'buy'`

### What is not yet built

* Historical snapshot browsing
* Search / filter within comparison unit grid
* Geographic overlay comparisons
* Custom billionaire input
* Slug-based SEO pages for each billionaire (route stub exists at `app/[slug]/page.tsx`)

---

## 3. Implemented Modes

### 3.1 What Can They Buy? (`mode = 'buy'`)

Single comparison unit selection. Shows:
* Result card: unit name + formatted quantity
* Visualization canvas (dot grid — see §7)
* Shareable card

### 3.2 How Long Would It Last? (`mode = 'time'`)

Five spend rates rendered as a list:

| Spend Rate | Amount/day |
|---|---|
| $1/second | $86,400 |
| $1,000/day | $1,000 |
| $100,000/day | $100,000 |
| $1M/day | $1,000,000 |
| $1B/day | $1,000,000,000 |

Duration formatted from hours up to "million years".

---

## 4. Data Sources

### Billionaires

* Forbes JSON API — real-time billionaires list (RTB endpoint, falls back to annual list):
  ```
  https://www.forbes.com/forbesapi/person/rtb/0/position/true.json
  https://www.forbes.com/forbesapi/person/billionaires/0/position/true.json
  ```
* Requests are proxied through **ScraperAPI** (env: `SCRAPER_API_KEY`) to bypass Cloudflare blocking of Vercel datacenter IPs
* Top 10 by rank are stored; page always shows only the most recent refresh date's snapshot

### Gold price

* Coinbase public API — no auth required:
  ```
  GET https://api.coinbase.com/v2/prices/XAU-USD/spot
  ```
* 1 troy oz price × 32,150.75 oz/tonne = tonne value
* Updated daily in `comparison_units` alongside Forbes refresh

### Refresh policy

* Vercel cron: `POST /api/refresh` at 06:00 UTC daily (`vercel.json`)
* Auth: `x-cron-secret` header checked against `CRON_SECRET` env var
* On failure: UI falls back to last successful dataset; refresh log records error

---

## 5. Data Model

### `billionaires`
| column | type |
|---|---|
| id | uuid PK |
| name | text |
| slug | text unique |
| image_url | text nullable |

### `wealth_snapshots`
| column | type |
|---|---|
| id | uuid PK |
| billionaire_id | uuid FK |
| date | date |
| net_worth | bigint (USD) |
| rank | int |
| source | text |

Unique constraint: `(billionaire_id, date)`

### `comparison_units`
| column | type |
|---|---|
| id | uuid PK |
| name | text |
| slug | text unique |
| category | text (`consumer` / `asset` / `benchmark`) |
| value | numeric (USD) |
| description | text |
| source_url | text |
| active | boolean |

### `refresh_logs`
| column | type |
|---|---|
| id | uuid PK |
| started_at | timestamptz |
| completed_at | timestamptz nullable |
| status | text (`partial` / `success` / `failure`) |
| message | text nullable |

All tables have RLS enabled with public-read policies. Write access requires the service role key.

---

## 6. Comparison Units (current seed data)

### Consumer Goods
| Name | Value |
|---|---|
| Big Mac | $5.69 |
| Starbucks Latte | $7.00 |
| Netflix Subscription | $22.99 |
| iPhone 16 Pro | $999 |
| Lamborghini Revuelto | $517,770 |

### Assets
| Name | Value |
|---|---|
| Average US Home | $420,000 |
| Tonne of Gold | ~$106M (live — updated daily) |
| Private Jet (Gulfstream G650) | $65M |
| Commercial Boeing 737 MAX | $100M |
| Superyacht (90m) | $300M |
| Aircraft Carrier (USS Gerald R. Ford) | $13.3B |

### Benchmarks
| Name | Value |
|---|---|
| GDP of Monaco | $9B |
| NASA Annual Budget | $25.4B |
| Harvard Endowment | $51B |
| GDP of New Zealand | $252B |
| Rockefeller Fortune (inflation-adjusted) | $340B |
| Pentagon Annual Budget | $858B |

---

## 7. Visualization Engine

Implemented in `components/visualization/VisualizationCanvas.tsx` using **Canvas 2D** (not PixiJS).

### Grid layout algorithm

```
cols = round(√quantity)          // near-square grid
cellPx = containerWidth / cols   // natural cell size
clamp cellPx to [3px, 48px]      // 3px min = visible dot; 48px max = emoji
```

### Rendering tiers

| Cell size | Render method |
|---|---|
| ≥ 14px | Emoji icon (unit-specific, e.g. 🍔 🏎️ 🏠) |
| 3–14px | Amber filled circle (arc call per dot) |
| < 3px | Not reached — MIN_CELL_PX = 3 enforced |

### Scale handling

* If `neededHeight ≤ 1200px`: render every item individually; canvas grows to fit
* If `neededHeight > 1200px`: **representational mode** — fill a 480px canvas with dots, each dot = N items; label shows "1 dot ≈ N [unit name]"
* Canvas width is responsive via `ResizeObserver`

---

## 8. Share System

`components/ShareCard.tsx` renders a branded card div and calls `lib/share/generateCard.ts` which uses the native Web Share API. The share card includes:

* Billionaire name
* Formatted quantity
* Unit name
* Brand URL (`howrich.app`)

---

## 9. Technical Architecture

### Frontend
* **Next.js 16** — App Router, `force-dynamic` on the home page
* **React** with `'use client'` boundaries at the component level
* **TypeScript** — strict, all code is type-checked
* **Tailwind CSS v4**
* **Framer Motion** — entry animations on cards and grids

### Backend
* **Next.js API Routes**:
  * `POST /api/refresh` — Forbes + gold price ingestion (cron)
  * `GET /api/billionaires` — list all
  * `GET /api/billionaires/[slug]` — single billionaire
  * `GET /api/comparison-units` — list active units

### Database
* **Supabase** (PostgreSQL) with Row Level Security
* Client created via `lib/supabase.ts`:
  * `createServiceClient()` — server-side, uses service role key
  * `createPublicClient()` — client-side, uses anon key

### Hosting & CI
* **Vercel** — continuous deployment from `main`
* Vercel cron triggers `/api/refresh` daily

---

## 10. Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase public (anon) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server only) |
| `CRON_SECRET` | Yes | Auth header for `/api/refresh` cron |
| `SCRAPER_API_KEY` | Yes | ScraperAPI key for Forbes proxy |

---

## 11. Key Files

```
app/
  page.tsx                    — server component, fetches billionaires + units
  HomeClient.tsx              — main client orchestrator (mode, selection state)
  [slug]/page.tsx             — billionaire permalink (stub)
  api/refresh/route.ts        — cron endpoint

components/
  BillionaireSelector.tsx     — top-10 grid with avatar + rank + net worth
  ModeSelector.tsx            — tab bar (time / buy)
  ComparisonUnitGrid.tsx      — single-select grid with category filter
  modes/
    WhatCanTheyBuy.tsx        — buy mode result card
    HowLongWouldItLast.tsx    — time mode spend-rate list
    ComparedToWhat.tsx        — (not in UI yet)
    ScaleLadder.tsx           — (not in UI yet)
  visualization/
    VisualizationCanvas.tsx   — Canvas 2D dot grid renderer
  ShareCard.tsx               — branded share card + share button
  ErrorBoundary.tsx           — wraps every major section
  Skeleton.tsx                — loading placeholders

lib/
  supabase.ts                 — DB client factory
  database.types.ts           — shared TypeScript types
  calculations/
    buyPower.ts               — floor(netWorth / unitValue), formatted
    timeBurn.ts               — depletion duration at spend rates
    benchmarks.ts             — (not in UI yet)
    scaleLadder.ts            — (not in UI yet)
    index.ts                  — re-exports + ComparisonMode type
  refresh/
    forbes.ts                 — Forbes JSON API fetcher (ScraperAPI proxy)
    goldPrice.ts              — Coinbase XAU-USD fetcher, DB upsert
    ingest.ts                 — orchestrates Forbes + gold refresh
  share/
    generateCard.ts           — native share API wrapper
  visualization/
    lodEngine.ts              — legacy LOD config (unused, kept for reference)

supabase/migrations/
  001_initial_schema.sql      — tables + RLS enable
  002_seed_comparison_units.sql
  003_seed_billionaires.sql
  004_gold_comparison_unit.sql — Tonne of Gold unit
```

---

## 12. Development Guidance

* The `ComparisonMode` type (`'buy' | 'time' | 'benchmark' | 'ladder'`) is broader than what `ModeSelector` exposes — adding a mode means adding it to `ModeSelector.MODES` and wiring a branch in `HomeClient`.
* All monetary values in `comparison_units.value` are stored in USD. Calculations are simple division — no currency conversion.
* The gold unit (`slug = 'tonne-of-gold'`) is the only dynamically-priced unit. Its value in the DB is the single source of truth; the Coinbase fetch only runs server-side during cron.
* `force-dynamic` on `app/page.tsx` means every request hits Supabase — acceptable since data is cached in the DB.
* `lodEngine.ts` is no longer used by `VisualizationCanvas` (replaced by the inline grid algorithm) but is kept in case the LOD approach is revisited.

---

## 13. Future Roadmap

* Wire up "Compared To What?" mode (component + calculations already exist)
* Wire up "Scale Ladder" mode (component + calculations already exist)
* Historical snapshot browsing
* Billionaire permalink SEO pages (`app/[slug]/page.tsx` stub)
* Search/filter within comparison unit grid
* Custom wealth input ("enter any amount")
* Expand beyond top 10 billionaires
* Educational / classroom mode
