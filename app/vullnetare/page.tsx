"use client"

// ============================================================
// BRANCH: feat/volunteer-detail
// FIGMA:
//   Vullnetar - Detail -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=49-2
// NOTION: https://www.notion.so/34874891227e81f29f6fe850f597bd61
// ============================================================

import * as React from "react"
import { Badge, Skeleton } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { SearchBar, VolunteerCard } from "@/components/public"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../_lib/public-layout-config"
import { apiFetch, type VolunteerListing } from "@/app/_lib/api"

function mapVolunteer(v: VolunteerListing) {
  return {
    id: v.id,
    title: v.title,
    organization: v.organization || (v.isAnonymous ? "Anonim" : v.owner.name),
    imageUrl: v.images[0] ?? "",
    category: v.category,
    location: v.location,
    hoursPerWeek: v.valueLabel || "-",
    startDate: v.applicationDeadline
      ? new Date(v.applicationDeadline).toLocaleDateString("sq-AL")
      : "Menjehere",
    applicantCount: v._count.applications,
    skills: v.conditions ? v.conditions.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3) : [],
  }
}

export default function VullnetarePage() {
  const [items, setItems] = React.useState<ReturnType<typeof mapVolunteer>[]>([])
  const [query, setQuery] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await apiFetch<{ listings: VolunteerListing[] }>("/volunteers?kind=VOLUNTEER_CONTRIBUTION")
        setItems(res.listings.map(mapVolunteer))
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = items.filter((item) =>
    `${item.title} ${item.organization} ${item.location} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER} mainClassName="bg-unify-cream">
      <section className="border-b border-border bg-unify-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <Badge variant="secondary" className="mb-4">
            Ndihme Vullnetare
          </Badge>
          <h1 className="mb-4 font-display text-4xl text-unify-brown md:text-5xl">
            Mundesi vullnetare aktive
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            Gjej organizata, familje dhe komunitete qe kerkojne kohe, aftesi ose ndihme praktike.
          </p>
          <SearchBar value={query} onChange={setQuery} placeholder="Kerko mundesi vullnetare..." size="lg" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-border bg-white p-10 text-center text-muted-foreground">
            Nuk ka shpallje vullnetare aktive ne DB per kete kerkese.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <VolunteerCard
                key={post.id}
                {...post}
                onClick={() => {
                  window.location.href = `/vullnetare/${post.id}`
                }}
                onApply={() => {
                  window.location.href = `/vullnetare/${post.id}`
                }}
              />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
