"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Badge, Spinner } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { SearchBar, VolunteerCard } from "@/components/public"
import { apiFetch, type VolunteerListing } from "@/app/_lib/api"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../_lib/public-layout-config"

function listingMeta(listing: VolunteerListing) {
  if (listing.subtype === "PHYSICAL_ITEM") return { hours: "Dhurim sendi", skills: [listing.category] }
  if (listing.subtype === "FUND") return { hours: listing.valueLabel ?? "Fond", skills: [listing.category] }
  return { hours: listing.valueLabel ?? "Shërbim", skills: [listing.category] }
}

export default function VullnetarePage() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [listings, setListings] = React.useState<VolunteerListing[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadListings() {
      setLoading(true)
      setError("")

      try {
        const params = new URLSearchParams({ limit: "48", sort: "newest" })
        if (query.trim()) params.set("search", query.trim())

        const response = await apiFetch<{ listings: VolunteerListing[] }>(`/volunteers?${params.toString()}`, {
          signal: controller.signal,
        })
        setListings(response.listings)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Shpalljet vullnetare nuk u ngarkuan.")
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadListings()
    return () => controller.abort()
  }, [query])

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER} mainClassName="bg-unify-cream">
      <section className="border-b border-border bg-unify-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <Badge variant="secondary" className="mb-4">
            Ndihmë Vullnetare
          </Badge>
          <h1 className="mb-4 font-display text-4xl text-unify-brown md:text-5xl">
            Mundësi vullnetare aktive
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            Gjej shpalljet që janë aprovuar nga admini dhe kërkojnë kohë, aftësi ose ndihmë praktike.
          </p>
          <SearchBar value={query} onChange={setQuery} placeholder="Kërko mundësi vullnetare..." size="lg" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="mb-2 font-display text-2xl text-unify-brown">Nuk mund t&apos;i marrim shpalljet</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="mb-2 font-display text-2xl text-unify-brown">Nuk u gjet asnjë shpallje aktive</p>
            <p className="text-muted-foreground">Shpalljet shfaqen këtu pasi admini i aprovon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => {
              const meta = listingMeta(listing)

              return (
                <VolunteerCard
                  key={listing.id}
                  title={listing.title}
                  organization={listing.isAnonymous ? "Individuale (anonim)" : listing.organization ?? listing.owner.name}
                  imageUrl={listing.images[0]}
                  category={listing.category}
                  location={listing.location}
                  hoursPerWeek={meta.hours}
                  startDate={
                    listing.applicationDeadline
                      ? new Date(listing.applicationDeadline).toLocaleDateString("sq-AL")
                      : "Menjëherë"
                  }
                  applicantCount={listing._count.applications}
                  skills={meta.skills}
                  onClick={() => {
                    router.push(`/vullnetare/${listing.id}`)
                  }}
                  onApply={() => {
                    router.push(`/vullnetare/${listing.id}`)
                  }}
                />
              )
            })}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
