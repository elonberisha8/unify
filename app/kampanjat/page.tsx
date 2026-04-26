"use client"

// ============================================================
// BRANCH: feat/listings
// FIGMA:
//   - Shpalljet Publike -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=54-2
// NOTION: https://www.notion.so/34874891227e81fd9a06df93436ce2d9
// ============================================================

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CampaignCard, SearchBar, FilterChips } from "@/components/public"
import {
  Pagination,
  Badge,
  Button,
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
  { label: "Te gjitha", value: "all" },
  { label: "Mjekesore", value: "MEDICAL" },
  { label: "Arsim", value: "EDUCATION" },
  { label: "Emergjence", value: "EMERGENCY" },
  { label: "Komunitet", value: "COMMUNITY" },
  { label: "Sport", value: "SPORTS" },
  { label: "Kafshe", value: "ANIMALS" },
  { label: "Mjedis", value: "ENVIRONMENT" },
  { label: "Teknologji", value: "TECHNOLOGY" },
  { label: "Kreative", value: "CREATIVE" },
  { label: "Tjera", value: "OTHER" },
]

const LOCATIONS = [
  { label: "Te gjitha", value: "all" },
  { label: "Prishtine", value: "Prishtine" },
  { label: "Tirane", value: "Tirane" },
  { label: "Prizren", value: "Prizren" },
  { label: "Shkup", value: "Shkup" },
  { label: "Diaspora", value: "Diaspora" },
]

const SORT_OPTIONS = [
  { label: "Urgjente se pari", value: "urgent" },
  { label: "Me te rejat", value: "newest" },
  { label: "Afer qellimit", value: "almostDone" },
  { label: "Me te financuara", value: "mostFunded" },
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
}

type SortKey = "urgent" | "newest" | "almostDone" | "mostFunded"

const PAGE_SIZE = 9
const CATEGORY_VALUES = CATEGORIES.map((item) => item.value)
const LOCATION_VALUES = LOCATIONS.map((item) => item.value)
const SORT_VALUES = SORT_OPTIONS.map((item) => item.value)

function calcDaysLeft(endsAt: string | null): number {
  if (!endsAt) return 999
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function normalizeValue(value: string | null, allowed: string[], fallback: string) {
  if (!value) return fallback
  return allowed.includes(value) ? value : fallback
}

function normalizePage(value: string | null) {
  const parsed = Number.parseInt(value ?? "1", 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function labelFor(options: Array<{ label: string; value: string }>, value: string) {
  return options.find((item) => item.value === value)?.label ?? value
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
  }
}

export default function KampanjaListPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const category = normalizeValue(searchParams.get("category"), CATEGORY_VALUES, "all")
  const location = normalizeValue(searchParams.get("location"), LOCATION_VALUES, "all")
  const sort = normalizeValue(searchParams.get("sort"), SORT_VALUES, "urgent") as SortKey
  const query = (searchParams.get("search") ?? "").trim()
  const page = normalizePage(searchParams.get("page"))

  const [campaigns, setCampaigns] = React.useState<CampaignRow[]>([])
  const [total, setTotal] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [queryDraft, setQueryDraft] = React.useState(query)

  const updateQuery = React.useCallback(
    (next: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(next).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all" || value === 1) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })
      const url = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(url, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  React.useEffect(() => {
    setQueryDraft(query)
  }, [query])

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const clean = queryDraft.trim()
      if (clean !== query) updateQuery({ search: clean || null, page: null })
    }, 350)

    return () => window.clearTimeout(timer)
  }, [queryDraft, query, updateQuery])

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          sort,
          page: String(page),
          limit: String(PAGE_SIZE),
        })
        if (category !== "all") params.set("category", category)
        if (location !== "all") params.set("location", location)
        if (query) params.set("search", query)

        const res = await apiFetch<{ campaigns: Campaign[]; total: number }>(
          `/campaigns?${params.toString()}`
        )

        if (!cancelled) {
          setCampaigns(res.campaigns.map(mapCampaign))
          setTotal(res.total)
        }
      } catch {
        if (!cancelled) {
          setCampaigns([])
          setTotal(0)
          setError("Nuk arritem t'i marrim kampanjat nga databaza.")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [category, location, page, query, sort])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasFilters = category !== "all" || location !== "all" || sort !== "urgent" || query.length > 0
  const clearFilters = () => router.replace(pathname, { scroll: false })

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
              Gjej nje kampanje qe te flet dhe dhuroji nje kontribut. Cdo euro numeroret.
            </p>
            <SearchBar value={queryDraft} onChange={setQueryDraft} placeholder="Kerko kampanje..." size="lg" />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 md:px-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Kategoria</p>
            <FilterChips
              options={CATEGORIES}
              value={category}
              onChange={(value) => updateQuery({ category: value, page: null })}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Lokacioni</p>
            <FilterChips
              options={LOCATIONS}
              value={location}
              onChange={(value) => updateQuery({ location: value, page: null })}
            />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-unify-brown">{total}</span> kampanja
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {hasFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Pastro filtrat
                </Button>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rendit:</span>
                <Select value={sort} onValueChange={(value) => updateQuery({ sort: value, page: null })}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-3xl" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-border bg-white p-12 text-center">
              <p className="mb-2 font-display text-2xl text-unify-brown">Dicka shkoi keq</p>
              <p className="mb-6 text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>Provo perseri</Button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="rounded-3xl border border-border bg-white p-16 text-center">
              <p className="mb-2 font-display text-2xl text-unify-brown">Nuk u gjet asnje kampanje</p>
              <p className="mb-6 text-muted-foreground">Provo filtra tjere ose fjale kyce.</p>
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Pastro filtrat
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  id={campaign.id}
                  title={campaign.title}
                  description={campaign.description}
                  imageUrl={campaign.imageUrl}
                  category={campaign.urgent ? "URGJENTE" : labelFor(CATEGORIES, campaign.category)}
                  location={campaign.location}
                  raised={campaign.raised}
                  goal={campaign.goal}
                  daysLeft={campaign.daysLeft}
                  donorCount={campaign.donorCount}
                  creatorName={campaign.creatorName}
                  verified={campaign.verified}
                  onClick={() => router.push(`/kampanjat/${campaign.slug}`)}
                  onDonate={() => router.push(`/kampanjat/${campaign.slug}`)}
                />
              ))}
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(nextPage) => updateQuery({ page: nextPage })}
              />
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
