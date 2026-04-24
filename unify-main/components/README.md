# Unify — Component Library

An **internal, self-contained React + TypeScript component library** for the Unify platform. All UI primitives, layouts, tokens, icons, and domain components live inside this folder. Frontend developers compose pages from these components and **never reach outside this folder** for UI concerns.

---

## Rules

1. **Single source of truth** — every component, token, icon and style lives under `components/` or `styles/`. Do **not** install or import a competing UI/icon library at page level.
2. **Import only from barrels** — always `import { Button } from "@/components"` (or `@/components/ui`). Never deep-import a file.
3. **Pages are composition only** — page files under `app/` should render library components, pass props, and contain zero styling beyond the layout Tailwind already provides via library components.
4. **New visuals → new library component** — if a page needs something the library doesn't have, add it to the library first, then consume it.

---

## What's inside

```
components/
├── index.ts                 # root barrel — re-exports everything
├── tokens.ts                # design tokens in TS (colors, type, radii, spacing, shadows)
├── icons/                   # in-library icon set (stroke-based, 24×24, currentColor)
├── ui/                      # 33 primitives (Button, Input, Dialog, Table, …)
├── layout/                  # Navbar, Footer, PublicLayout, DashboardLayout, AdminLayout, AuthLayout, Breadcrumbs, EmptyState
├── public/                  # 22 marketing/campaign components (CampaignCard, HeroSection, DonationModal, …)
├── dashboard/               # 15 authed-user components (StatCard, CampaignTable, Inbox, …)
├── auth/                    # 7 auth/onboarding components (LoginForm, RegisterForm, RoleSelectionCard, …)
└── admin/                   # 21 admin-panel components (AdminTable, ModerationActions, AuditLogTable, …)

styles/
├── globals.css              # CSS vars (HSL tokens) + Tailwind layers — IMPORT ONCE in app/layout.tsx
└── fonts.css                # @font-face rules (self-hosted — see public/fonts/README.md)

public/fonts/                # drop Rowdies + Arimo .woff2 files here
lib/utils.ts                 # `cn()` helper
tailwind.config.ts           # brand colors, fonts, radii, animations
```

---

## Usage

```tsx
import {
  Button,
  Card, CardHeader, CardTitle, CardContent,
  CampaignCard,
  DashboardLayout,
  HeartIcon,
  tokens,
} from "@/components";

export default function Page() {
  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Mbështete kauzën</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>
            <HeartIcon size={16} />
            Dhuro tani
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
```

### Design tokens in TS
```tsx
import { colors, radii, shadows } from "@/components";
// or: import { tokens } from "@/components";
```

### Icons
All icons are SVG React components authored inside `components/icons/`. They accept `size`, `strokeWidth`, `className`, and any SVG attribute. Color follows `currentColor` — control via Tailwind text color.

```tsx
<SearchIcon size={20} className="text-unify-blue" />
```

To add a new icon: edit `components/icons/icons.tsx` and append with the `make()` helper. Keep the 24×24 viewBox and stroke-based style.

---

## Figma coverage

All 55 Figma frames (17 Publike + 19 Dashboard + 9 Auth-Onboarding + 12 Admin-Panel − components page shared) are composable from the current library. See `components/admin/`, `components/public/`, etc. for the full set.

---

## Theming

Tokens live in two synchronized places:
- **CSS variables** in `styles/globals.css` — consumed by Tailwind via `tailwind.config.ts`
- **TS export** in `components/tokens.ts` — consumed by component logic

When editing a token, update **both** to keep them in sync.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| `import { Button } from "@/components"` | `import { Button } from "@/components/ui/Button"` |
| Add missing visuals as new library components | Build one-off UI inside `app/` pages |
| Use library icons from `components/icons` | Install `lucide-react`, `react-icons`, etc. at page level |
| Use `cn()` from `@/lib/utils` | Install alternative className utilities |
| Extend `tokens.ts` + `globals.css` in sync | Hardcode hex values in components |
