"use client"

// ============================================================
// /shpalljet — VETËM shpallje vullnetare
//   Tabs: Të gjitha / Send fizik / Shërbim / Para
// ============================================================

import * as React from "react"
import { SearchBar, FilterChips } from "@/components/public"
import { Pagination, Badge, Skeleton } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../_lib/public-layout-config"
import { apiFetch, type VolunteerListing } from "@/app/_lib/api"

const HELP_TYPES = [
  { label: "Të gjitha", value: "all" },
  { label: "Send fizik", value: "PHYSICAL_ITEM" },
  { label: "Shërbim", value: "SERVICE" },
  { label: "Para / Fond", value: "FUND" },
]

const CATEGORIES = [
  { label: "Të gjitha", value: "all" },
  { label: "Mjekësore", value: "Mjekësore" },
  { label: "Arsim", value: "Arsim" },
  { label: "Emergjencë", value: "Emergjencë" },
  { label: "Familje", value: "Familje" },
  { label: "Tjera", value: "Tjera" },
]

const LOCATIONS = [
  { label: "Të gjitha", value: "all" },
  { label: "Prishtinë", value: "Prishtinë" },
  { label: "Tiranë", value: "Tiranë" },
  { label: "Prizren", value: "Prizren" },
  { label: "Shkup", value: "Shkup" },
  { label: "Diasporë", value: "Diasporë" },
  { label: "Online", value: "Online" },
]

const SORT_OPTIONS = [
  { label: "Më të rejat", value: "newest" },
  { label: "Më të vjetrat", value: "oldest" },
  { label: "Deadline së shpejti", value: "deadline" },
]

const PAGE_SIZE = 12

interface VolunteerItem {
  id: string
  title: string
  description: string
  imageUrl: string
  helpType: string
  category: string
  location: string
  ownerName: string
  ownerUsername: string | null
  isAnonymous: boolean
  applicationDeadline: string | null
  createdAt: string
  applicantCount: number
  skills: string[]
}

function mapVolunteer(v: VolunteerListing): VolunteerItem {
  const skills = v.conditions
    ? v.conditions.split(",").map((s) => s.trim()).slice(0, 3)
    : []
  return {
    id: v.id,
    title: v.title,
    description: v.description?.slice(0, 140) ?? "",
    imageUrl: v.images[0] ?? "",
    helpType: v.subtype ?? "PHYSICAL_ITEM",
    category: v.category,
    location: v.location,
    ownerName: v.isAnonymous ? "Pronar Anonim" : v.owner.name,
    ownerUsername: v.isAnonymous ? null : (v.owner as { username?: string | null }).username ?? null,
    isAnonymous: v.isAnonymous,
    applicationDeadline: v.applicationDeadline,
    createdAt: v.createdAt,
    applicantCount: v._count.applications,
    skills,
  }
}

export default function ShpalljetPage() {
  const [items, setItems] = React.useState<VolunteerItem[]>([])
  const [loading, setLoading] = React.useState(true)

  const [helpType, setHelpType] = React.useState("all")
  const [category, setCategory] = React.useState("all")
  const [location, setLocation] = React.useState("all")
  const [sort, setSort] = React.useState("newest")
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await apiFetch<{ listings: VolunteerListing[] } | VolunteerListing[]>("/volunteers")
        const list = Array.isArray(res) ? res : ((res as { listings?: VolunteerListing[] }).listings ?? [])
        setItems(list.map(mapVolunteer))
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = React.useMemo(() => {
    let result = items.filter((it) => {
      if (helpType !== "all" && it.helpType !== helpType) return false
      if (category !== "all" && it.category !== category) return false
      if (location !== "all" && it.location !== location) return false
      if (query && !it.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })

    if (sort === "newest") result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    else if (sort === "oldest") result = [...result].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    else if (sort === "deadline") {
      result = [...result].sort((a, b) => {
        if (!a.applicationDeadline) return 1
        if (!b.applicationDeadline) return -1
        return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime()
      })
    }
    return result
  }, [items, helpType, category, location, sort, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => { setPage(1) }, [helpType, category, location, query, sort])

  const counts = React.useMemo(() => ({
    all: items.length,
    PHYSICAL_ITEM: items.filter((i) => i.helpType === "PHYSICAL_ITEM").length,
    SERVICE: items.filter((i) => i.helpType === "SERVICE").length,
    FUND: items.filter((i) => i.helpType === "FUND").length,
  }), [items])

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="border-b border-border bg-unify-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <div className="max-w-3xl">
            <Badge className="mb-3">Ndihmë Vullnetare</Badge>
            <h1 className="font-display text-4xl md:text-5xl text-unify-brown">Shfleto shpalljet vullnetare</h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground">
              Njerëz që ofrojnë sende fizike, shërbime ose mini-fonde monetare. Apliko për të kërkuar ose marrë ndihmë.
              Për kampanja donacionesh shko tek <a href="/kampanjat" className="text-unify-blue font-bold hover:underline">/kampanjat</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <SearchBar value={query} onChange={setQuery} placeholder="Kërko në shpalljet vullnetare..." />

          <div className="mt-5 space-y-3">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Lloji i ndihmës</p>
              <div className="flex flex-wrap gap-2">
                {HELP_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setHelpType(t.value)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium border transition ${
                      helpType === t.value
                        ? "bg-unify-blue text-white border-unify-blue"
                        : "bg-white text-gray-700 border-gray-200 hover:border-unify-blue"
                    }`}
                  >
                    {t.label}
                    {t.value !== "all" && (
                      <span className="ml-1.5 text-xs opacity-75">({counts[t.value as keyof typeof counts]})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Kategoria</p>
                <FilterChips options={CATEGORIES} value={category} onChange={setCategory} />
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Lokacioni</p>
                <FilterChips options={LOCATIONS} value={location} onChange={setLocation} />
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Rendit</p>
                <FilterChips options={SORT_OPTIONS} value={sort} onChange={setSort} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <p className="mb-4 text-sm text-muted-foreground">
            <strong className="text-gray-900">{filtered.length}</strong> shpallje për filtrin e zgjedhur
          </p>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-16 text-center">
              <p className="font-display text-xl text-unify-brown">Asnjë shpallje për këtë filtër</p>
              <p className="mt-2 text-sm text-muted-foreground">Provo një kategori tjetër ose pastro filtrat.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((item) => (
                <a key={item.id} href={`/vullnetare/${item.id}`} className="group">
                  <article className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition">
                    {item.imageUrl && (
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      </div>
                    )}
                    <div className="p-5 space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="primary" className="text-xs">
                          {HELP_TYPES.find((t) => t.value === item.helpType)?.label ?? item.helpType}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        <Badge variant="outline" className="text-xs">{item.location}</Badge>
                      </div>
                      <h3 className="font-display text-lg text-unify-brown line-clamp-2 group-hover:text-unify-blue transition">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <span className="text-gray-600">
                          {item.isAnonymous ? (
                            <span>🔒 Pronar Anonim</span>
                          ) : item.ownerUsername ? (
                            <span>nga <span className="font-bold text-unify-blue">@{item.ownerUsername}</span></span>
                          ) : (
                            <span>nga {item.ownerName}</span>
                          )}
                        </span>
                        <span className="text-gray-500">
                          {item.applicantCount} aplikues
                        </span>
                      </div>
                      {item.applicationDeadline && (
                        <p className="text-xs text-orange-700">
                          Deadline: {new Date(item.applicationDeadline).toLocaleDateString("sq-AL")}
                        </p>
                      )}
                    </div>
                  </article>
                </a>
              ))}
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
