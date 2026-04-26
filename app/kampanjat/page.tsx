"use client"

// ============================================================
// BRANCH: feat/listings
// FIGMA:
//   • Shpalljet Publike → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=54-2
// NOTION: https://www.notion.so/34874891227e81fd9a06df93436ce2d9
// ============================================================

import * as React from "react"
import { CampaignCard, SearchBar, FilterChips } from "@/components/public"
import { Pagination, Badge, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { NAV_LINKS } from "@/app/_lib/constants"

const CATEGORIES = [
  { label: "Të gjitha", value: "all" },
  { label: "Mjekësore", value: "Mjekësore" },
  { label: "Arsim", value: "Arsim" },
  { label: "Emergjencë", value: "Emergjencë" },
  { label: "Komunitet", value: "Komunitet" },
  { label: "Sport", value: "Sport" },
  { label: "Kafshë", value: "Kafshë" },
  { label: "Mjedis", value: "Mjedis" },
]

const LOCATIONS = [
  { label: "Të gjitha", value: "all" },
  { label: "Prishtinë", value: "Prishtinë" },
  { label: "Tiranë", value: "Tiranë" },
  { label: "Prizren", value: "Prizren" },
  { label: "Shkup", value: "Shkup" },
  { label: "Diaspora", value: "Diaspora" },
]

type Campaign = {
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
  createdAt: number
}

const CAMPAIGNS: Campaign[] = [
  { id: "c1", title: "Ndihmë për operacionin e Ariut", description: "Familja jonë po përballet me një sfidë të madhe shëndetësore.", imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800", category: "Mjekësore", location: "Prishtinë", raised: 8450, goal: 15000, daysLeft: 12, donorCount: 234, creatorName: "Familja Krasniqi", verified: true, urgent: true, createdAt: 10 },
  { id: "c2", title: "Rinovimi i bibliotekës së fshatit", description: "Libra të rinj dhe mobilie për bibliotekën e komunitetit.", imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800", category: "Arsim", location: "Prizren", raised: 3200, goal: 5000, daysLeft: 25, donorCount: 87, creatorName: "Shoqata Dritë", verified: true, createdAt: 8 },
  { id: "c3", title: "Strehimi për qentë e rrugës", description: "Ndërtojmë një strehë për qentë pa shtëpi.", imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800", category: "Kafshë", location: "Tiranë", raised: 1800, goal: 8000, daysLeft: 45, donorCount: 56, creatorName: "Anila Hoxha", verified: false, createdAt: 6 },
  { id: "c4", title: "Pajisje sportive për shkollën", description: "Topa, rrjeta dhe pajisje për edukatën fizike.", imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800", category: "Sport", location: "Prishtinë", raised: 950, goal: 2500, daysLeft: 30, donorCount: 41, creatorName: "Drin Gashi", verified: true, createdAt: 4 },
  { id: "c5", title: "Trajtim urgjent për Lirën (2 vjeç)", description: "Lira ka nevojë për operacion jashtë vendit.", imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800", category: "Mjekësore", location: "Diaspora", raised: 23100, goal: 45000, daysLeft: 8, donorCount: 512, creatorName: "Familja Berisha", verified: true, urgent: true, createdAt: 12 },
  { id: "c6", title: "Mbjellja e 1000 pemëve", description: "Projekt mjedisor për të rikthyer gjelbërimin.", imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800", category: "Mjedis", location: "Shkup", raised: 4200, goal: 6000, daysLeft: 20, donorCount: 118, creatorName: "EcoAlbania", verified: true, createdAt: 9 },
  { id: "c7", title: "Ndihmë për familjet pas tërmetit", description: "Ushqim, strehim dhe pajisje për familjet.", imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800", category: "Emergjencë", location: "Tiranë", raised: 12800, goal: 20000, daysLeft: 5, donorCount: 367, creatorName: "Kryqi i Kuq", verified: true, urgent: true, createdAt: 11 },
  { id: "c8", title: "Rikonstruktimi i pallatit të kulturës", description: "Restaurimi i objektit historik të komunitetit.", imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800", category: "Komunitet", location: "Prishtinë", raised: 6300, goal: 12000, daysLeft: 40, donorCount: 145, creatorName: "Komuna e Prishtinës", verified: true, createdAt: 5 },
  { id: "c9", title: "Laptop për studentët e fakultetit", description: "50 laptopa për studentët e skamur.", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800", category: "Arsim", location: "Tiranë", raised: 2100, goal: 10000, daysLeft: 35, donorCount: 62, creatorName: "Fondacioni i Edukimit", verified: true, createdAt: 3 },
  { id: "c10", title: "Pajisje mjekësore për spitalin", description: "Pajisje moderne për spitalin rajonal.", imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800", category: "Mjekësore", location: "Shkup", raised: 18500, goal: 30000, daysLeft: 15, donorCount: 289, creatorName: "Spitali Rajonal", verified: true, createdAt: 7 },
]

const PAGE_SIZE = 9

type SortKey = "newest" | "urgent" | "almostDone" | "mostFunded"

export default function KampanjaListPage() {
  const [category, setCategory] = React.useState("all")
  const [location, setLocation] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState<SortKey>("urgent")
  const [page, setPage] = React.useState(1)

  const filtered = React.useMemo(() => {
    let items = CAMPAIGNS.filter((c) => {
      if (category !== "all" && c.category !== category) return false
      if (location !== "all" && c.location !== location) return false
      if (query && !c.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })

    items = [...items].sort((a, b) => {
      if (sort === "urgent") return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || a.daysLeft - b.daysLeft
      if (sort === "newest") return b.createdAt - a.createdAt
      if (sort === "almostDone") return (b.raised / b.goal) - (a.raised / a.goal)
      if (sort === "mostFunded") return b.raised - a.raised
      return 0
    })

    return items
  }, [category, location, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => { setPage(1) }, [category, location, query, sort])

  return (
    <PublicLayout
      navbar={{ links: NAV_LINKS, onLogin: () => {}, onRegister: () => {}, onSearch: () => {} }}
      footer={{
        tagline: "Platforma e parë për crowdfunding dhe ndihmë vullnetare për të gjithë shqiptarët.",
        sections: [
          { title: "Platforma", links: [{ label: "Si Funksionon", href: "/si-funksionon" }, { label: "Rreth Nesh", href: "/rreth-nesh" }, { label: "Blog", href: "/blog" }] },
          { title: "Ligjore", links: [{ label: "Kushtet", href: "/kushtet" }, { label: "Privatësia", href: "/privatesia" }] },
          { title: "Kontakt", links: [{ label: "Na Shkruaj", href: "/kontakt" }] },
        ],
        socials: [{ platform: "facebook", href: "#" }, { platform: "instagram", href: "#" }],
      }}
    >
      {/* Hero */}
      <section className="bg-unify-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-4">Kampanja Donacionesh</Badge>
            <h1 className="font-display text-4xl md:text-5xl text-unify-brown mb-4">
              Kampanjat Aktive
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Gjej një kampanjë që të flet dhe dhuroji një kontribut. Çdo euro numërohet.
            </p>
            <SearchBar value={query} onChange={setQuery} placeholder="Kërko kampanjë..." size="lg" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Kategoria</p>
            <FilterChips options={CATEGORIES} value={category} onChange={setCategory} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Lokacioni</p>
            <FilterChips options={LOCATIONS} value={location} onChange={setLocation} />
          </div>
        </div>
      </section>

      {/* Sort + Results */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-unify-brown">{filtered.length}</span> kampanja
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rendit:</span>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgjente së pari</SelectItem>
                  <SelectItem value="newest">Më të rejat</SelectItem>
                  <SelectItem value="almostDone">Afër qëllimit</SelectItem>
                  <SelectItem value="mostFunded">Më të financuara</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {pageItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-unify-brown mb-2">Nuk u gjet asnjë kampanjë</p>
              <p className="text-muted-foreground">Provo filtra tjerë ose fjalë kyçe.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((c) => (
                <CampaignCard
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  description={c.description}
                  imageUrl={c.imageUrl}
                  category={c.urgent ? "URGJENTE" : c.category}
                  location={c.location}
                  raised={c.raised}
                  goal={c.goal}
                  daysLeft={c.daysLeft}
                  donorCount={c.donorCount}
                  creatorName={c.creatorName}
                  verified={c.verified}
                  onClick={() => { window.location.href = `/kampanjat/${c.id}` }}
                  onBookmark={() => {}}
                  onShare={() => {}}
                  onDonate={() => {}}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
