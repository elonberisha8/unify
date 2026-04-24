"use client"

// ============================================================
// BRANCH: feat/homepage
// FIGMA: node-id=88-1175
// NOTION: https://www.notion.so/34874891227e8103a6b4cf331028bb95
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { CampaignCard } from "@/components/public"
import { PublicLayout } from "@/components/layout"
import { Button } from "@/components/ui"
import { MessageCircleIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "@/components/icons"

// ─── Mock data ─────────────────────────────────────────────────────────────────
const CAMPAIGNS = [
  {
    id: "1",
    title: '"Siguro ujë të pastër për familjet në nevojë."',
    description: "Ndihmë familjeve të kenë qasje në ujë të pastër çdo ditë.",
    category: "Ushqim",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    raised: 4373, goal: 10000, daysLeft: 18, donorCount: 124,
    creatorName: "Fondacioni Kosovës", verified: true,
  },
  {
    id: "2",
    title: '"Ndihmo me vakte ushqyese sot."',
    description: "Sigurimi i ushqimit ditor për fëmijët dhe familjet në nevojë.",
    category: "Edukimi",
    imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=400&fit=crop",
    raised: 5200, goal: 7000, daysLeft: 12, donorCount: 67,
    creatorName: "Shoqata Edukimit", verified: true,
  },
  {
    id: "3",
    title: '"Fuqizo jetët nëpërmjet bujarisë suaj."',
    description: "Bashkohuni me ne dhe ndihmo jetët e njerëzve që kanë nevojë.",
    category: "Bamirësi",
    imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop",
    raised: 27890, goal: 50000, daysLeft: 30, donorCount: 203,
    creatorName: "Organizata Bamirëse", verified: false,
  },
]

const SERVICES = [
  {
    title: "Bamirësi",
    desc: '"E dedikuar për t\'u shërbyer të cenuarve. Na bashkohuni në krijimin e një bote më të sigurt nëpërmjet veprimit kolektiv."',
  },
  {
    title: "Ushqim",
    desc: '"Ushqyerja e potencialit nëpërmjet ushqimit. Punojmë që çdo fëmijë dhe familje të ketë qasje në ushqim të shëndetshëm."',
  },
  {
    title: "Ujë",
    desc: '"Transformimi i jetëve me çdo pikë. Na ndihmoni të sjellim zgjidhje të qëndrueshme të ujit të pastër në zonat e largëta."',
  },
]

const VOLUNTEERS = [
  { name: "Albert Aliu",     role: "Vullnetar", img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face" },
  { name: "Rilind Krasniqi", role: "Vullnetar", img: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=400&fit=crop&crop=face" },
  { name: "Dea Krasniqi",    role: "Vullnetar", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face" },
  { name: "Besa Ajeti",      role: "Vullnetar", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face" },
]

const TESTIMONIAL_AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
]

const FAQ_ITEMS = [
  { question: "Si mund të bëhem pjesë e vullnetarëve?",  answer: "Klikoni 'Bëhu Vullnetar' dhe ndiqni hapat e regjistrimit. Pasi të regjistroheni, mund të shikoni shpalljet aktive dhe të aplikoni direkt." },
  { question: "Ku shkojnë paratë e donacioneve të mia?", answer: "100% e donacioneve shkojnë direkt te krijuesi i kampanjës nëpërmjet Stripe. Unify nuk mban komisione — vetëm tip vullnetar nga donatori." },
  { question: "A mund të krijoj unë një kampanjë të re?",  answer: "Po — duhet të verifikoheni si Krijues nëpërmjet Stripe Identity (selfie + dokument ID). Procesi zgjat 2–3 minuta dhe pastaj mund të publikoni." },
  { question: "Si vlerësohet siguria e pagesave?",         answer: "Të gjitha pagesat processohen nëpërmjet Stripe, platformës lider botëror në pagesa të sigurta. Të dhënat tuaja bankare nuk i shohim kurrë." },
]

const NAV_LINKS = [
  { label: "Kryefaqja",         href: "/" },
  { label: "Kampanjat",         href: "/kampanjat" },
  { label: "Ndihmë Vullnetare", href: "/vullnetare" },
  { label: "Si Funksionon",     href: "/si-funksionon" },
  { label: "Blog",              href: "/blog" },
  { label: "Kontakt",           href: "/kontakt" },
]

// ─── Faqja ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const [faqOpen, setFaqOpen] = React.useState<number>(0)

  return (
    <PublicLayout
      navbar={{
        links: NAV_LINKS,
        onLogin:    () => router.push("/auth/login"),
        onRegister: () => router.push("/auth/register"),
      }}
      footer={{
        tagline: "Platforma e parë crowdfunding dhe ndihmë vullnetare për të gjithë shqiptarët.",
        sections: [
          {
            title: "Platforma",
            links: [
              { label: "Si Funksionon", href: "/si-funksionon" },
              { label: "Rreth Nesh",    href: "/rreth-nesh"    },
              { label: "Blog",          href: "/blog"          },
              { label: "Shërbimet",    href: "/sherbimet"     },
            ],
          },
          {
            title: "Ligjore",
            links: [
              { label: "Kushtet e Përdorimit",   href: "/kushtet"    },
              { label: "Politika e Privatësisë", href: "/privatesia" },
            ],
          },
          {
            title: "Kontakt",
            links: [
              { label: "info@unify.ks", href: "mailto:info@unify.ks" },
              { label: "Instagram",     href: "#"                     },
              { label: "Facebook",      href: "#"                     },
            ],
          },
        ],
        socials: [
          { platform: "facebook",  href: "#" },
          { platform: "instagram", href: "#" },
          { platform: "twitter",   href: "#" },
        ],
      }}
    >

      {/* ══════════════════════════════════════════════════════════
          1. HERO  — Unite, Ignite, Make it Right
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-unify-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left: title + description + CTA */}
            <div>
              <h1 className="font-display text-6xl md:text-7xl text-unify-brown leading-[1.05]">
                Unite,<br />Ignite,<br />Make it Right
              </h1>
              <p className="mt-6 text-sm text-muted-foreground max-w-sm leading-relaxed">
                Platforma e parë shqiptare e crowdfunding dhe ndihmës vullnetare.
                Bashkojmë njerëzit që duan të bëjnë ndryshim.
              </p>
              <Button
                size="lg"
                className="mt-8 uppercase tracking-widest"
                onClick={() => router.push("/kampanjat")}
              >
                Dhuro Tani
              </Button>
            </div>

            {/* Right: circular photo + blue circle decoration */}
            <div className="relative flex justify-center md:justify-end">
              {/* Cream oval — top-left of image area */}
              <div className="absolute top-2 left-6 w-20 h-28 rounded-full bg-stone-300/50 z-0" />
              {/* Main circular photo */}
              <div className="relative w-72 h-72 md:w-[380px] md:h-[380px] rounded-full overflow-hidden z-10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&h=700&fit=crop"
                  alt="Bashkohuni me ne"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Blue circle — bottom-right decoration */}
              <div className="absolute bottom-0 right-2 w-36 h-36 rounded-full bg-unify-blue z-0" />
              {/* Thin curved lines */}
              <svg
                className="absolute bottom-10 right-32 w-12 h-20 z-20 opacity-25"
                fill="none" stroke="#3a1700" strokeWidth="2.5" viewBox="0 0 40 80"
              >
                <path d="M6 4 Q 16 40 6 76" />
                <path d="M18 4 Q 28 40 18 76" />
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. STATS BAR  — 150K+  /  15K+  /  68K+
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { value: "150K+", label: "Numri i Mbështetësve" },
              { value: "15K+",  label: "Vullnetarë Botërorë"  },
              { value: "68K+",  label: "Kemi Mbledhur"         },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center text-center p-8 rounded-2xl border border-border"
              >
                <span className="font-display text-5xl text-unify-brown">{s.value}</span>
                <span className="mt-2 text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. SHKAQET TONA TË FUNDIT — Campaigns
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-unify-blue text-center mb-3">
            Rastet Tona
          </p>
          <h2 className="font-display text-4xl text-unify-brown text-center mb-12">
            Shkaqet Tona të Fundit
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {CAMPAIGNS.map((c) => (
              <CampaignCard
                key={c.id}
                {...c}
                onDonate={() => router.push(`/kampanjat/${c.id}`)}
                onClick={() => router.push(`/kampanjat/${c.id}`)}
              />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button variant="outline" size="lg" className="uppercase tracking-widest"
              onClick={() => router.push("/kampanjat")}>
              Shiko të gjitha
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. RRETH NESH — Forma më e lartë e dashurisë
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-unify-cream py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left: image with blue decorations */}
            <div className="relative">
              {/* Small blue square/rect decoration — top-left */}
              <div className="absolute -top-4 -left-4 w-16 h-20 rounded-lg bg-unify-blue z-[1]" />
              {/* Main image */}
              <div className="relative z-[2] rounded-[24px] overflow-hidden shadow-lg aspect-square max-w-sm mx-auto md:mx-0">
                <img
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=600&fit=crop"
                  alt="Forma më e lartë e dashurisë"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Blue circle — bottom-left */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-unify-blue z-[1]" />
            </div>

            {/* Right: text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-unify-blue mb-3">
                Rreth Nesh
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-unify-brown leading-tight mb-5">
                Forma më e lartë<br />e dashurisë
              </h2>
              <p className="text-sm text-muted-foreground italic leading-relaxed mb-7">
                "Kuptimi i jetës është të gjesh dhuratën tënde.<br />
                Qëllimi i jetës është ta japësh atë." — Pablo Picasso
              </p>
              <Button variant="outline" onClick={() => router.push("/rreth-nesh")}
                className="uppercase tracking-widest">
                Rreth Nesh
              </Button>
            </div>

          </div>

          {/* ─ Stat counters: 42 / 73 / 09 ─ */}
          <div className="mt-20">
            <p className="font-display text-base text-unify-brown text-center mb-8 max-w-lg mx-auto">
              Çfarëdo që ju intereson, do të ketë një organizatë që punon për të.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { num: "42", title: "Njerëz",  sub: "Parandalimi i Dhunës" },
                { num: "73", title: "Shoqëri", sub: "Kushtet e Përdorimit" },
                { num: "09", title: "Projekt", sub: "Spital Hulumtues"      },
              ].map((s) => (
                <div key={s.num} className="bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm">
                  <span className="font-display text-5xl text-unify-brown leading-none">{s.num}</span>
                  <div>
                    <div className="font-bold text-unify-brown text-sm">{s.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─ Volunteer CTA ─ */}
          <div className="mt-20 grid md:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-unify-blue mb-3">
                Vullnetarë
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-unify-brown leading-tight mb-5">
                Dashurinë e pashprehur ndaj njerëzve
              </h2>
              <p className="text-sm text-muted-foreground italic leading-relaxed mb-8">
                "Nëse doni të ngritni veten, ngritni dikë tjetër." — Booker T. Washington
              </p>
              <Button variant="outline" onClick={() => router.push("/vullnetare")}
                className="uppercase tracking-widest">
                Bëhu Vullnetar
              </Button>
            </div>

            {/* Right: circular image + 2 blue circles */}
            <div className="relative flex justify-center">
              {/* Blue circle — top-left */}
              <div className="absolute top-0 left-8 w-20 h-20 rounded-full bg-unify-blue z-[1]" />
              {/* Circular image */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden z-[2] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=600&fit=crop"
                  alt="Vullnetarë"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Blue circle — bottom-right */}
              <div className="absolute bottom-0 right-4 w-24 h-24 rounded-full bg-unify-blue z-[1]" />
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. SHËRBIMET QË OFROJMË
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-unify-blue mb-2">
            Shërbimet Tona
          </p>
          <h2 className="font-display text-4xl text-unify-brown mb-12">
            Shërbimet që Ofrojmë
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-unify-cream rounded-[24px] p-8 flex flex-col gap-4">
                {/* Blue speech-bubble icon */}
                <div className="w-11 h-11 rounded-full rounded-bl-none bg-unify-blue flex items-center justify-center">
                  <MessageCircleIcon className="w-5 h-5 text-white" />
                </div>
                <div className="w-8 h-0.5 bg-unify-brown/20 rounded-full" />
                <h3 className="font-display text-xl text-unify-brown">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
                <button
                  onClick={() => router.push("/sherbimet")}
                  className="self-start mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#7a93c0] text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  Mëso Më Shumë
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button variant="outline" size="lg" className="uppercase tracking-widest"
              onClick={() => router.push("/sherbimet")}>
              Shiko të gjitha
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. GALERIA — Shikoni Galerinë Tonë
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-unify-cream py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-unify-blue text-center mb-10">
            Shikoni Galerinë Tonë
          </p>
          {/* Mosaic: left(2) + center tall(1) + right(2) */}
          <div className="hidden md:grid grid-cols-4 gap-4" style={{ gridTemplateRows: "260px 260px" }}>
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=260&fit=crop"
                alt="Gallery 1" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=700&h=560&fit=crop"
                alt="Gallery kryesore" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button aria-label="Video" className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                  <svg className="w-7 h-7 text-unify-blue ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=260&fit=crop"
                alt="Gallery 3" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=260&fit=crop"
                alt="Gallery 2" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=260&fit=crop"
                alt="Gallery 4" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Mobile: simple grid */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {[
              "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=260&fit=crop",
              "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=260&fit=crop",
              "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=260&fit=crop",
              "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=260&fit=crop",
            ].map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-video">
                <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="lg" className="uppercase tracking-widest" onClick={() => {}}>
              Shiko të gjitha
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. BLUE BANNER CTA — Bashkohu me misionin tonë!
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-unify-blue py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="font-display text-3xl md:text-4xl text-white text-center md:text-left">
              Bashkohu me misionin tonë!
            </h2>
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => router.push("/kampanjat")}
                className="flex items-center gap-3 bg-white text-unify-brown font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Dhuro Tani
                <span className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => router.push("/vullnetare")}
                className="flex items-center gap-3 bg-white text-unify-brown font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Hapi 02
                <span className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. VULLNETARËT TANË — 4 karta
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-unify-cream py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-unify-blue mb-2">
            Vullnetarët
          </p>
          <h2 className="font-display text-4xl text-unify-brown mb-10">
            Vullnetarët Tanë
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {VOLUNTEERS.map((v) => (
              <div key={v.name} className="bg-white rounded-[20px] overflow-hidden shadow-sm">
                <div className="aspect-square overflow-hidden">
                  <img src={v.img} alt={v.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 text-center">
                  <p className="font-display text-base text-unify-brown">{v.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{v.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button variant="outline" size="lg" className="uppercase tracking-widest"
              onClick={() => router.push("/vullnetare")}>
              Të gjithë ekipit
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          9. TESTIMONIAL — Lexo Historinë
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-unify-cream py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-unify-blue text-center mb-2">
            Histori Fëmijësh
          </p>
          <h2 className="font-display text-4xl text-unify-brown text-center mb-10">
            Lexo Historinë
          </h2>
          <div className="max-w-2xl mx-auto bg-white rounded-[28px] p-10 shadow-sm">
            {/* Quote icon */}
            <div className="flex justify-center mb-7">
              <div className="w-12 h-12 rounded-full bg-unify-blue/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-unify-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>
            <p className="text-center text-muted-foreground leading-relaxed text-sm mb-8">
              "Për shkak të mbështetjes suaj të vazhdueshme, fëmijët tanë tashmë kanë akses
              në edukim të mirëfilltë dhe shërbime shëndetësore. Ju jeni arsyeja pse ata
              buzëqeshin sot!"
            </p>
            {/* Avatars */}
            <div className="flex flex-col items-center gap-3 mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Prind</p>
              <div className="flex -space-x-2">
                {TESTIMONIAL_AVATARS.map((url, i) => (
                  <div key={i}
                    className={`rounded-full overflow-hidden border-2 border-white ${i === 2 ? "w-12 h-12 z-10" : "w-9 h-9"}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center font-bold text-unify-brown">Linda Berisha</p>
            {/* Arrows */}
            <div className="flex justify-center gap-3 mt-6">
              <button aria-label="Më parë"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-unify-cream transition-colors">
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button aria-label="Tjetër"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-unify-cream transition-colors">
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          10. FAQ — Përgjigjet e të Gjitha Pyetjeve Tuaja
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 relative overflow-hidden">
        {/* Blue half-circle — right edge decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-72 rounded-l-full bg-unify-blue" />
        <div className="max-w-2xl mx-auto px-4 md:px-6 relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-unify-blue text-center mb-3">FAQ</p>
          <h2 className="font-display text-4xl text-unify-brown text-center mb-2 leading-tight">
            Përgjigjet e të Gjitha<br />Pyetjeve Tuaja
          </h2>
          <div className="w-8 h-1 bg-unify-blue mx-auto mt-3 mb-3 rounded-full" />
          <p className="text-center text-sm text-muted-foreground mb-10">Pyetjet më të shpeshta?</p>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = faqOpen === i
              return (
                <div
                  key={i}
                  className={`rounded-xl overflow-hidden border transition-colors ${
                    isOpen ? "bg-unify-blue border-unify-blue" : "bg-white border-unify-blue"
                  }`}
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between px-6 py-4"
                  >
                    <span className={`font-bold text-sm text-left pr-4 ${isOpen ? "text-white" : "text-unify-blue"}`}>
                      {item.question}
                    </span>
                    <span className={`text-2xl leading-none flex-shrink-0 font-light ${isOpen ? "text-white" : "text-unify-blue"}`}>
                      {isOpen ? "×" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-white/90 text-sm leading-relaxed">{item.answer}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          11. CTA BAMIRËSI — Dhënie ndihmë
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-unify-cream py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-unify-blue mb-3">Bamirësi</p>
              <h2 className="font-display text-4xl md:text-5xl text-unify-brown leading-tight mb-6">
                Dhënie ndihmë ndaj atyre që kanë nevojë
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm">
                Bamirësia është akti i dhënies ndihmës ndaj atyre që kanë nevojë.
                Është një akt humanitar.
              </p>
              <Button variant="outline" size="lg" onClick={() => router.push("/kampanjat")}
                className="uppercase tracking-widest">
                Dhuro Tani
              </Button>
            </div>
            <div className="rounded-[24px] overflow-hidden shadow-lg aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&h=530&fit=crop"
                alt="Bamirësi"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  )
}
