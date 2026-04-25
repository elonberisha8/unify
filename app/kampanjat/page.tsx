"use client"

// ============================================================
// BRANCH: feat/listings
// FIGMA:
//   • Shpalljet Publike → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=54-2
// NOTION: https://www.notion.so/34874891227e81fd9a06df93436ce2d9
// ============================================================

import * as React from "react"
import { CampaignCard, SearchBar, FilterChips } from "@/components/public"
import {
  Pagination,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Skeleton,
} from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../_lib/public-layout-config"
import { apiFetch, type Campaign } from "@/app/_lib/api"

const CATEGORIES = [
  { label: "Të gjitha", value: "all" },
  { label: "Mjekësore", value: "Medical" },
  { label: "Arsim", value: "Education" },
  { label: "Emergjencë", value: "Emergency" },
  { label: "Komunitet", value: "Community" },
  { label: "Sport", value: "Sports" },
  { label: "Kafshë", value: "Animals" },
  { label: "Mjedis", value: "Environment" },
]

const LOCATIONS = [
  { label: "Të gjitha", value: "all" },
  { label: "Prishtinë", value: "Prishtinë" },
  { label: "Tiranë", value: "Tiranë" },
  { label: "Prizren", value: "Prizren" },
  { label: "Shkup", value: "Shkup" },
  { label: "Diaspora", value: "Diaspora" },
]

type CampaignRow = {
  id: string
  slug: string
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
  urgent: boolean
  createdAt: number
}

type SortKey = "newest" | "urgent" | "almostDone" | "mostFunded"

const PAGE_SIZE = 9

function calcDaysLeft(endsAt: string | null): number {
  if (!endsAt) return 999
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function mapCampaign(c: Campaign): CampaignRow {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.shortDescription ?? c.description.slice(0, 120),
    imageUrl: c.images[0] ?? "",
    category: c.category,
    location: c.location,
    raised: c.currentAmount,
    goal: c.targetAmount,
    daysLeft: calcDaysLeft(c.endsAt),
    donorCount: c._count.donations,
    creatorName: c.isAnonymous ? "Anonim" : c.creator.name,
    verified: c.creator.isVerified,
    urgent: c.isUrgent,
    createdAt: new Date(c.createdAt).getTime(),
  }
}

export default function KampanjaListPage() {
  const [campaigns, setCampaigns] = React.useState<CampaignRow[]>([])
  const [loading, setLoading] = React.useState(true)

  const [category, setCategory] = React.useState("all")
  const [location, setLocation] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState<SortKey>("urgent")
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await apiFetch<{ campaigns: Campaign[] } | Campaign[]>("/campaigns")
        const data = Array.isArray(res)
          ? res
          : ((res as { campaigns?: Campaign[] }).campaigns ?? [])
        setCampaigns(data.map(mapCampaign))
      } catch {
        setCampaigns([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = React.useMemo(() => {
    let items = campaigns.filter((c) => {
      if (category !== "all" && c.category !== category) return false
      if (location !== "all" && c.location !== location) return false
      if (query && !c.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })

    items = [...items].sort((a, b) => {
      if (sort === "urgent") return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || a.daysLeft - b.daysLeft
      if (sort === "newest") return b.createdAt - a.createdAt
      if (sort === "almostDone") return b.raised / b.goal - a.raised / a.goal
      if (sort === "mostFunded") return b.raised - a.raised
      return 0
    })

    return items
  }, [campaigns, category, location, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [category, location, query, sort])

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="border-b border-border bg-unify-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              Kampanja Donacionesh
            </Badge>
            <h1 className="mb-4 font-display text-4xl text-unify-brown md:text-5xl">
              Kampanjat Aktive
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Gjej një kampanjë që të flet dhe dhuroji një kontribut. Çdo euro numërohet.
            </p>
            <SearchBar value={query} onChange={setQuery} placeholder="Kërko kampanjë..." size="lg" />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Kategoria</p>
            <FilterChips options={CATEGORIES} value={category} onChange={setCategory} />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Lokacioni</p>
            <FilterChips options={LOCATIONS} value={location} onChange={setLocation} />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-3xl" />
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                <div className="py-20 text-center">
                  <p className="mb-2 font-display text-2xl text-unify-brown">Nuk u gjet asnjë kampanjë</p>
                  <p className="text-muted-foreground">Provo filtra tjerë ose fjalë kyçe.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      onClick={() => {
                        window.location.href = `/kampanjat/${c.slug}`
                      }}
                      onDonate={() => {
                        window.location.href = `/kampanjat/${c.slug}`
                      }}
                    />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
