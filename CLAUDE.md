# CLAUDE.md — How Rich?

## 1. Project Overview

How Rich? is a production-grade web application that translates billionaire net worth into intuitive, real-world scale comparisons.

Instead of presenting abstract dollar figures, the system converts wealth into:

* Consumer goods (e.g., Big Macs, cars)
* Physical assets (e.g., homes, jets, yachts)
* Institutional benchmarks (e.g., NASA budget, national GDP)
* Historical wealth equivalents (e.g., Benjamin Franklin)
* Time-based consumption scenarios (“How Long?” mode)

The product is designed as **viral educational entertainment with neutral social commentary**, allowing users to independently interpret the scale of extreme wealth.

Core principle:
**Make incomprehensible numbers physically understandable.**

---

## 2. Core User Experience

1. User selects a billionaire from the Top 10 global rankings.
2. System loads the latest cached daily snapshot of wealth data.
3. User selects one or more comparison units.
4. System computes equivalent purchasing power.
5. Results are rendered through a multi-scale visualization engine.
6. User can switch between comparison modes:

   * What Can They Buy?
   * How Long Would It Last?
   * Compared To What?
   * Scale Ladder (auto-generated narrative view)
7. Results are shareable as optimized visual cards.

---

## 3. Product Modes

### 3.1 What Can They Buy?

Standard purchasing power conversion.

Example outputs:

* 42,000,000 Big Macs
* 12,400 Lamborghinis
* 3,100 private jets

---

### 3.2 How Long Would It Last?

Time-normalized depletion model.

Examples:

* Spend $100,000/day → thousands of years
* Spend $1M/day → centuries
* Give away $1/sec → multiple lifetimes

Visual metaphors:

* calendars
* lifespans
* historical timelines

---

### 3.3 Compared To What?

Benchmark normalization against large-scale systems.

Examples:

* NASA annual budget equivalents
* GDP of Monaco
* Historical fortunes (e.g., Rockefeller)
* “Benjamin Franklin equivalents”

---

### 3.4 Scale Ladder (Auto-generated)

A progressive hierarchy of comparisons from smallest to largest:

* Individual objects → clusters → city-scale → geographic-scale abstractions

Example:

* 12 Lamborghinis
* 4,000 Lamborghinis (parking lots)
* 200,000 Lamborghinis (city-scale saturation)
* 1.2M Lamborghinis (country-scale abstraction)

This is the primary narrative visualization format.

---

## 4. Data Sources

### Billionaires

* Top 10 global rankings sourced daily from Forbes:
  https://www.forbes.com/billionaires/

* Data is cached locally after ingestion.

* System must never depend on live runtime scraping.

* If refresh fails, fallback to last successful dataset.

### Refresh Policy

* Daily scheduled job
* Persist snapshot history
* Maintain rank + net worth per day

---

## 5. Data Model

### billionaires

* id
* name
* image_url
* slug

### wealth_snapshots

* id
* billionaire_id
* date
* net_worth
* rank
* source

### comparison_units

* id
* name
* slug
* category (consumer / asset / benchmark)
* value (USD equivalent)
* icon_url
* description
* source_url
* active

### refresh_logs

* id
* started_at
* completed_at
* status
* message

---

## 6. Comparison Unit System

Comparison units are admin-managed content entities.

### Categories

#### Consumer Goods

* Big Mac
* iPhone
* Lamborghini Revuelto

#### Assets

* Average US home
* Private jet
* Superyacht

#### Benchmarks

* NASA annual budget
* Pentagon budget
* GDP of Monaco
* Historical fortunes (inflation-adjusted)

Design requirement:

* Prioritize recognizability and emotional intuition over technical precision.

---

## 7. Visualization Engine

### Requirements

* Must render individual units when feasible.
* Must progressively aggregate at scale.
* Must preserve human comprehension of magnitude at all levels.

### Rendering Strategy

1. **Object Layer**

   * Individual icons rendered via WebGL

2. **Cluster Layer**

   * Grouped sprites (10–10,000 units)

3. **Macro Layer**

   * Spatial metaphors (cities, grids, regions)

4. **Abstract Layer**

   * Fully aggregated numeric + visual hybrid

### Implementation

Use PixiJS for high-performance rendering:

* Sprite batching
* Zoomable canvas
* Level-of-detail system (LOD)
* Dynamic aggregation thresholds

---

## 8. Share System

Every result must generate a shareable card:

Includes:

* Billionaire name
* Selected comparison
* Result value
* Minimal visualization snapshot
* Brand signature

Design goal:

* Instant social media usability
* High visual clarity at mobile dimensions

---

## 9. Technical Architecture

### Frontend

* Next.js (App Router) — https://nextjs.org
* React — https://react.dev
* TypeScript — https://www.typescriptlang.org
* Tailwind CSS — https://tailwindcss.com
* Framer Motion — https://www.framer.com/motion

### Visualization

* PixiJS — https://pixijs.com

### Backend

* Next.js API Routes

### Database

* Supabase — https://supabase.com (PostgreSQL)

### Hosting

* Vercel — https://vercel.com

### Admin

* Supabase Admin UI (no custom admin in MVP)

---

## 10. Data Refresh System

* Scheduled daily ingestion job
* Fetch Forbes dataset
* Normalize and store snapshot
* Update rankings
* Log failures
* Never block UI on refresh failure

---

## 11. Functional Requirements

* Billionaire selector (Top 10)
* Multi-unit comparison selection
* Mode switching (4 modes)
* Scale ladder visualization
* Interactive zoomable visualization canvas
* Share card generation
* Historical snapshot browsing
* Search/filter comparison units

---

## 12. Non-Functional Requirements

* Production-grade stability
* Mobile-first responsiveness
* High-performance rendering
* Deterministic calculations
* Strong error handling
* Type-safe architecture
* SEO-friendly pages
* Fast initial load (<2s target)
* Graceful degradation for visualization overload

---

## 13. System Design Principles

* Data > opinion (neutral presentation)
* Scale must always remain legible
* Aggregation is mandatory at extreme values
* Visual intuition is prioritized over numerical precision display
* Every feature must support shareability or comprehension

---

## 14. Error Handling Strategy

* Cached dataset is always authoritative fallback
* Visualization engine must degrade gracefully
* API failures must not break UI rendering
* Partial data must still produce valid outputs

---

## 15. Testing Strategy

* Unit tests for conversion logic
* Snapshot tests for calculation outputs
* Visualization regression tests (LOD transitions)
* API contract tests
* End-to-end flows for:

  * billionaire selection
  * comparison calculation
  * share card generation

---

## 16. Deployment Strategy

* Continuous deployment via Vercel
* Supabase managed backend
* Scheduled cron jobs for data refresh
* Feature flags for visualization modes

---

## 17. Future Roadmap

* “Custom billionaire” input mode
* Time-based animation mode (“wealth decay simulation”)
* Geographic overlay comparisons
* Historical timeline exploration
* Educational mode for classrooms
* API access for journalists
* Expanded dataset beyond top 10 billionaires

---

## 18. Development Guidance for Claude Code

* Prioritize correctness of calculations over UI polish in early phases
* Build visualization engine incrementally (LOD system first)
* Treat comparison units as content, not code
* Ensure all values are derived from a single normalized USD baseline
* Avoid premature optimization outside rendering layer
* Keep architecture modular for future comparison categories

---

## 19. Core Product Insight

The system exists to answer one question:

> What does extreme wealth actually mean in physical reality?

Everything in the system should serve that transformation.
