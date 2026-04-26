"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CampaignCard, SearchBar, FilterChips } from "@/components/public"
import { Pagination, Badge, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Spinner } from "@/components/ui"
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
]

const CATEGORY_LABELS: Record<string, string> = {
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

type CampaignResponse = {
  campaigns: ApiCampaign[]
  total: number
  page: number
  limit: number
}

const PAGE_SIZE = 9
type SortKey = "newest" | "urgent" | "almostDone" | "mostFunded"

function daysLeft(endsAt?: string | null) {
  if (!endsAt) return undefined
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

export default function KampanjaListPage() {
  const router = useRouter()
  const [category, setCategory] = React.useState("all")
  const [location, setLocation] = React.useState("all")
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState<SortKey>("urgent")
  const [page, setPage] = React.useState(1)
  const [data, setData] = React.useState<CampaignResponse | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    const controller = new AbortController()
    async function loadCampaigns() {
      setLoading(true)
      setError("")
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
          sort,
        })
        if (category !== "all") params.set("category", category)
        if (location !== "all") params.set("location", location)
        if (query.trim()) params.set("search", query.trim())
        const response = await apiFetch<CampaignResponse>(`/campaigns?${params.toString()}`, {
          signal: controller.signal,
        })
        setData(response)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Kampanjat nuk u ngarkuan.")
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    loadCampaigns()
    return () => controller.abort()
  }, [category, location, page, query, sort])

  React.useEffect(() => { setPage(1) }, [category, location, query, sort])

  const campaigns = data?.campaigns ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

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
            <Badge variant="primary" className="mb-4">Kampanja Donacionesh</Badge>
            <h1 className="font-display text-4xl md:text-5xl text-unify-brown mb-4">Kampanjat Aktive</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Këtu shfaqen vetëm kampanjat e aprovuara nga admini.
            </p>
            <SearchBar value={query} onChange={setQuery} placeholder="Kërko kampanjë..." size="lg" />
          </div>
        </div>
      </section>

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

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-unify-brown">{total}</span> kampanja të aprovuara
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rendit:</span>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgjente së pari</SelectItem>
                  <SelectItem value="newest">Më të rejat</SelectItem>
                  <SelectItem value="almostDone">Afër qëllimit</SelectItem>
                  <SelectItem value="mostFunded">Më të financuara</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-unify-brown mb-2">Nuk mund t’i marrim kampanjat</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-unify-brown mb-2">Nuk u gjet asnjë kampanjë aktive</p>
              <p className="text-muted-foreground">Kampanjat shfaqen këtu pasi admini i aprovon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  id={campaign.id}
                  title={campaign.title}
                  description={campaign.shortDescription ?? campaign.description}
                  imageUrl={campaign.images[0]}
                  category={campaign.isUrgent ? "URGJENTE" : CATEGORY_LABELS[campaign.category] ?? campaign.category}
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
              ))}
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
