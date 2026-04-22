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

## 8. Gabime të zakonshme — lexo para se të fillosh

Gabime reale nga developerat tanë. Secila shkakton **fail** në CI dhe bllokon PR-in.

---

### ❌ Gabim 1 — Ngjyra hardcoded (HEX në Tailwind)

```tsx
// ❌ GABIM
<div className="bg-[#f4f0e6] text-[#3a1700] border-[#d8d0c2]">

// ✅ SAKTË — përdor tokenat e dizajnit
<div className="bg-unify-cream text-unify-brown border-border">
```

**Tokenat e vetme të lejuara:**

| Klasa | Ngjyra |
|-------|--------|
| `bg-unify-blue` / `text-unify-blue` | `#009eff` — butonat primary, linket |
| `bg-unify-brown` / `text-unify-brown` | `#3a1700` — teksti kryesor |
| `bg-unify-cream` | `#f3f2e7` — background sekondar |
| `bg-unify-green` / `text-unify-green` | `#059669` — sukses |
| `text-muted-foreground` | tekst dytësor (gri) |
| `border-border` | ndarësi standard |
| `bg-background` | background i bardhë/krem |

**Kurrë mos shkruaj `#` ose `[#...]` — nëse nuk gjen tokenin, pyet lead dev-in.**

---

### ❌ Gabim 2 — Auth hardcoded (isSignedIn = false)

```tsx
// ❌ GABIM — auth e falsifikuar
const isSignedIn = false  // "Fallback until ClerkProvider..."

// ✅ SAKTË — Clerk është instaluar, përdore
import { useUser } from "@clerk/nextjs"

export default function MyPage() {
  const { isSignedIn, user } = useUser()
  // ...
}
```

`@clerk/nextjs` është instaluar dhe funksionon. `useUser()` kthen `isSignedIn`, `user`, dhe `isLoaded`. Kurrë mos hardkodo state-in e auth-it.

---

### ❌ Gabim 3 — `<img>` direkt (jo `next/image`)

```tsx
// ❌ GABIM
<img src={post.imageUrl} alt="foto" className="w-full h-full object-cover" />

// ✅ SAKTË
import Image from "next/image"

<Image src={post.imageUrl} alt="foto" fill className="object-cover" />
// ose me dimensione fikse:
<Image src={post.imageUrl} alt="foto" width={800} height={450} />
```

`next/image` optimizon imazhet automatikisht (lazy load, WebP, CDN). Cloudinary URLs janë të konfiguruara në `next.config.js`.

---

### ❌ Gabim 4 — QR Code nga API e jashtme

```tsx
// ❌ GABIM — kurrë mos thirr API të jashtme nga frontend
<img src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${url}`} />

// ✅ SAKTË — backend gjeneron QR (me logon e Unify), frontend shfaq vetëm URL-në
const [qrUrl, setQrUrl] = useState("")
useEffect(() => {
  fetch(`/api/qr?url=${encodeURIComponent(currentUrl)}`)
    .then(r => r.json())
    .then(d => setQrUrl(d.qrUrl))  // kthen URL Cloudinary
}, [currentUrl])

<Image src={qrUrl} alt="QR Code" width={260} height={260} />
```

Shënim: `/api/qr` nuk ekziston ende — backend e ndërton. Deri atëherë, lër QR modalin pa imazh.

---

### ❌ Gabim 5 — Komponent BookmarkButton i harruar

Secili post (kampanjë ose aset vullnetar) duhet të ketë butonin ❤️ save/unsave:

```tsx
import { BookmarkButton } from "@/components/public"

// Vendos pranë titullit ose në kartë
<BookmarkButton postId={post.id} />
```

---

### ❌ Gabim 6 — Props manuale tek PublicLayout (navLinks, footerSections)

```tsx
// ❌ GABIM — PublicLayout i menaxhon vetë
<PublicLayout
  navbar={{ links: navLinks, onLogin: ..., onRegister: ... }}
  footer={{ sections: footerSections, socials: [...] }}
>

// ✅ SAKTË — PublicLayout e merr gjithçka vetë
<PublicLayout>
  {/* content here */}
</PublicLayout>
```

`PublicLayout` → `Navbar` dhe `Footer` kanë listat e linkave dhe socials të hardkoduara brenda tyre. Nuk duhet t'i jepësh ti.

---

### ❌ Gabim 7 — Import direkt (rikujtues)

```tsx
// ❌ GABIM
import { Button } from "@/components/ui/Button"
import { Navbar } from "@/components/layout/Navbar"

// ✅ SAKTË
import { Button } from "@/components/ui"
import { Navbar } from "@/components/layout"
```

ESLint tregon gabimin menjëherë me vijë të kuqe. Nëse CI fail-on me `import error` → ky është problemi.

---

## 9. Kërko ndihmë

Nëse bllokohet:
- Shiko komponentin në `components/[folder]/[Komponenti].tsx` për props
- Pyete lead dev-in para se të bësh ndryshime jashtë faqeve tua
