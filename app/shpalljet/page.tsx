"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CampaignCard, VolunteerCard, SearchBar, FilterChips } from "@/components/public"
import { Tabs, TabsList, TabsTrigger, Pagination, Badge, Spinner } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { NAV_LINKS } from "@/app/_lib/constants"
import { apiFetch } from "@/app/_lib/api"

const CATEGORIES = [
  { label: "Të gjitha", value: "all" },
  { label: "Mjekësore", value: "MEDICAL" },
  { label: "Arsim", value: "EDUCATION" },
  { label: "Emergjencë", value: "EMERGENCY" },
  { label: "Komunitet", value: "COMMUNITY" },
  { label: "Sport", value: "SPORTS" },
  { label: "Kafshë", value: "ANIMALS" },
  { label: "Mjedis", value: "ENVIRONMENT" },
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

const CAMPAIGN_CATEGORY_LABELS: Record<string, string> = {
  MEDICAL: "Mjekësore",
  EDUCATION: "Arsim",
  EMERGENCY: "Emergjencë",
  COMMUNITY: "Komunitet",
  SPORTS: "Sport",
  ENVIRONMENT: "Mjedis",
  ANIMALS: "Kafshë",
  TECHNOLOGY: "Teknologji",
  CREATIVE: "Kreative",
  OTHER: "Tjera",
}

type ApiCampaign = {
  id: string
  slug: string
  title: string
  description: string
  shortDescription?: string | null
  images: string[]
  category: string
  location: string
  currentAmount: number
  targetAmount: number
  endsAt?: string | null
  isUrgent: boolean
  createdAt: string
  creator?: { name: string; isVerified?: boolean }
  _count?: { donations: number }
}

type ApiVolunteer = {
  id: string
  title: string
  description: string
  subtype: "PHYSICAL_ITEM" | "SERVICE" | "FUND"
  category: string
  location: string
  organization?: string | null
  valueLabel?: string | null
  images: string[]
  isAnonymous: boolean
  applicationDeadline?: string | null
  createdAt: string
  owner?: { name: string; isVerified?: boolean }
  _count?: { applications: number }
}

type FeedItem =
  | { kind: "campaign"; createdAt: string; data: ApiCampaign }
  | { kind: "volunteer"; createdAt: string; data: ApiVolunteer }

const PAGE_SIZE = 9

function daysLeft(endsAt?: string | null) {
  if (!endsAt) return undefined
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

function volunteerMeta(listing: ApiVolunteer) {
  if (listing.subtype === "PHYSICAL_ITEM") return { hours: "Dhurim sendi", skills: [listing.category] }
  if (listing.subtype === "FUND") return { hours: listing.valueLabel ?? "Fond", skills: [listing.category] }
  return { hours: listing.valueLabel ?? "Shërbim", skills: [listing.category] }
}

export default function ShpalljetPage() {
  const router = useRouter()
  const [tab, setTab] = React.useState<"all" | "campaign" | "volunteer">("all")
  const [category, setCategory] = React.useState("all")
  const [location, setLocation] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [items, setItems] = React.useState<FeedItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError("")
      try {
        const [campaignsRes, volunteersRes] = await Promise.all([
          apiFetch<{ campaigns: ApiCampaign[] }>("/campaigns?limit=48&sort=newest", { signal: controller.signal }),
          apiFetch<{ listings: ApiVolunteer[] }>("/volunteers?limit=48&sort=newest", { signal: controller.signal }),
        ])
        const nextItems: FeedItem[] = [
          ...campaignsRes.campaigns.map((campaign) => ({ kind: "campaign" as const, createdAt: campaign.createdAt, data: campaign })),
          ...volunteersRes.listings.map((listing) => ({ kind: "volunteer" as const, createdAt: listing.createdAt, data: listing })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setItems(nextItems)
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Shpalljet nuk u ngarkuan.")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  const filtered = React.useMemo(() => {
    return items.filter((item) => {
      if (tab === "campaign" && item.kind !== "campaign") return false
      if (tab === "volunteer" && item.kind !== "volunteer") return false
      const title = item.data.title.toLowerCase()
      const description = item.data.description.toLowerCase()
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        if (!title.includes(q) && !description.includes(q)) return false
      }
      if (location !== "all" && item.data.location !== location) return false
      if (category !== "all") {
        if (item.kind === "campaign" && item.data.category !== category) return false
        if (item.kind === "volunteer") {
          const label = CAMPAIGN_CATEGORY_LABELS[category] ?? category
          if (item.data.category !== label && item.data.category !== category) return false
        }
      }
      return true
    })
  }, [category, items, location, query, tab])

  React.useEffect(() => { setPage(1) }, [tab, category, location, query])

  const counts = React.useMemo(() => ({
    all: items.length,
    campaign: items.filter((item) => item.kind === "campaign").length,
    volunteer: items.filter((item) => item.kind === "volunteer").length,
  }), [items])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <PublicLayout
      navbar={{ links: NAV_LINKS, onLogin: () => router.push("/auth/login"), onRegister: () => router.push("/auth/register"), onSearch: () => {} }}
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
      <section className="bg-unify-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">Të gjitha shpalljet</Badge>
            <h1 className="font-display text-4xl md:text-5xl text-unify-brown mb-4">Shpalljet Publike</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Këtu shfaqen vetëm kampanjat dhe shpalljet vullnetare që janë aprovuar nga admini.
            </p>
            <SearchBar value={query} onChange={setQuery} placeholder="Kërko kampanja, vullnetarë, vende..." size="lg" />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              <TabsTrigger value="all">Të Gjitha ({counts.all})</TabsTrigger>
              <TabsTrigger value="campaign">Donacione ({counts.campaign})</TabsTrigger>
              <TabsTrigger value="volunteer">Vullnetare ({counts.volunteer})</TabsTrigger>
            </TabsList>
          </Tabs>
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

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-sm text-muted-foreground mb-6">
            <span className="font-bold text-unify-brown">{filtered.length}</span> rezultate të aprovuara
          </p>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-unify-brown mb-2">Nuk mund t’i marrim shpalljet</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : pageItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-unify-brown mb-2">Nuk u gjet asgjë aktive</p>
              <p className="text-muted-foreground">Postimet shfaqen pasi admini i aprovon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((item) => {
                if (item.kind === "campaign") {
                  const campaign = item.data
                  return (
                    <CampaignCard
                      key={`campaign-${campaign.id}`}
                      id={campaign.id}
                      title={campaign.title}
                      description={campaign.shortDescription ?? campaign.description}
                      imageUrl={campaign.images[0]}
                      category={campaign.isUrgent ? "URGJENTE" : CAMPAIGN_CATEGORY_LABELS[campaign.category] ?? campaign.category}
                      location={campaign.location}
                      raised={campaign.currentAmount}
                      goal={campaign.targetAmount}
                      daysLeft={daysLeft(campaign.endsAt)}
                      donorCount={campaign._count?.donations ?? 0}
                      creatorName={campaign.creator?.name}
                      verified={campaign.creator?.isVerified}
                      onClick={() => router.push(`/kampanjat/${campaign.slug}`)}
                      onDonate={() => router.push(`/kampanjat/${campaign.slug}`)}
                    />
                  )
                }

                const listing = item.data
                const meta = volunteerMeta(listing)
                return (
                  <VolunteerCard
                    key={`volunteer-${listing.id}`}
                    title={listing.title}
                    organization={listing.isAnonymous ? "Individuale (anonim)" : listing.organization ?? listing.owner?.name}
                    imageUrl={listing.images[0]}
                    category={listing.category}
                    location={listing.location}
                    hoursPerWeek={meta.hours}
                    startDate={listing.applicationDeadline ? new Date(listing.applicationDeadline).toLocaleDateString("sq-AL") : "Menjëherë"}
                    applicantCount={listing._count?.applications ?? 0}
                    skills={meta.skills}
                    onClick={() => router.push(`/vullnetare/${listing.id}`)}
                    onApply={() => router.push(`/vullnetare/${listing.id}`)}
                  />
                )
              })}
            </div>
          )}

          {totalPages > 1 && !loading && (
            <div className="flex justify-center mt-10">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
