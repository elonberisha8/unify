"use client"

// ============================================================
// BRANCH: feat/listings
// /shpalljet - listimi i vetem per kontribute vullnetare dhe kerkesa mbeshtetjeje.
// ============================================================

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchBar, FilterChips } from "@/components/public"
import { Pagination, Badge, Button, Skeleton } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../_lib/public-layout-config"
import { apiFetch, type VolunteerListing } from "@/app/_lib/api"

const KIND_OPTIONS = [
  { label: "Te gjitha", value: "all" },
  { label: "Vullnetare (ofrojne)", value: "VOLUNTEER_CONTRIBUTION" },
  { label: "Kerkesa mbeshtetjeje", value: "SUPPORT_REQUEST" },
]

const HELP_TYPES = [
  { label: "Te gjitha", value: "all" },
  { label: "Send fizik", value: "PHYSICAL_ITEM" },
  { label: "Sherbim", value: "SERVICE" },
  { label: "Para / Fond", value: "FUND" },
]

const CATEGORIES = [
  { label: "Te gjitha", value: "all" },
  { label: "Mjekesore", value: "Mjekësore" },
  { label: "Ndihme mjekesore", value: "Ndihmë mjekësore" },
  { label: "Arsim", value: "Arsim" },
  { label: "Emergjence", value: "Emergjencë" },
  { label: "Familje", value: "Familje" },
  { label: "Biznes i vogel", value: "Biznes i vogël" },
  { label: "Rroba", value: "Rroba" },
  { label: "Pajisje elektronike", value: "Pajisje elektronike" },
  { label: "Mobilie", value: "Mobilie" },
  { label: "Libra", value: "Libra" },
  { label: "Ushqim", value: "Ushqim" },
  { label: "Lojera", value: "Lojëra" },
  { label: "Mesimdhenie", value: "Mësimdhënie" },
  { label: "Riparim", value: "Riparim" },
  { label: "Transport", value: "Transport" },
  { label: "Perkthim", value: "Përkthim" },
  { label: "IT", value: "IT" },
  { label: "Konsulence", value: "Konsulencë" },
  { label: "Tjera", value: "Tjera" },
]

const LOCATIONS = [
  { label: "Te gjitha", value: "all" },
  { label: "Prishtine", value: "Prishtine" },
  { label: "Tirane", value: "Tirane" },
  { label: "Prizren", value: "Prizren" },
  { label: "Shkup", value: "Shkup" },
  { label: "Diaspore", value: "Diaspore" },
  { label: "Online", value: "Online" },
]

const SORT_OPTIONS = [
  { label: "Me te rejat", value: "newest" },
  { label: "Me te vjetrat", value: "oldest" },
  { label: "Deadline se shpejti", value: "deadline" },
]

const PAGE_SIZE = 12
const KIND_VALUES = KIND_OPTIONS.map((item) => item.value)
const HELP_VALUES = HELP_TYPES.map((item) => item.value)
const CATEGORY_VALUES = CATEGORIES.map((item) => item.value)
const LOCATION_VALUES = LOCATIONS.map((item) => item.value)
const SORT_VALUES = SORT_OPTIONS.map((item) => item.value)

interface VolunteerItem {
  id: string
  title: string
  description: string
  imageUrl: string
  helpType: string
  category: string
  location: string
  kind: "VOLUNTEER_CONTRIBUTION" | "SUPPORT_REQUEST"
  ownerName: string
  ownerUsername: string | null
  isAnonymous: boolean
  applicationDeadline: string | null
  createdAt: string
  applicantCount: number
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

function mapVolunteer(v: VolunteerListing): VolunteerItem {
  return {
    id: v.id,
    title: v.title,
    description: v.description?.slice(0, 140) ?? "",
    imageUrl: v.images[0] ?? "",
    helpType: v.subtype ?? "PHYSICAL_ITEM",
    kind: v.kind ?? "VOLUNTEER_CONTRIBUTION",
    category: v.category,
    location: v.location,
    ownerName: v.isAnonymous ? "Pronar Anonim" : v.owner.name,
    ownerUsername: v.isAnonymous ? null : (v.owner as { username?: string | null }).username ?? null,
    isAnonymous: v.isAnonymous,
    applicationDeadline: v.applicationDeadline,
    createdAt: v.createdAt,
    applicantCount: v._count.applications,
  }
}

export default function ShpalljetPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const kind = normalizeValue(searchParams.get("kind"), KIND_VALUES, "all")
  const subtype = normalizeValue(searchParams.get("subtype"), HELP_VALUES, "all")
  const category = normalizeValue(searchParams.get("category"), CATEGORY_VALUES, "all")
  const location = normalizeValue(searchParams.get("location"), LOCATION_VALUES, "all")
  const sort = normalizeValue(searchParams.get("sort"), SORT_VALUES, "newest")
  const query = (searchParams.get("search") ?? "").trim()
  const page = normalizePage(searchParams.get("page"))

  const [items, setItems] = React.useState<VolunteerItem[]>([])
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
        if (kind !== "all") params.set("kind", kind)
        if (subtype !== "all") params.set("subtype", subtype)
        if (category !== "all") params.set("category", category)
        if (location !== "all") params.set("location", location)
        if (query) params.set("search", query)

        const res = await apiFetch<{ listings: VolunteerListing[]; total: number }>(
          `/volunteers?${params.toString()}`
        )

        if (!cancelled) {
          setItems(res.listings.map(mapVolunteer))
          setTotal(res.total)
        }
      } catch {
        if (!cancelled) {
          setItems([])
          setTotal(0)
          setError("Nuk arritem t'i marrim shpalljet nga databaza.")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [category, kind, location, page, query, sort, subtype])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const hasFilters =
    kind !== "all" || subtype !== "all" || category !== "all" || location !== "all" || sort !== "newest" || query.length > 0
  const clearFilters = () => router.replace(pathname, { scroll: false })

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="border-b border-border bg-unify-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <div className="max-w-3xl">
            <Badge className="mb-3">Shpallje Vullnetare dhe Kerkesa Mbeshtetjeje</Badge>
            <h1 className="font-display text-4xl text-unify-brown md:text-5xl">Shfleto shpalljet</h1>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">
              Te gjitha shpalljet ne nje vend: ata qe ofrojne ndihme dhe ata qe kerkojne mbeshtetje.
              Per kampanja financiare shko tek{" "}
              <a href="/kampanjat" className="font-bold text-unify-blue hover:underline">
                kampanjat
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <SearchBar value={queryDraft} onChange={setQueryDraft} placeholder="Kerko ne shpalljet..." />

          <div className="mt-5 space-y-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Lloji i shpalljes</p>
              <FilterChips
                options={KIND_OPTIONS}
                value={kind}
                onChange={(value) => updateQuery({ kind: value, page: null })}
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Lloji i ndihmes</p>
              <FilterChips
                options={HELP_TYPES}
                value={subtype}
                onChange={(value) => updateQuery({ subtype: value, page: null })}
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Kategoria</p>
              <FilterChips
                options={CATEGORIES}
                value={category}
                onChange={(value) => updateQuery({ category: value, page: null })}
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Lokacioni</p>
              <FilterChips
                options={LOCATIONS}
                value={location}
                onChange={(value) => updateQuery({ location: value, page: null })}
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Rendit</p>
              <FilterChips
                options={SORT_OPTIONS}
                value={sort}
                onChange={(value) => updateQuery({ sort: value, page: null })}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <strong className="text-gray-900">{total}</strong> shpallje per filtrin e zgjedhur
            </p>
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Pastro filtrat
              </Button>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-border bg-white p-12 text-center">
              <p className="mb-2 font-display text-xl text-unify-brown">Dicka shkoi keq</p>
              <p className="mb-6 text-sm text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()}>Provo perseri</Button>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-16 text-center">
              <p className="font-display text-xl text-unify-brown">Asnje shpallje per kete filter</p>
              <p className="mt-2 text-sm text-muted-foreground">Provo nje kategori tjeter ose pastro filtrat.</p>
              {hasFilters && (
                <Button variant="outline" className="mt-6" onClick={clearFilters}>
                  Pastro filtrat
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <a key={item.id} href={`/vullnetare/${item.id}`} className="group">
                  <article className="overflow-hidden rounded-2xl border border-border bg-white transition hover:shadow-lg">
                    {item.imageUrl && (
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="space-y-3 p-5">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant={item.kind === "SUPPORT_REQUEST" ? "secondary" : "primary"} className="text-xs">
                          {labelFor(KIND_OPTIONS, item.kind)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {labelFor(HELP_TYPES, item.helpType)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <h3 className="line-clamp-2 font-display text-lg text-unify-brown transition group-hover:text-unify-blue">
                        {item.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs">
                        <span className="text-gray-600">
                          {item.isAnonymous ? (
                            <span>Pronar anonim</span>
                          ) : item.ownerUsername ? (
                            <span>
                              nga <span className="font-bold text-unify-blue">@{item.ownerUsername}</span>
                            </span>
                          ) : (
                            <span>nga {item.ownerName}</span>
                          )}
                        </span>
                        <span className="text-gray-500">{item.applicantCount} aplikues</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.location}</span>
                        {item.applicationDeadline && (
                          <span className="text-orange-700">
                            Deadline: {new Date(item.applicationDeadline).toLocaleDateString("sq-AL")}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </a>
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
