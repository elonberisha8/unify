# Unify Platform — AI Assistant Guidelines

> This file is read automatically by Claude Code and other AI assistants.
> It provides full project context so you can give accurate, project-specific guidance.

---

## 🏗️ Project Overview

**Unify** is the first crowdfunding + volunteer help platform for Albanians and the diaspora (Kosovo, Albania, North Macedonia, Montenegro, global diaspora). Think GoFundMe + JustGiving, built for the Albanian community.

**Two types of listings:**
1. **Kampanja Donacionesh** — someone needs money, people donate
2. **Ndihmë Vullnetare** — someone has something to give (item, service, time), people apply

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS 3.4 · shadcn/ui base · Stripe · Clerk Auth · Cloudinary · Resend

---

## ⚠️ CRITICAL RULE — Imports (enforce strictly)

**ALWAYS import from the barrel index, NEVER from direct files:**

```typescript
// ✅ CORRECT
import { Button, Card, Badge, ProgressBar } from "@/components/ui"
import { CampaignCard, DonorList, ShareButtons } from "@/components/public"
import { DonationCheckout, IdentityVerification, ConnectOnboarding } from "@/components/stripe"
import { Navbar, Footer, DashboardLayout, PublicLayout } from "@/components/layout"

// ❌ WRONG — never do this
import { Button } from "@/components/ui/Button"
import { Navbar } from "@/components/layout/Navbar"
```

ESLint enforces this rule — direct imports will show a red error.

---

## 📁 Project Structure

```
unify-platform/
├── app/                        ← Next.js App Router pages
│   ├── page.tsx                ← Homepage (feat/homepage)
│   ├── layout.tsx              ← Root layout
│   ├── auth/                   ← Login, Register, Onboarding (feat/auth)
│   ├── dashboard/              ← User dashboard (feat/dashboard-*)
│   ├── admin/                  ← Admin panel (feat/admin-*)
│   ├── kampanjat/[slug]/       ← Campaign detail + donation (feat/campaign-detail)
│   ├── shpalljet/              ← Public listings feed (feat/listings)
│   ├── vullnetare/[id]/        ← Volunteer asset detail (feat/volunteer-detail)
│   └── ...                     ← Static pages (feat/static-pages)
│
├── components/
│   ├── ui/          ← Design system — base components (Button, Card, Badge...)
│   ├── public/      ← Unify-specific reusable components (CampaignCard, DonorList...)
│   ├── stripe/      ← Stripe payment components — DO NOT MODIFY
│   ├── layout/      ← Page layouts (Navbar, Footer, DashboardLayout...)
│   └── admin/       ← Admin-specific components
│
├── app/api/stripe/  ← Stripe API routes — DO NOT MODIFY
│   ├── webhook/     ← Processes payment_intent.succeeded, account.updated, etc.
│   ├── payment-intent/ ← Creates PaymentIntent for donations
│   ├── connect/     ← Creates Stripe Express account for creators
│   └── identity/    ← Creates Stripe Identity verification session
│
└── lib/
    ├── stripe/client.ts   ← getStripe() for client-side
    └── stripe/server.ts   ← stripe instance for server-side
```

---

## 🎨 Design System — UI Components

All components live in `@/components/ui`. Import from the barrel only.

### Available UI Components

| Component | Usage |
|-----------|-------|
| `Button` | variant: `primary\|secondary\|outline\|ghost\|danger`, size: `sm\|md\|lg` |
| `Input` | with label, error message, left/right icon |
| `Textarea` | with character counter |
| `Card` / `CardContent` | container |
| `Badge` | variant: `blue\|green\|red\|gray` |
| `Modal` / `Dialog` | popup with backdrop |
| `Avatar` / `AvatarImage` / `AvatarFallback` | profile photos |
| `ProgressBar` | with % label, color auto (red→orange→green) |
| `Skeleton` | shimmer loading state |
| `Toast` | success/error/info, 4s autoclose |
| `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` | tab navigation |
| `Switch` / `Toggle` | on/off toggle |
| `Select` | dropdown with search |
| `Spinner` | inline loading |
| `Checkbox` | with label |
| `SocialButton` | Google/Facebook login buttons |
| `Stepper` | wizard progress indicator |
| `ProgressBar` | donation progress |
| `FileUpload` | drag & drop file upload |
| `Pagination` | page navigation |
| `Table` | data table |
| `Separator` | divider |

### Available Public Components (Unify-specific)

| Component | Usage |
|-----------|-------|
| `CampaignCard` | Card shown in listing grids |
| `VolunteerCard` | Volunteer asset card |
| `DonorList` | Donor wall (last 10 / top 10) |
| `ShareButtons` | Facebook · WhatsApp · Copy · QR |
| `DonationAmountPicker` | €5/€10/€25/€50/Custom selector |
| `DonationModal` | Full modal with amount + checkout |
| `BookmarkButton` | ❤️ save/unsave button |
| `HeroSection` | Homepage hero |
| `StatsBar` | Live platform statistics |
| `StatisticCard` | Individual stat card |
| `SearchBar` | Search input with icon |
| `FilterChips` | Category/location filter pills |
| `FAQAccordion` | FAQ section |
| `CallToActionSection` | CTA banner |
| `BlogCard` | Blog post card |
| `SuccessHero` | /sukses/donacion hero with confetti |

### Available Layout Components

| Component | Usage |
|-----------|-------|
| `PublicLayout` | Wraps public pages (Navbar + Footer) |
| `DashboardLayout` | Dashboard with sidebar |
| `AdminLayout` | Admin panel layout |
| `AuthLayout` | Login/register centered layout |
| `Navbar` | Transparent → solid on scroll |
| `Footer` | Blue footer |
| `EmptyState` | Empty state with icon + CTA |
| `Breadcrumbs` | Navigation breadcrumbs |

---

## 🎨 Design Tokens

```typescript
// tailwind.config.ts — use these class names
colors: {
  'unify-blue':  '#009eff',   // Primary — buttons, links
  'unify-brown': '#3a1700',   // Text color
  'unify-cream': '#f3f2e7',   // Background
  success:       '#16a34a',
  warning:       '#d97706',
  error:         '#dc2626',
}

// Font
fontFamily: { display: ['Arimo', 'sans-serif'] }

// Usage examples:
// bg-unify-blue text-white       ← primary button
// text-unify-brown               ← body text
// bg-unify-cream                 ← page background
```

---

## 💳 Stripe Integration

### Donation Flow (frontend)

```typescript
import { DonationCheckout } from "@/components/stripe"
import { useState } from "react"

const [amount, setAmount] = useState(10)
const [tip, setTip] = useState(0)
const [anonymous, setAnonymous] = useState(false)
const [message, setMessage] = useState("")

<DonationCheckout
  campaignId={campaign.id}          // string — from API/URL
  campaignTitle={campaign.title}    // string — displayed in Stripe form
  amount={amount}                   // number — EUR (5, 10, 25, 50, custom)
  tip={tip}                         // number — EUR tip for Unify (0, 5%, 10%)
  anonymous={anonymous}             // boolean
  message={message}                 // string — optional message to creator
  onSuccess={(paymentIntentId) => {
    router.push(`/sukses/donacion?pi=${paymentIntentId}&cid=${campaign.id}`)
  }}
  onError={(msg) => toast.error(msg)}
/>
```

**After payment:** webhook automatically saves donation to DB, updates currentAmount, sends emails. Frontend only needs to redirect.

### Identity Verification (creator verification step 1)

```typescript
import { IdentityVerification } from "@/components/stripe"
import { useUser } from "@clerk/nextjs"

const { user } = useUser()

<IdentityVerification
  userId={user.id}              // from Clerk — REQUIRED
  onSuccess={() => refetchStatus()}
/>
```

### Connect Onboarding (creator bank account, step 2 — after identity)

```typescript
import { ConnectOnboarding } from "@/components/stripe"
import { useUser } from "@clerk/nextjs"

const { user } = useUser()

<ConnectOnboarding
  userId={user.id}                                          // from Clerk
  email={user.primaryEmailAddress?.emailAddress ?? ""}     // from Clerk
  onSuccess={(accountId) => toast.success("Lidhur!")}
/>
```

### Verification Page Logic (`/dashboard/verifikimi`)

```typescript
// status comes from backend API
// UNVERIFIED    → show IdentityVerification
// IDENTITY_DONE → show ConnectOnboarding
// FULLY_VERIFIED → show "✅ Je Verified Creator"

// URL params to handle:
// ?success=true      → Connect onboarding complete
// ?refresh=true      → Link expired → reopen onboarding
// ?identity=complete → Identity done → refetch status
```

---

## 🌿 Branch → File Ownership

Each developer owns only their files. **Never edit files from another branch.**

| Branch | Files | Notion |
|--------|-------|--------|
| `feat/homepage` | `app/page.tsx`, `app/layout.tsx`, `components/layout/Navbar.tsx`, `components/layout/Footer.tsx` | [Open](https://www.notion.so/34874891227e8103a6b4cf331028bb95) |
| `feat/listings` | `app/shpalljet/page.tsx`, `app/kampanjat/page.tsx` | [Open](https://www.notion.so/34874891227e81fd9a06df93436ce2d9) |
| `feat/campaign-detail` | `app/kampanjat/[slug]/page.tsx` | [Open](https://www.notion.so/34874891227e8164afc4f7f6568c7a81) |
| `feat/volunteer-detail` | `app/vullnetare/[id]/page.tsx` | [Open](https://www.notion.so/34874891227e81f29f6fe850f597bd61) |
| `feat/auth` | `app/auth/*/page.tsx`, `app/onboarding/page.tsx` | [Open](https://www.notion.so/34874891227e810bb074e9e50dab305f) |
| `feat/dashboard-home` | `app/dashboard/page.tsx`, `aktiviteti`, `transaksionet`, `te-ruajtura` | [Open](https://www.notion.so/34874891227e81f2a6e0ec234fd70570) |
| `feat/dashboard-profile` | `app/dashboard/profili`, `verifikimi`, `behu-krijues` | [Open](https://www.notion.so/34874891227e8188a4d5e1c80adc017a) |
| `feat/dashboard-campaigns` | `app/dashboard/kampanjat`, `shpalljet`, `aplikimet`, `krijo/*` | [Open](https://www.notion.so/34874891227e8166b6e1db98166ca406) |
| `feat/dashboard-inbox` | `app/dashboard/inbox/page.tsx` | [Open](https://www.notion.so/34874891227e8138a5abebbfd9a6d3ae) |
| `feat/admin-core` | `app/admin/page.tsx`, `kampanjat`, `vullnetare`, `cilesimet` | [Open](https://www.notion.so/34874891227e812cb190ea4b86cfa9bc) |
| `feat/admin-moderation` | `app/admin/perdoruesit`, `raportimet`, `moderim`, `blog`, `audit-log` | [Open](https://www.notion.so/34874891227e8145ac16f2b024b58fc0) |
| `feat/static-pages` | `app/blog/*`, `app/sukses/*`, `app/profili/*`, `kontakt`, `kushtet`, `not-found` | [Open](https://www.notion.so/34874891227e8130855afa1edb64a28b) |

---

## 🚫 What Developers Must NOT Do

```
❌ Import from direct file paths (use barrel index only)
❌ Create new components — use existing ones from @/components/*
❌ Modify Stripe files: app/api/stripe/*, components/stripe/*
❌ Modify config files: tailwind.config.ts, next.config.js, tsconfig.json
❌ Modify another developer's files (CODEOWNERS enforces this)
❌ Push directly to main or develop — PRs only
❌ Use inline styles — always use Tailwind classes
❌ Hardcode colors — use design token classes (bg-unify-blue, not bg-[#009eff])
❌ Use any state management library — useState/useReducer is sufficient for now
```

---

## ✅ Patterns to Follow

### Page structure
```typescript
"use client"

import { Button, Card } from "@/components/ui"
import { PublicLayout } from "@/components/layout"

export default function MyPage() {
  return (
    <PublicLayout>
      {/* content */}
    </PublicLayout>
  )
}
```

### Data fetching (client-side)
```typescript
// Simple fetch — no extra library needed yet
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch("/api/endpoint")
    .then(r => r.json())
    .then(setData)
    .finally(() => setLoading(false))
}, [])

if (loading) return <Skeleton />
```

### Loading states
```typescript
import { Skeleton } from "@/components/ui"

// Always show skeleton while loading, not a blank page
if (loading) return <Skeleton className="h-48 w-full rounded-xl" />
```

### Empty states
```typescript
import { EmptyState } from "@/components/layout"

if (!items.length) return (
  <EmptyState
    icon={<SomeIcon />}
    title="Nuk ka kampanja ende"
    action={<Button>Krijo Kampanjë</Button>}
  />
)
```

### Toast notifications
```typescript
// Use browser-native for now (toast component available but no provider needed)
import { Toast } from "@/components/ui"
// Or use window.alert for MVP — backend errors come as { error: "..." }
```

---

## 🔧 Local Development

```bash
# Requirements: Node.js v20 LTS (not v24 — incompatible with Next.js 14)
node --version  # must be v20.x.x

# Setup
git clone https://github.com/elonberisha8/unify.git
cd unify\unify-platform
npm install

# Create .env.local
type nul > .env.local   # Windows CMD
# OR: New-Item .env.local  # PowerShell
# Then paste:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51TONMQ2...
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# Checkout your branch
git fetch origin
git checkout feat/YOUR-BRANCH
git branch  # confirm: * feat/YOUR-BRANCH

# Start dev server
npm run dev
# → http://localhost:3000
```

### Test pages (Stripe)
- `/test-stripe` — Test donation payment form
- `/test-stripe/identity` — Test Stripe Identity flow
- `/test-stripe/connect` — Test Stripe Connect onboarding

### Test card numbers
- `4242 4242 4242 4242` — always succeeds
- `4000 0000 0000 9995` — always declines

---

## 🔄 Git Workflow

```bash
# Daily work
git pull origin feat/YOUR-BRANCH  # sync before starting
git add .
git commit -m "feat: add hero section to homepage"
git push origin feat/YOUR-BRANCH

# Commit message format
feat: add X            ← new feature
fix: correct Y         ← bug fix
style: adjust Z        ← visual-only changes

# When done → open PR: feat/YOUR-BRANCH → develop (NOT main)
```

---

## 🏛️ Architecture Notes

- **Next.js 14 App Router** — use `"use client"` only when needed (useState, useEffect, onClick)
- **No API calls from server components yet** — all pages are client-side for now
- **No ORM/DB on frontend** — frontend only calls `/api/` routes
- **Stripe is server-side** — never import `stripe` (server SDK) in client components
- **Images** — use `next/image` for all images. Cloudinary URLs are pre-configured in `next.config.js`
- **Routing** — all routes are file-based. No manual route configuration needed
- **i18n** — Albanian is default. English support planned later via `next-intl` (not implemented yet)

---

## 🌐 Figma Design

**File:** [Unify Platform Design](https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design)

Every file has a `// FIGMA: ...` comment at the top with direct links to the relevant screens. Implement pixel-perfect — match colors, spacing, typography exactly.

---

## 📞 Contact

Questions → ask Elon (project manager) before writing code you're unsure about.
Notion workspace: https://www.notion.so/34874891227e81f48429dc2a89caf854
