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
import { Tabs, TabsList, TabsTrigger, Pagination, Badge, Skeleton } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../_lib/public-layout-config"
import { apiFetch, type Campaign, type VolunteerListing } from "@/app/_lib/api"

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

type CampaignItem = {
  kind: "campaign"
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

const PAGE_SIZE = 9

function calcDaysLeft(endsAt: string | null): number {
  if (!endsAt) return 999
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function mapCampaign(c: Campaign): CampaignItem {
  return {
    kind: "campaign",
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

function mapVolunteer(v: VolunteerListing): VolunteerItem {
  const skills = v.conditions
    ? v.conditions
        .split(",")
        .map((s) => s.trim())
        .slice(0, 3)
    : []
  return {
    kind: "volunteer",
    id: v.id,
    title: v.title,
    organization: v.isAnonymous ? "Anonim" : v.owner.name,
    imageUrl: v.images[0] ?? "",
    category: v.category,
    location: v.location,
    hoursPerWeek: "-",
    startDate: v.applicationDeadline
      ? new Date(v.applicationDeadline).toLocaleDateString("sq-AL")
      : "Menjëherë",
    applicantCount: v._count.applications,
    skills,
  }
}

export default function ShpalljetPage() {
  const [items, setItems] = React.useState<Item[]>([])
  const [loading, setLoading] = React.useState(true)

  const [tab, setTab] = React.useState<"all" | "campaign" | "volunteer">("all")
  const [category, setCategory] = React.useState("all")
  const [location, setLocation] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [campaignRes, volunteerRes] = await Promise.all([
          apiFetch<{ campaigns: Campaign[] } | Campaign[]>("/campaigns"),
          apiFetch<{ volunteers: VolunteerListing[] } | VolunteerListing[]>("/volunteers"),
        ])
        const campaigns = Array.isArray(campaignRes)
          ? campaignRes
          : ((campaignRes as { campaigns?: Campaign[] }).campaigns ?? [])
        const volunteers = Array.isArray(volunteerRes)
          ? volunteerRes
          : ((volunteerRes as { volunteers?: VolunteerListing[] }).volunteers ?? [])
        setItems([...campaigns.map(mapCampaign), ...volunteers.map(mapVolunteer)])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = React.useMemo(() => {
    return items.filter((it) => {
      if (tab === "campaign" && it.kind !== "campaign") return false
      if (tab === "volunteer" && it.kind !== "volunteer") return false
      if (category !== "all" && it.category.toLowerCase() !== category.toLowerCase()) return false
      if (location !== "all" && it.location !== location) return false
      if (query && !it.title.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [items, tab, category, location, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [tab, category, location, query])

  const counts = React.useMemo(
    () => ({
      all: items.length,
      campaign: items.filter((i) => i.kind === "campaign").length,
      volunteer: items.filter((i) => i.kind === "volunteer").length,
    }),
    [items]
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
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-3xl" />
              ))}
            </div>
          ) : (
            <>
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
                          window.location.href = `/kampanjat/${it.slug}`
                        }}
                        onDonate={() => {
                          window.location.href = `/kampanjat/${it.slug}`
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
                        onApply={() => {
                          window.location.href = `/vullnetare/${it.id}`
                        }}
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
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
