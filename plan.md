# SpaceX Dashboard - Implementation Plan

## Project Overview
A comprehensive SpaceX dashboard using Next.js 16, React 19, TypeScript, SWR, and Tailwind CSS v4.

**Technology Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- SWR (client-side data fetching with caching)
- Tailwind CSS v4
- Zod (runtime validation)
- Recharts (data visualization)
- date-fns (date formatting)

---

## ✅ Completed

### Phase 1: Foundation ✅ (100% Complete)

**Dependencies Installed:**
- ✅ swr
- ✅ recharts
- ✅ date-fns
- ✅ zod
- ✅ clsx
- ✅ tailwind-merge

**Core Infrastructure:**
- ✅ SWR fetcher functions with Zod validation (`lib/api/fetcher.ts`)
- ✅ SWR configuration with refresh intervals (`lib/api/swr-config.ts`)
- ✅ SWR provider component (`components/providers/swr-provider.tsx`)
- ✅ className utility function (`lib/utils/cn.ts`)
- ✅ Date formatting utilities (`lib/utils/format-date.ts`)

**UI Component Library:**
- ✅ Card component with Header, Title, Description, Content (`components/ui/card.tsx`)
- ✅ Button component with variants (primary, secondary, outline, ghost) (`components/ui/button.tsx`)
- ✅ Badge component with variants (success, failure, neutral, warning) (`components/ui/badge.tsx`)
- ✅ Skeleton loading components (`components/ui/skeleton.tsx`)
- ✅ Error message component with retry (`components/ui/error-message.tsx`)

**Navigation:**
- ✅ Navigation constants with grouped structure (`lib/constants/navigation.ts`)
  - Missions: Launches, Payloads, History
  - Fleet: Rockets, Dragons, Capsules, Cores, Ships
  - Infrastructure: Launch Pads, Landing Pads
  - Data: Starlink, Analytics
  - More: Crew, Company, Roadster
- ✅ Main navigation component with dropdowns (`components/layout/main-nav.tsx`)
- ✅ Mobile-responsive navigation with hamburger menu
- ✅ Root layout updated with SWR provider and navigation (`app/layout.tsx`)

### Phase 2: Launches Implementation ✅ (100% Complete)

**Type System:**
- ✅ Zod schema for launches with full validation (`lib/schemas/launches.schema.ts`)
- ✅ TypeScript types inferred from Zod schema

**SWR Hooks:**
- ✅ `useLaunches()` - Fetch all launches
- ✅ `useLaunchById(id)` - Fetch single launch by ID
- ✅ `useUpcomingLaunches()` - Fetch upcoming launches
- ✅ `usePastLaunches()` - Fetch past launches
- ✅ `useLatestLaunch()` - Fetch latest launch
- ✅ `useNextLaunch()` - Fetch next launch

**Components:**
- ✅ Launch card component (`components/launches/launch-card.tsx`)
- ✅ Launches list page with filtering and sorting (`app/(resources)/launches/page.tsx`)
  - Search by name
  - Filter by status (All, Upcoming, Past, Success, Failure)
  - Sort by date (Newest/Oldest first)
  - Results count display
- ✅ Launch detail page (`app/(resources)/launches/[id]/page.tsx`)
  - Mission details
  - Launch information
  - Core information with landing data
  - Failures display
  - Links & resources
  - Flickr photos gallery

**Homepage:**
- ✅ Dynamic homepage (`app/page.tsx`)
- ✅ Latest launch card
- ✅ Next launch card
- ✅ Quick links to all resource categories

**Dev Server:**
- ✅ Running successfully on http://localhost:3000

### Phase 3: Priority Resources (Starlink, Payloads) ✅ (100% Complete)

**Starlink:**
- ✅ Create Zod schema for Starlink (`lib/schemas/starlink.schema.ts`)
- ✅ Create SWR hooks (`hooks/use-starlink.ts`)
- ✅ Create Starlink card component (`components/starlink/starlink-card.tsx`)
- ✅ Create Starlink list page (`app/(resources)/starlink/page.tsx`)
  - Search by name or NORAD ID
  - Filter by Active/Deorbited status
  - Sort by Launch Date, Altitude, Name
- ✅ Create Starlink detail page (`app/(resources)/starlink/[id]/page.tsx`)
  - Current position with lat/long/altitude/velocity
  - Complete orbital elements
  - Launch information
  - TLE (Two-Line Element) data

**Payloads:**
- ✅ Create Zod schema for Payloads (`lib/schemas/payloads.schema.ts`)
- ✅ Create SWR hooks (`hooks/use-payloads.ts`)
- ✅ Create Payload card component (`components/payloads/payload-card.tsx`)
- ✅ Create Payloads list page (`app/(resources)/payloads/page.tsx`)
  - Search by name or type
  - Filter by Reuse status and Dragon missions
  - Sort by Name or Mass
- ✅ Create Payload detail page (`app/(resources)/payloads/[id]/page.tsx`)
  - Physical properties (mass, manufacturers, nationalities)
  - Customer information
  - Orbital parameters
  - Dragon mission data (conditional)
  - Tracking information (NORAD IDs)

**Navigation:**
- ✅ Fixed navigation menu to use click-based dropdowns instead of hover
- ✅ Dropdowns stay open until explicitly closed
- ✅ Added click-outside detection to close dropdowns

---

## 📋 To Do

### Phase 4: Remaining Resources

**Rockets (24h refresh):**
- ⬜ Zod schema + types
- ⬜ SWR hooks
- ⬜ Card component
- ⬜ List page with specifications
- ⬜ Detail page with detailed specs

**Dragons (24h refresh):**
- ⬜ Zod schema + types
- ⬜ SWR hooks
- ⬜ Card component
- ⬜ List page
- ⬜ Detail page

**Capsules (5min refresh):**
- ⬜ Zod schema + types
- ⬜ SWR hooks
- ⬜ Card component
- ⬜ List page
- ⬜ Detail page

**Cores (5min refresh):**
- ⬜ Zod schema + types
- ⬜ SWR hooks
- ⬜ Card component
- ⬜ List page
- ⬜ Detail page

**Crew (5min refresh):**
- ⬜ Zod schema + types
- ⬜ SWR hooks
- ⬜ Card component
- ⬜ List page (crew members)
- ⬜ Detail page (crew member profile)

**Ships (5min refresh):**
- ⬜ Zod schema + types
- ⬜ SWR hooks
- ⬜ Card component
- ⬜ List page
- ⬜ Detail page

**Launchpads (5min refresh):**
- ⬜ Zod schema + types
- ⬜ SWR hooks
- ⬜ Card component
- ⬜ List page
- ⬜ Detail page

**Landpads (5min refresh):**
- ⬜ Zod schema + types
- ⬜ SWR hooks
- ⬜ Card component
- ⬜ List page
- ⬜ Detail page

**History (5min refresh):**
- ⬜ Zod schema + types
- ⬜ SWR hooks
- ⬜ Card component
- ⬜ List page (timeline/events)
- ⬜ Detail page (event details)

**Company (24h refresh - single page):**
- ⬜ Zod schema + types
- ⬜ SWR hook
- ⬜ Single page component (`app/(resources)/company/page.tsx`)
- ⬜ Display company info, headquarters, CEO, employees, etc.

**Roadster (24h refresh - single page):**
- ⬜ Zod schema + types
- ⬜ SWR hook
- ⬜ Single page component (`app/(resources)/roadster/page.tsx`)
- ⬜ Display Tesla Roadster trajectory data

### Phase 5: Analytics & Data Visualization

**Analytics Utilities:**
- ⬜ Create analytics helper functions (`lib/utils/analytics-helpers.ts`)
  - `calculateSuccessRate(launches)` - For pie chart
  - `groupLaunchesByYear(launches)` - For area chart
  - `calculatePayloadDistribution(payloads)` - For histogram
  - `calculateRocketUsage(launches, rockets)` - For bar chart

**Chart Components:**
- ⬜ Chart wrapper component (`components/analytics/chart-wrapper.tsx`)
- ⬜ Launch success rate pie chart (`components/analytics/launch-success-chart.tsx`)
- ⬜ Launches over time area chart (`components/analytics/launches-over-time-chart.tsx`)
- ⬜ Payload mass histogram (`components/analytics/payload-mass-histogram.tsx`)
- ⬜ Rocket usage bar chart (`components/analytics/rocket-usage-chart.tsx`)

**Analytics Page:**
- ⬜ Create analytics page (`app/analytics/page.tsx`)
- ⬜ Aggregate data from multiple sources
- ⬜ Display multiple charts in grid layout
- ⬜ Add filters for date ranges

### Phase 6: Advanced Features (Optional)

**Infinite Scroll:**
- ⬜ Implement `useSWRInfinite` for launches (`hooks/use-launches-infinite.ts`)
- ⬜ Use SpaceX API `/query` endpoints with pagination
- ⬜ Add "Load More" button or auto-scroll

**Client-Side Filtering Hooks:**
- ⬜ Create reusable filtering hook (`hooks/use-filtered-data.ts`)
- ⬜ Implement for other resources

**Search Enhancements:**
- ⬜ Debounced search
- ⬜ Advanced filters (date ranges, multi-select)

### Phase 7: Polish & Optimization

**Performance:**
- ⬜ Implement loading states for all pages
- ⬜ Add error boundaries (`error.tsx` files)
- ⬜ Optimize images with Next.js Image component
- ⬜ Add metadata for SEO

**Design:**
- ⬜ Responsive design refinements
- ⬜ Dark mode polish
- ⬜ Animations and transitions
- ⬜ Empty states for no data

**Accessibility:**
- ⬜ ARIA labels
- ⬜ Keyboard navigation
- ⬜ Screen reader support
- ⬜ Color contrast verification

**Documentation:**
- ⬜ Update CLAUDE.md with new patterns
- ⬜ Add comments to complex functions
- ⬜ Create component documentation

---

## Architecture Highlights

### Data Fetching Strategy
- **SWR** for all client-side data fetching
- **Automatic revalidation** based on SpaceX API cache times:
  - Launches: 20 seconds
  - Starlink: 1 hour
  - Capsules/Cores/Crew/Pads/Ships/Payloads: 5 minutes
  - Dragons/Rockets/Company/Roadster: 24 hours
- **Runtime validation** with Zod schemas
- **TypeScript types** inferred from Zod schemas

### Component Architecture
- **Client Components** for data fetching (with 'use client')
- **Server Components** for layouts and static content
- **Reusable UI components** with consistent styling
- **Modular structure** - files kept under 450 lines

### Routing
- **Route groups** `(resources)` for shared layouts
- **Dynamic routes** `[id]` for detail pages
- **Grouped navigation** in navbar with dropdowns

### Styling
- **Tailwind CSS v4** with clean, minimal design
- **Dark mode** support throughout
- **Mobile-first** responsive design
- **Consistent color palette** with semantic variants

---

## Current Status
- ✅ Phase 1: Complete (100%)
- ✅ Phase 2: Complete (100%)
- 🚧 Phase 3: Not started (0%)
- ⬜ Phase 4: Not started (0%)
- ⬜ Phase 5: Not started (0%)
- ⬜ Phase 6: Not started (0%)
- ⬜ Phase 7: Not started (0%)

**Overall Progress: ~20%** (2/10 major phases complete)

---

## Next Immediate Steps

1. **Implement Starlink**
   - Create schema, hooks, components, pages

2. **Implement Payloads**
   - Create schema, hooks, components, pages

3. **Continue with remaining resources**
   - Follow the same pattern established with Launches

4. **Build Analytics page**
   - Once enough data sources are available

5. **Polish and optimize**
   - After all features are implemented

---

## Notes
- Pattern established with Launches can be replicated for other resources
- Each resource follows: Schema → Hooks → Components → Pages
- Keep files under 450 lines by breaking into smaller components
- Use consistent naming conventions across all resources
- Maintain type safety with Zod + TypeScript throughout
