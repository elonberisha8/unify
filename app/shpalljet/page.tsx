"use client"

// ============================================================
// BRANCH: feat/listings
// FIGMA:
//   • Shpalljet Publike → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=54-2
//   • Search → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=47-2
// NOTION: https://www.notion.so/34874891227e81fd9a06df93436ce2d9
// ============================================================

import * as React from "react"
import { CampaignCard, VolunteerCard, SearchBar, FilterChips } from "@/components/public"
import { Tabs, TabsList, TabsTrigger, Pagination, Badge } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../_lib/public-layout-config"

const CATEGORIES = [
  { label: "Të gjitha", value: "all" },
  { label: "Mjekësore", value: "medical" },
  { label: "Arsim", value: "education" },
  { label: "Emergjencë", value: "emergency" },
  { label: "Komunitet", value: "community" },
  { label: "Sport", value: "sports" },
  { label: "Kafshë", value: "animals" },
  { label: "Mjedis", value: "environment" },
]

const LOCATIONS = [
  { label: "Të gjitha", value: "all" },
  { label: "Prishtinë", value: "prishtine" },
  { label: "Tiranë", value: "tirane" },
  { label: "Prizren", value: "prizren" },
  { label: "Shkup", value: "shkup" },
  { label: "Diaspora", value: "diaspora" },
]

type CampaignItem = {
  kind: "campaign"
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  location: string
  raised: number
  goal: number
  daysLeft: number
  donorCount: number
  creatorName: string
  verified: boolean
  urgent?: boolean
}

type VolunteerItem = {
  kind: "volunteer"
  id: string
  title: string
  organization: string
  imageUrl: string
  category: string
  location: string
  hoursPerWeek: string
  startDate: string
  applicantCount: number
  skills: string[]
}

type Item = CampaignItem | VolunteerItem

const MOCK: Item[] = [
  {
    kind: "campaign",
    id: "c1",
    title: "Ndihmë për operacionin e Ariut",
    description: "Familja jonë po përballet me një sfidë të madhe shëndetësore. Ju lutemi na ndihmoni.",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    category: "Mjekësore",
    location: "Prishtinë",
    raised: 8450,
    goal: 15000,
    daysLeft: 12,
    donorCount: 234,
    creatorName: "Familja Krasniqi",
    verified: true,
    urgent: true,
  },
  {
    kind: "volunteer",
    id: "v1",
    title: "Mësues vullnetar matematike për 6 fëmijë",
    organization: "Shkolla '7 Shtatori'",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    category: "Arsim",
    location: "Tiranë",
    hoursPerWeek: "4h/javë",
    startDate: "1 Maj",
    applicantCount: 12,
    skills: ["Matematikë", "Mësimdhënie"],
  },
  {
    kind: "campaign",
    id: "c2",
    title: "Rinovimi i bibliotekës së fshatit",
    description: "Po mbledhim fonde për librat e rinj dhe mobiliet për bibliotekën e komunitetit tonë.",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
    category: "Arsim",
    location: "Prizren",
    raised: 3200,
    goal: 5000,
    daysLeft: 25,
    donorCount: 87,
    creatorName: "Shoqata Dritë",
    verified: true,
  },
  {
    kind: "volunteer",
    id: "v2",
    title: "Dhurim rrobash dimërore",
    organization: "Individuale (anonim)",
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800",
    category: "Komunitet",
    location: "Shkup",
    hoursPerWeek: "Një herë",
    startDate: "Menjëherë",
    applicantCount: 34,
    skills: ["Rroba fëmijësh"],
  },
  {
    kind: "campaign",
    id: "c3",
    title: "Strehimi për qentë e rrugës",
    description: "Ndërtojmë një strehë për qentë pa shtëpi në periferi të qytetit.",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
    category: "Kafshë",
    location: "Tiranë",
    raised: 1800,
    goal: 8000,
    daysLeft: 45,
    donorCount: 56,
    creatorName: "Anila Hoxha",
    verified: false,
  },
  {
    kind: "campaign",
    id: "c4",
    title: "Pajisje sportive për shkollën fillore",
    description: "Ndihmonani të blejmë topat, rrjetat dhe pajisje për edukatën fizike.",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    category: "Sport",
    location: "Prishtinë",
    raised: 950,
    goal: 2500,
    daysLeft: 30,
    donorCount: 41,
    creatorName: "Drin Gashi",
    verified: true,
  },
  {
    kind: "volunteer",
    id: "v3",
    title: "Transport për të moshuarit te mjeku",
    organization: "Drita e Shpresës",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    category: "Komunitet",
    location: "Prishtinë",
    hoursPerWeek: "6h/javë",
    startDate: "Menjëherë",
    applicantCount: 8,
    skills: ["Patentë shoferi", "Makinë"],
  },
  {
    kind: "campaign",
    id: "c5",
    title: "Trajtim urgjent për Lirën (2 vjeç)",
    description: "Lira ka nevojë për operacion jashtë vendit. Çdo euro ndihmon.",
    imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800",
    category: "Mjekësore",
    location: "Diaspora",
    raised: 23100,
    goal: 45000,
    daysLeft: 8,
    donorCount: 512,
    creatorName: "Familja Berisha",
    verified: true,
    urgent: true,
  },
  {
    kind: "volunteer",
    id: "v4",
    title: "Riparim laptopësh për studentë",
    organization: "TechHelp KS (Verified)",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    category: "Arsim",
    location: "Prishtinë",
    hoursPerWeek: "2h/javë",
    startDate: "15 Maj",
    applicantCount: 19,
    skills: ["IT", "Hardware"],
  },
  {
    kind: "campaign",
    id: "c6",
    title: "Mbjellja e 1000 pemëve",
    description: "Projekt mjedisor për të rikthyer gjelbërimin në zonën tonë.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    category: "Mjedis",
    location: "Shkup",
    raised: 4200,
    goal: 6000,
    daysLeft: 20,
    donorCount: 118,
    creatorName: "EcoAlbania",
    verified: true,
  },
  {
    kind: "volunteer",
    id: "v5",
    title: "Kurs falas kompjuteri për të moshuarit",
    organization: "Qendra e Komunitetit",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    category: "Arsim",
    location: "Tiranë",
    hoursPerWeek: "3h/javë",
    startDate: "1 Qershor",
    applicantCount: 6,
    skills: ["Kompjuter bazik"],
  },
  {
    kind: "campaign",
    id: "c7",
    title: "Ndihmë për familjet pas tërmetit",
    description: "Ushqim, strehim dhe pajisje për familjet e prekura nga tërmeti i fundit.",
    imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
    category: "Emergjencë",
    location: "Tiranë",
    raised: 12800,
    goal: 20000,
    daysLeft: 5,
    donorCount: 367,
    creatorName: "Kryqi i Kuq",
    verified: true,
    urgent: true,
  },
]

const PAGE_SIZE = 9

export default function ShpalljetPage() {
  const [tab, setTab] = React.useState<"all" | "campaign" | "volunteer">("all")
  const [category, setCategory] = React.useState("all")
  const [location, setLocation] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)

  const filtered = React.useMemo(() => {
    return MOCK.filter((it) => {
      if (tab === "campaign" && it.kind !== "campaign") return false
      if (tab === "volunteer" && it.kind !== "volunteer") return false
      if (
        category !== "all" &&
        it.category.toLowerCase() !== category.toLowerCase() &&
        !(category === "medical" && it.category === "Mjekësore") &&
        !(category === "education" && it.category === "Arsim") &&
        !(category === "emergency" && it.category === "Emergjencë") &&
        !(category === "community" && it.category === "Komunitet") &&
        !(category === "sports" && it.category === "Sport") &&
        !(category === "animals" && it.category === "Kafshë") &&
        !(category === "environment" && it.category === "Mjedis")
      ) {
        return false
      }
      if (location !== "all") {
        const map: Record<string, string> = {
          prishtine: "Prishtinë",
          tirane: "Tiranë",
          prizren: "Prizren",
          shkup: "Shkup",
          diaspora: "Diaspora",
        }
        if (it.location !== map[location]) return false
      }
      if (query && !it.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [tab, category, location, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [tab, category, location, query])

  const counts = React.useMemo(
    () => ({
      all: MOCK.length,
      campaign: MOCK.filter((i) => i.kind === "campaign").length,
      volunteer: MOCK.filter((i) => i.kind === "volunteer").length,
    }),
    []
  )

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="border-b border-border bg-unify-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              Të gjitha shpalljet
            </Badge>
            <h1 className="mb-4 font-display text-4xl text-unify-brown md:text-5xl">Shpalljet Publike</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Kërko mes kampanjave të donacioneve dhe aseteve vullnetare. Algoritmi ynë rendit
              sipas urgjencës dhe interesit.
            </p>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Kërko kampanja, vullnetarë, vende..."
              size="lg"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              <TabsTrigger value="all">Të Gjitha ({counts.all})</TabsTrigger>
              <TabsTrigger value="campaign">Donacione ({counts.campaign})</TabsTrigger>
              <TabsTrigger value="volunteer">Vullnetare ({counts.volunteer})</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-3">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Kategoria</p>
              <FilterChips options={CATEGORIES} value={category} onChange={setCategory} />
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Lokacioni</p>
              <FilterChips options={LOCATIONS} value={location} onChange={setLocation} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-unify-brown">{filtered.length}</span> rezultate
            </p>
          </div>

          {pageItems.length === 0 ? (
            <div className="py-20 text-center">
              <p className="mb-2 font-display text-2xl text-unify-brown">Nuk u gjet asgjë</p>
              <p className="text-muted-foreground">Provo filtra tjerë ose fjalë kyçe.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((it) =>
                it.kind === "campaign" ? (
                  <CampaignCard
                    key={it.id}
                    id={it.id}
                    title={it.title}
                    description={it.description}
                    imageUrl={it.imageUrl}
                    category={it.urgent ? "URGJENTE" : it.category}
                    location={it.location}
                    raised={it.raised}
                    goal={it.goal}
                    daysLeft={it.daysLeft}
                    donorCount={it.donorCount}
                    creatorName={it.creatorName}
                    verified={it.verified}
                    onClick={() => {
                      window.location.href = `/kampanjat/${it.id}`
                    }}
                    onDonate={() => {
                      window.location.href = `/kampanjat/${it.id}`
                    }}
                  />
                ) : (
                  <VolunteerCard
                    key={it.id}
                    title={it.title}
                    organization={it.organization}
                    imageUrl={it.imageUrl}
                    category={it.category}
                    location={it.location}
                    hoursPerWeek={it.hoursPerWeek}
                    startDate={it.startDate}
                    applicantCount={it.applicantCount}
                    skills={it.skills}
                    onClick={() => {
                      window.location.href = `/vullnetare/${it.id}`
                    }}
                    onApply={() => {}}
                  />
                )
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
