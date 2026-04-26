# Unify Platform — Component Library

Libraria e komponentëve për platformën **Unify** (Next.js 14 + TypeScript + Tailwind CSS + Radix UI primitives).

Të gjithë komponentët janë ndërtuar mbi tokenat e dizajnit të marrë direkt nga Figma file-i *Unify Library*.

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS** — konfiguruar me tokenat e Figma-s
- **Radix UI** — për primitives me accessibility të plotë
- **ikonat e Unify** — set SVG in-house në `components/icons/`, pa varësi të jashtme
- **class-variance-authority** + **tailwind-merge** — për variant management

## Struktura

```
unify-platform/
├── app/                    # Next.js routes (App Router)
├── components/
│   ├── ui/                 # Primitives (Button, Input, Dialog, Select...)
│   ├── public/             # Komponente për faqet publike (CampaignCard, HeroSection...)
│   ├── dashboard/          # Komponente për dashboard-in e përdoruesit
│   ├── admin/              # Komponente për panelin admin
│   ├── auth/               # Forma auth + onboarding
│   ├── layout/             # Shell layouts (Navbar, Footer, DashboardLayout...)
│   └── index.ts            # Root barrel — exporton gjithçka
├── lib/
│   └── utils.ts            # cn() helper
├── styles/
│   └── globals.css         # Tailwind base + tokens CSS
└── tailwind.config.ts
```

## Usage

**Import nga barrel-i i folderit ose nga root-i:**

```tsx
import { Button, Card, Input } from "@/components/ui";
import { CampaignCard, DonationModal } from "@/components/public";
import { DashboardLayout } from "@/components/layout";

// ose nga root-i:
import { Button, CampaignCard, DashboardLayout } from "@/components";
```

## Design tokens

Tokenat (në `tailwind.config.ts` + `styles/globals.css`) janë marrë direkt nga Figma:

| Token | Vlera | Përdorimi |
|---|---|---|
| `unify-blue` | `#009eff` | CTA primary |
| `unify-brown` | `#3a1700` | Tekst kryesor, headers |
| `unify-cream` | `#f3f2e7` | Background sekondar |
| `unify-green` | `#059669` | Success states |
| `font-display` | `Rowdies` | Titujt (h1–h3) |
| `font-sans` | `Arimo` | Teksti i trupit |
| `rounded-[24px]` | `24px` | Kartat |
| `rounded-full` | — | Butonat (të gjithë rrumbullakë) |

## Komponentët (99 total)

### `ui/` — 35 primitives
Button · Input · Textarea · Label · Card · Badge · Select · Tabs · Table · Dialog · Sheet · AlertDialog · Accordion · Checkbox · Switch · Avatar · Tooltip · DropdownMenu · Pagination · Separator · Spinner · Skeleton · Progress · Toast · Popover · Command · **Breadcrumb** · **FileUpload** · **IconButton** · **ProgressBar** · **RadioGroup** · **SocialButton** · **Stepper** · **TagBadge** · **UserAvatarWithBadge**

### `public/` — 22 komponente
CampaignCard · VolunteerCard · BlogCard · HeroSection · SearchBar · FilterChips · DonationModal · BookmarkButton · ShareButtons · StatisticCard · CallToActionSection · ContactCard · NewsletterSignup · **CategoryCard** · **ValueCard** · **StatsBar** · **SuccessHero** · **BlogSidebar** · **DonorList** · **DonationAmountPicker** · **ContactInfoCard** · **FAQAccordion**

### `dashboard/` — 15 komponente
StatCard · CampaignGoalCard · CampaignTable · TransactionTable · ActivityLogItem · ProfileForm · OnboardingStepper · **CreatorCTA** · **ApplicationCard** · **MessageBubble** · **InboxSidebar** · **ChatWindow** · **StripeVerificationCard** · **ImageUploadZone** · **PublicProfileHero**

### `admin/` — 21 komponente
AdminSidebar · AdminHeader · AdminTable · AdminFilterBar · AdminStatusBadge · AdminActionMenu · **AdminChartCard** · **AdminPeriodFilter** · **AdminQuickStats** · **AdminSettingsCard** · **AdminStatCard** · **AdminToggleSwitch** · **AuditLogTable** · **BlogEditor** · **CampaignStatusCard** · **ModerationActions** · **ModerationDecisionCard** · **ReportDetailCard** · **ReportsTable** · **UserTable** · **ActionButtonGroup**

### `auth/` — 7 komponente
LoginForm · RegisterForm · OnboardingSteps · ForgotPasswordForm · **RoleSelectionCard** · **InterestPicker** · **ProfileSetupForm**

### `layout/` — 8 komponente
Navbar · Footer · PublicLayout · DashboardLayout · AdminLayout · AuthLayout · EmptyState · Breadcrumbs

> Me **bold** janë 54 komponentet e shtuar për mbulim 100% të 55 frame-ve të Figma-s.

## Konventat

- **Client components** — çdo komponent me `useState`/`useEffect`/handlers fillojnë me `"use client";`.
- **Forward refs** — të gjitha UI primitives përdorin `React.forwardRef` që të jenë kompatibile me Radix `asChild`.
- **Variants** — me `cva` për komponente me >1 mënyrë paraqitjeje (Button, Badge, Toast).
- **Accessibility** — Radix primitives sjellin focus management, ESC, ARIA falas.
- **i18n-ready** — të gjithë stringjet UI janë në shqip (dialog, format, placeholders).

## Që të shtosh një komponent të ri

1. Krijo `components/<group>/<Name>.tsx` me `"use client"` nëse ka state.
2. Përdor `cn()` nga `@/lib/utils` për klasat.
3. Shtoje në barrel-in `components/<group>/index.ts`.
4. Dokumento props-et me TypeScript (eksporto `<Name>Props`).

## Dev

```bash
pnpm install
pnpm dev
```

## Licenca

Proprietary — Unify.
