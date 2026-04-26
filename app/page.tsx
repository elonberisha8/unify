"use client"

// ============================================================
// BRANCH: feat/homepage
// FIGMA:
//   • Landing Page → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=88-1175
// NOTION: https://www.notion.so/34874891227e8103a6b4cf331028bb95
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { CampaignCard } from "@/components/public"
import { PublicLayout } from "@/components/layout"
import { Button, Skeleton } from "@/components/ui"
import { MessageCircleIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "./_lib/public-layout-config"
import { apiFetch, type Campaign } from "./_lib/api"

type HomeCampaign = {
  id: string
  slug: string
  title: string
  description: string
  category: string
  imageUrl: string
  raised: number
  goal: number
  daysLeft: number
  donorCount: number
  creatorName: string
  verified: boolean
}

function calcDaysLeft(endsAt: string | null): number {
  if (!endsAt) return 999
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function mapCampaign(c: Campaign): HomeCampaign {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.shortDescription ?? c.description.slice(0, 120),
    category: c.isUrgent ? "URGJENTE" : c.category,
    imageUrl: c.images[0] ?? "",
    raised: c.currentAmount,
    goal: c.targetAmount,
    daysLeft: calcDaysLeft(c.endsAt),
    donorCount: c._count.donations,
    creatorName: c.isAnonymous ? "Anonim" : c.creator.name,
    verified: c.creator.isVerified,
  }
}

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

const TEAM = [
  {
    name: "Elon Berisha",
    role: "Frontend & Backend",
    initials: "EB",
    avatarClass: "from-unify-blue to-blue-800",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Elon-Unify-Lead",
  },
  {
    name: "Bleon Bajraktari",
    role: "Frontend & Backend",
    initials: "BB",
    avatarClass: "from-amber-400 to-orange-700",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Bleon-API-Wizard",
  },
  {
    name: "Resul Sopa",
    role: "Design & Frontend Management",
    initials: "RS",
    avatarClass: "from-emerald-400 to-teal-700",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Resul-Design-Pro",
  },
  {
    name: "Albert Aliu",
    role: "Frontend",
    initials: "AA",
    avatarClass: "from-fuchsia-400 to-rose-700",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Albert-CSS-Dragon",
  },
  {
    name: "Alketa Citaku",
    role: "Frontend",
    initials: "AC",
    avatarClass: "from-pink-400 to-purple-700",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Alketa-Frontend-Star",
  },
]

const TESTIMONIAL_AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
]

const TESTIMONIALS = [
  {
    label: "Prind",
    name: "Linda Berisha",
    quote:
      "Per shkak te mbeshtetjes suaj te vazhdueshme, femijet tane tashme kane akses ne edukim te mirefillte dhe sherbime shendetesore. Ju jeni arsyeja pse ata buzeqeshin sot!",
  },
  {
    label: "Donator",
    name: "Arben Krasniqi",
    quote:
      "Me ne fund kemi nje vend ku mund te shohim qarte ku shkon ndihma. Kjo e ben shume me te lehte te dhurosh me zemer dhe me besim.",
  },
  {
    label: "Vullnetare",
    name: "Dea Krasniqi",
    quote:
      "Permes Unify gjeta nje menyre konkrete per te ndihmuar. Jo vetem para, por kohe, aftesi dhe pranine time aty ku dikush kishte nevoje.",
  },
]

const FAQ_ITEMS = [
  {
    question: "Si mund të bëhem pjesë e vullnetarëve?",
    answer:
      "Procesi është i thjeshtë. Mjafton të regjistroheni në platformë dhe të plotësoni profilin tuaj. Pastaj mund të aplikoni për çdo shpallje që ju intereson.",
  },
  {
    question: "Ku shkojnë paratë e donacioneve të mia?",
    answer:
      "100% e donacioneve tuaja shkojnë direkt tek rastet e verifikuara. Platforma jonë nuk mban asnjë komision nga ndihmat e dedikuara për nevojtarët.",
  },
  {
    question: "A mund të krijoj unë një kampanjë të re?",
    answer:
      "Po, çdo përdorues i regjistruar mund të propozojë një kampanjë. Ajo do të kalojë në një proces të shkurtër verifikimi nga ekipi ynë para se të publikohet.",
  },
  {
    question: "Si vlerësohet siguria e pagesave?",
    answer:
      "Përdorim sistemet më të avancuara të enkriptimit për çdo transaksion bankar. Të dhënat tuaja nuk ruhen asnjëherë në serverat tanë.",
  },
]

type PlatformStats = {
  totalDonated: number
  volunteerCount: number
  campaignCount: number
}

export default function HomePage() {
  const router = useRouter()
  const [faqOpen, setFaqOpen] = React.useState<number>(0)
  const [storyIndex, setStoryIndex] = React.useState(0)
  const [homeCampaigns, setHomeCampaigns] = React.useState<HomeCampaign[]>([])
  const [campaignsLoading, setCampaignsLoading] = React.useState(true)
  const [platformStats, setPlatformStats] = React.useState<PlatformStats>({
    totalDonated: 68000,
    volunteerCount: 15000,
    campaignCount: 150000,
  })

  React.useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await apiFetch<{ campaigns: Campaign[] } | Campaign[]>("/campaigns?featured=true&limit=3")
        const data = Array.isArray(res)
          ? res
          : ((res as { campaigns?: Campaign[] }).campaigns ?? [])
        setHomeCampaigns(data.slice(0, 3).map(mapCampaign))
      } catch {
        setHomeCampaigns([])
      } finally {
        setCampaignsLoading(false)
      }
    }

    async function loadStats() {
      try {
        const res = await apiFetch<PlatformStats>("/stats")
        if (res && typeof res === "object" && "totalDonated" in res) {
          setPlatformStats(res)
        }
      } catch {
        // keep default fallback values
      }
    }

    loadFeatured()
    loadStats()
  }, [])
  const story = TESTIMONIALS[storyIndex]
  const showPreviousStory = () => {
    setStoryIndex((current) => (current === 0 ? TESTIMONIALS.length - 1 : current - 1))
  }
  const showNextStory = () => {
    setStoryIndex((current) => (current + 1) % TESTIMONIALS.length)
  }

  return (
    <PublicLayout
      navbar={PUBLIC_NAVBAR}
      footer={PUBLIC_FOOTER}
    >
      <section className="bg-unify-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="font-display text-6xl leading-[1.05] text-unify-brown md:text-7xl">
                Unite,
                <br />
                Ignite,
                <br />
                Make it Right
              </h1>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Platforma e parë shqiptare e crowdfunding dhe ndihmës vullnetare. Bashkojmë njerëzit
                që duan të bëjnë ndryshim.
              </p>
              <Button
                size="lg"
                className="mt-8 uppercase tracking-widest"
                onClick={() => router.push("/kampanjat")}
              >
                Dhuro
              </Button>
            </div>

            <div className="relative flex justify-center md:justify-end">
              <div className="absolute left-6 top-2 z-0 h-28 w-20 rounded-full bg-stone-300/50" />
              <div className="relative z-10 h-72 w-72 overflow-hidden rounded-full shadow-2xl md:h-[380px] md:w-[380px]">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&h=700&fit=crop"
                  alt="Bashkohuni me ne"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-2 z-0 h-36 w-36 rounded-full bg-unify-blue" />
              <svg
                className="absolute bottom-10 right-32 z-20 h-20 w-12 opacity-25"
                fill="none"
                stroke="#3a1700"
                strokeWidth="2.5"
                viewBox="0 0 40 80"
              >
                <path d="M6 4 Q 16 40 6 76" />
                <path d="M18 4 Q 28 40 18 76" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { value: platformStats.campaignCount >= 1000 ? `${Math.round(platformStats.campaignCount / 1000)}K+` : `${platformStats.campaignCount}+`, label: "Numri i Mbështetësve" },
              { value: platformStats.volunteerCount >= 1000 ? `${Math.round(platformStats.volunteerCount / 1000)}K+` : `${platformStats.volunteerCount}+`, label: "Vullnetarë Botërorë" },
              { value: platformStats.totalDonated >= 1000 ? `${Math.round(platformStats.totalDonated / 1000)}K+` : `€${platformStats.totalDonated}`, label: "Kemi Mbledhur" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center rounded-2xl border border-border p-8 text-center"
              >
                <span className="font-display text-5xl text-unify-brown">{s.value}</span>
                <span className="mt-2 text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-unify-blue">
            Rastet Tona
          </p>
          <h2 className="mb-12 text-center font-display text-4xl text-unify-brown">
            Shkaqet Tona të Fundit
          </h2>
          {campaignsLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {homeCampaigns.map((c) => (
                <CampaignCard
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  description={c.description}
                  category={c.category}
                  imageUrl={c.imageUrl}
                  raised={c.raised}
                  goal={c.goal}
                  daysLeft={c.daysLeft}
                  donorCount={c.donorCount}
                  creatorName={c.creatorName}
                  verified={c.verified}
                  onDonate={() => router.push(`/kampanjat/${c.slug}`)}
                  onClick={() => router.push(`/kampanjat/${c.slug}`)}
                />
              ))}
            </div>
          )}
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="uppercase tracking-widest"
              onClick={() => router.push("/kampanjat")}
            >
              Shiko të gjitha
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-unify-cream py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div className="relative">
              <div className="absolute -left-4 -top-4 z-[1] h-20 w-16 rounded-lg bg-unify-blue" />
              <div className="relative z-[2] mx-auto aspect-square max-w-sm overflow-hidden rounded-[24px] shadow-lg md:mx-0">
                <img
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=600&fit=crop"
                  alt="Forma më e lartë e dashurisë"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 z-[1] h-24 w-24 rounded-full bg-unify-blue" />
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-unify-blue">
                Rreth Nesh
              </p>
              <h2 className="mb-5 font-display text-4xl leading-tight text-unify-brown md:text-5xl">
                Forma më e lartë
                <br />e dashurisë
              </h2>
              <p className="mb-7 text-sm italic leading-relaxed text-muted-foreground">
                "Kuptimi i jetës është të gjesh dhuratën tënde.
                <br />
                Qëllimi i jetës është ta japësh atë." - Pablo Picasso
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/rreth-nesh")}
                className="uppercase tracking-widest"
              >
                Rreth Nesh
              </Button>
            </div>
          </div>

          <div className="mt-20">
            <p className="mx-auto mb-8 max-w-lg text-center font-display text-base text-unify-brown">
              Çfarëdo që ju intereson, do të ketë një organizatë që punon për të.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { num: "42", title: "Njerëz", sub: "Parandalimi i Dhunës" },
                { num: "73", title: "Shoqëri", sub: "Kushtet e Përdorimit" },
                { num: "09", title: "Projekt", sub: "Spital Hulumtues" },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-sm">
                  <span className="font-display text-5xl leading-none text-unify-brown">{s.num}</span>
                  <div>
                    <div className="text-sm font-bold text-unify-brown">{s.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 grid items-center gap-16 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-unify-blue">
                Vullnetarë
              </p>
              <h2 className="mb-5 font-display text-4xl leading-tight text-unify-brown md:text-5xl">
                Dashurinë e pashprehur ndaj njerëzve
              </h2>
              <p className="mb-8 text-sm italic leading-relaxed text-muted-foreground">
                "Nëse doni të ngritni veten, ngritni dikë tjetër." - Booker T. Washington
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/shpalljet?kind=VOLUNTEER_CONTRIBUTION")}
                className="uppercase tracking-widest"
              >
                Bëhu Vullnetar
              </Button>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute left-8 top-0 z-[1] h-20 w-20 rounded-full bg-unify-blue" />
              <div className="relative z-[2] h-64 w-64 overflow-hidden rounded-full shadow-xl md:h-80 md:w-80">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=600&fit=crop"
                  alt="Vullnetarë"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-4 z-[1] h-24 w-24 rounded-full bg-unify-blue" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-unify-blue">
            Shërbimet Tona
          </p>
          <h2 className="mb-12 font-display text-4xl text-unify-brown">Shërbimet që Ofrojmë</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="flex flex-col gap-4 rounded-[24px] bg-unify-cream p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-full rounded-bl-none bg-unify-blue">
                  <MessageCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div className="h-0.5 w-8 rounded-full bg-unify-brown/20" />
                <h3 className="font-display text-xl text-unify-brown">{s.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <button
                  onClick={() => router.push("/sherbimet")}
                  className="inline-flex self-start rounded-full bg-[#7a93c0] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                >
                  Mëso Më Shumë
                  <ArrowRightIcon className="ml-2 h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="uppercase tracking-widest"
              onClick={() => router.push("/sherbimet")}
            >
              Shiko të gjitha
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-unify-cream py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="mb-10 text-center text-xs font-bold uppercase tracking-[0.2em] text-unify-blue">
            Shikoni Galerinë Tonë
          </p>
          <div className="hidden grid-cols-4 gap-4 md:grid" style={{ gridTemplateRows: "260px 260px" }}>
            <div className="row-span-1 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=260&fit=crop"
                alt="Gallery 1"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=700&h=560&fit=crop"
                alt="Gallery kryesore"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  aria-label="Video"
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-105"
                >
                  <svg className="ml-1 h-7 w-7 text-unify-blue" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="row-span-1 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=260&fit=crop"
                alt="Gallery 3"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="row-span-1 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=260&fit=crop"
                alt="Gallery 2"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="row-span-1 overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=260&fit=crop"
                alt="Gallery 4"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {[
              "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=260&fit=crop",
              "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=260&fit=crop",
              "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=260&fit=crop",
              "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=260&fit=crop",
            ].map((src, i) => (
              <div key={i} className="aspect-video overflow-hidden rounded-2xl">
                <img src={src} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="lg" className="uppercase tracking-widest">
              Shiko të gjitha
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-unify-blue py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <h2 className="text-center font-display text-3xl text-white md:text-left md:text-4xl">
              Bashkohu me misionin tonë!
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.push("/kampanjat")}
                className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-unify-brown transition-opacity hover:opacity-90"
              >
              Dhuro
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                  <svg className="ml-0.5 h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => router.push("/shpalljet?kind=VOLUNTEER_CONTRIBUTION")}
                className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-unify-brown transition-opacity hover:opacity-90"
              >
                Hapi 02
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                  <svg className="ml-0.5 h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-unify-cream py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-unify-blue">Ekipi</p>
          <h2 className="mb-10 font-display text-4xl text-unify-brown">Ekipi Ynë</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
            {TEAM.map((v) => (
              <div key={v.name} className="overflow-hidden rounded-[20px] bg-white shadow-sm">
                <div className={`aspect-square bg-gradient-to-br ${v.avatarClass} relative flex items-center justify-center overflow-hidden`}>
                  <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-white/15" />
                  <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-black/10" />
                  <div className="relative h-28 w-28 rotate-[-6deg] overflow-hidden rounded-[30px] bg-white/30 shadow-xl ring-4 ring-white/25 transition-transform duration-500 hover:rotate-3 hover:scale-105">
                    <img src={v.avatarUrl} alt={v.name} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="p-4 text-center">
                  <p className="font-display text-base text-unify-brown">{v.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{v.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="uppercase tracking-widest"
              onClick={() => router.push("/rreth-nesh")}
            >
              Ekipi i plotë
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-unify-cream py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-unify-blue">
            Histori Fëmijësh
          </p>
          <h2 className="mb-10 text-center font-display text-4xl text-unify-brown">Lexo Historinë</h2>
          <div className="mx-auto max-w-2xl rounded-[28px] bg-white p-10 shadow-sm">
            <div className="mb-7 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-unify-blue/10">
                <svg className="h-6 w-6 text-unify-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>
            <p className="mb-8 text-center text-sm leading-relaxed text-muted-foreground">
              "{story.quote}"
            </p>
            <div className="mb-5 flex flex-col items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                {story.label}
              </p>
              <div className="flex -space-x-2">
                {TESTIMONIAL_AVATARS.map((url, i) => (
                  <div
                    key={i}
                    className={`overflow-hidden rounded-full border-2 border-white ${
                      i === 2 ? "h-12 w-12 z-10" : "h-9 w-9"
                    }`}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center font-bold text-unify-brown">{story.name}</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                aria-label="Më parë"
                onClick={showPreviousStory}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-unify-cream"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                aria-label="Tjetër"
                onClick={showNextStory}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-unify-cream"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20">
        <div className="absolute right-0 top-1/2 h-72 w-40 -translate-y-1/2 rounded-l-full bg-unify-blue" />
        <div className="relative z-10 mx-auto max-w-2xl px-4 md:px-6">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-unify-blue">
            FAQ
          </p>
          <h2 className="text-center font-display text-4xl leading-tight text-unify-brown">
            Përgjigjet e të Gjitha
            <br />
            Pyetjeve Tuaja
          </h2>
          <div className="mx-auto mb-3 mt-3 h-1 w-8 rounded-full bg-unify-blue" />
          <p className="mb-10 text-center text-sm text-muted-foreground">Pyetjet më të shpeshta?</p>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = faqOpen === i
              return (
                <div
                  key={i}
                  className={`overflow-hidden rounded-xl border transition-colors ${
                    isOpen ? "border-unify-blue bg-unify-blue" : "border-unify-blue bg-white"
                  }`}
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between px-6 py-4"
                  >
                    <span
                      className={`pr-4 text-left text-sm font-bold ${
                        isOpen ? "text-white" : "text-unify-blue"
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      className={`flex-shrink-0 text-2xl font-light leading-none ${
                        isOpen ? "text-white" : "text-unify-blue"
                      }`}
                    >
                      {isOpen ? "×" : "+"}
                    </span>
                  </button>
                  {isOpen && <div className="px-6 pb-5 text-sm leading-relaxed text-white/90">{item.answer}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-unify-cream py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-unify-blue">
                Bamirësi
              </p>
              <h2 className="mb-6 font-display text-4xl leading-tight text-unify-brown md:text-5xl">
                Dhënie ndihmë ndaj atyre që kanë nevojë
              </h2>
              <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Bamirësia është akti i dhënies ndihmës ndaj atyre që kanë nevojë. Është një akt
                humanitar.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/kampanjat")}
                className="uppercase tracking-widest"
              >
                Dhuro
              </Button>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-[24px] shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&h=530&fit=crop"
                alt="Bamirësi"
                className="h-full w-full object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
