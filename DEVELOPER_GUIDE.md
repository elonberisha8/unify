# Unify Frontend — Udhëzues për Developerat

## 1. Setup (bëhet vetëm një herë)

```bash
# Klono repo-n
git clone https://github.com/elonberisha8/unify.git
cd unify

# Instalo dependencies
npm install

# Kalo te branchi YT (shiko tabelën poshtë)
git checkout feat/campaign-detail
```

## 2. Ku punon

Çdo developer ka **1 branch** dhe **disa faqe** të caktuara:

| Branch | Faqet (files) |
|--------|--------------|
| `feat/homepage` | `app/page.tsx` |
| `feat/static-pages` | `app/rreth-nesh/` · `app/kontakt/` · `app/blog/` · `app/kushtet/` · `app/privatesia/` |
| `feat/listings` | `app/shpalljet/` · `app/kampanjat/` |
| `feat/campaign-detail` | `app/kampanjat/[slug]/` · `app/sukses/donacion/` |
| `feat/volunteer-detail` | `app/vullnetare/[id]/` |
| `feat/auth` | `app/auth/` · `app/onboarding/` |
| `feat/dashboard-home` | `app/dashboard/page.tsx` · `app/dashboard/transaksionet/` · `app/dashboard/te-ruajtura/` |
| `feat/dashboard-campaigns` | `app/dashboard/kampanjat/` · `app/dashboard/krijo/` |
| `feat/dashboard-inbox` | `app/dashboard/inbox/` |
| `feat/dashboard-profile` | `app/dashboard/profili/` · `app/profili/[username]/` |
| `feat/admin-core` | `app/admin/page.tsx` · `app/admin/kampanjat/` · `app/admin/vullnetare/` |
| `feat/admin-moderation` | `app/admin/perdoruesit/` · `app/admin/raportimet/` · `app/admin/moderim/` · `app/admin/blog/` |

**Rregulli i vetëm:** Puno VETËM në faqet e tua. Mos prek branchet e të tjerëve.

## 3. Si duket çdo file

Kur hap faqen tënde, gjen:

```tsx
// BRANCH: feat/campaign-detail
// FIGMA:
//   • Kampanja — Detail → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/...?node-id=55-2
// ============================================================
// Make everything exactly as shown in the Figma design above.
// Use ONLY components from @/components/* — never create new ones.

// import { DonationModal, DonorList } from "@/components/public"
// import { ProgressBar, Card } from "@/components/ui"
// import { PublicLayout } from "@/components/layout"

export default function CampaignDetailPage() {
  return null
}
```

**Procesi:**
1. Kliko linkun Figma → shiko dizajnin
2. Zhkomento importet që të duhen
3. Shkruaj JSX sipas dizajnit
4. Testo në browser

## 4. Importet — rregulli absolut

```tsx
// SAKT
import { Button, Card, Input } from "@/components/ui"
import { CampaignCard, DonationModal } from "@/components/public"
import { StatCard, ChatWindow } from "@/components/dashboard"
import { PublicLayout, DashboardLayout } from "@/components/layout"

// GABIM — nuk kompilohet
import { Button } from "@/components/ui/Button"       // ← GABIM
import { Card } from "../../components/ui/Card"       // ← GABIM
```

ESLint tregon gabimin live me vijë të kuqe — nuk duhet t'i mësosh, e sheh vetë.

## 5. Testimi lokal

```bash
# Fillo dev server
npm run dev

# Hap browserin
http://localhost:3000/FAQJA_JOT

# Kontrollo gabime
npm run lint        # import errors
npm run typecheck   # typescript errors
npm run build       # build final
```

**Të tria duhet të kalojnë pa gabime para PR.**

## 6. Kur mbaron — dërgo PR

```bash
# Ruaj ndryshimet
git add app/kampanjat/[slug]/page.tsx
git commit -m "feat: implement campaign detail page"

# Ngarko te GitHub
git push

# Pastaj shko te github.com/elonberisha8/unify
# Kliko "Compare & pull request"
# Base: develop ← Compare: feat/branchi-yt
# Shkruaj përshkrim të shkurtër → Submit
```

## 7. Lista e kontrollit para PR

- [ ] Faqja duket si dizajni Figma
- [ ] Mobile responsive (testo me F12 → device toolbar)
- [ ] `npm run lint` → 0 gabime
- [ ] `npm run typecheck` → 0 gabime  
- [ ] `npm run build` → kalon

## 8. Kërko ndihmë

Nëse bllokohet:
- Shiko komponentin në `components/[folder]/[Komponenti].tsx` për props
- Pyete lead dev-in para se të bësh ndryshime jashtë faqeve tua
