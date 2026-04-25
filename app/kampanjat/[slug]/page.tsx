"use client"

// ============================================================
// BRANCH: feat/campaign-detail
// FIGMA:
//   • Kampanja — Detail → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=55-2
//   • Kampanja — Modal Donacioni → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=199-2
// NOTION: https://www.notion.so/34874891227e8164afc4f7f6568c7a81
// ============================================================

import * as React from "react"
import { useParams } from "next/navigation"
import { DonationModal, DonorList, ShareButtons, CampaignCard } from "@/components/public"
import {
  Button,
  Badge,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Textarea,
  Separator,
  Skeleton,
} from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { HeartIcon, MapPinIcon, CalendarIcon, UsersIcon, CheckIcon, FlagIcon } from "@/components/icons"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../../_lib/public-layout-config"
import { apiFetch, type Campaign } from "../../_lib/api"

function calcDaysLeft(endsAt: string | null): number {
  if (!endsAt) return 999
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = React.useState(0)

  if (images.length === 0) {
    return <div className="aspect-[4/3] w-full rounded-3xl bg-muted" />
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted">
        <img src={images[idx]} alt={title} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                i === idx ? "border-unify-blue" : "border-transparent hover:border-border"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CampaignDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug ?? ""

  const [campaign, setCampaign] = React.useState<Campaign | null>(null)
  const [similar, setSimilar] = React.useState<Campaign[]>([])
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)

  const [showModal, setShowModal] = React.useState(false)
  const [comment, setComment] = React.useState("")

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      setNotFound(false)
      try {
        const data = await apiFetch<Campaign>(`/campaigns/${slug}`)
        setCampaign(data)
        // Fetch similar campaigns (same category, different id)
        try {
          const res = await apiFetch<{ campaigns: Campaign[] } | Campaign[]>(
            `/campaigns?category=${encodeURIComponent(data.category)}&limit=4`
          )
          const all = Array.isArray(res)
            ? res
            : ((res as { campaigns?: Campaign[] }).campaigns ?? [])
          setSimilar(all.filter((c) => c.id !== data.id).slice(0, 3))
        } catch {
          setSimilar([])
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    if (slug) load()
  }, [slug])

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  if (loading) {
    return (
      <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
            <div className="space-y-6">
              <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
              <Skeleton className="h-10 w-2/3 rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (notFound || !campaign) {
    return (
      <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20">
          <p className="font-display text-3xl text-unify-brown">Kampanja nuk u gjet</p>
          <p className="text-muted-foreground">Kjo kampanjë nuk ekziston ose është fshirë.</p>
          <Button onClick={() => { window.location.href = "/kampanjat" }}>Shiko kampanjat</Button>
        </div>
      </PublicLayout>
    )
  }

  const pct = Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100))
  const daysLeft = calcDaysLeft(campaign.endsAt)
  const creatorName = campaign.isAnonymous ? "Anonim" : campaign.creator.name
  const creatorAvatar = campaign.creator.image ?? ""
  const creatorUsername = campaign.creator.username ?? campaign.creator.id

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
          {/* Left column */}
          <div className="min-w-0 space-y-8">
            <PhotoGallery images={campaign.images} title={campaign.title} />

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{campaign.category}</Badge>
                <Badge variant="secondary">{campaign.location}</Badge>
                {campaign.isUrgent && <Badge variant="destructive">URGJENTE</Badge>}
                {campaign.creator.isVerified && <Badge variant="success">VERIFIKUAR</Badge>}
              </div>
              <h1 className="font-display text-3xl text-unify-brown md:text-4xl">{campaign.title}</h1>
            </div>

            {/* Creator card */}
            <div className="flex items-center gap-4 rounded-2xl bg-unify-cream p-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={creatorAvatar} alt={creatorName} />
                <AvatarFallback>{creatorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-unify-brown">{creatorName}</p>
                  {campaign.creator.isVerified && <CheckIcon className="h-4 w-4 text-unify-blue" />}
                </div>
                <p className="text-sm text-muted-foreground">{campaign.location}</p>
              </div>
              {!campaign.isAnonymous && (
                <Button
                  variant="outline"
                  onClick={() => { window.location.href = `/profili/${creatorUsername}` }}
                >
                  Shiko Profilin
                </Button>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="description">Përshkrimi</TabsTrigger>
                <TabsTrigger value="updates">Lajme</TabsTrigger>
                <TabsTrigger value="donors">Donatorët</TabsTrigger>
                <TabsTrigger value="comments">Komente</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6">
                <div>
                  {campaign.description.split("\n\n").map((p, i) => (
                    <p key={i} className="mb-4 leading-relaxed text-unify-brown">
                      {p}
                    </p>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="updates">
                <div className="py-10 text-center text-muted-foreground">
                  Nuk ka lajme akoma.
                </div>
              </TabsContent>

              <TabsContent value="donors">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DonorList title="Donatorët e fundit" donors={[]} />
                  <DonorList title="Donatorët më të mëdhenj" donors={[]} />
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="rounded-2xl border border-border bg-white p-4">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Shkruaj një koment (vetëm të kyçurit)..."
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end">
                    <Button disabled={comment.trim().length < 3}>Komento</Button>
                  </div>
                </div>
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Nuk ka komente akoma. Bëhu i pari!
                </div>
              </TabsContent>
            </Tabs>

            {/* Similar campaigns */}
            {similar.length > 0 && (
              <div className="border-t border-border pt-8">
                <h2 className="mb-6 font-display text-2xl text-unify-brown">Kampanja të ngjashme</h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {similar.map((s) => (
                    <CampaignCard
                      key={s.id}
                      id={s.id}
                      title={s.title}
                      description={s.shortDescription ?? s.description.slice(0, 100)}
                      imageUrl={s.images[0] ?? ""}
                      category={s.category}
                      location={s.location}
                      raised={s.currentAmount}
                      goal={s.targetAmount}
                      daysLeft={calcDaysLeft(s.endsAt)}
                      donorCount={s._count.donations}
                      creatorName={s.isAnonymous ? "Anonim" : s.creator.name}
                      verified={s.creator.isVerified}
                      onClick={() => { window.location.href = `/kampanjat/${s.slug}` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sticky sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-5 rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-display text-3xl text-unify-brown">
                    €{campaign.currentAmount.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">{pct}%</span>
                </div>
                <Progress value={pct} />
                <p className="mt-2 text-sm text-muted-foreground">
                  nga €{campaign.targetAmount.toLocaleString()} qëllimi
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-border py-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-unify-brown">
                    <UsersIcon className="h-4 w-4" />
                    <span className="font-display text-xl">{campaign._count.donations}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Donatorë</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-unify-brown">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-display text-xl">
                      {daysLeft === 999 ? "∞" : daysLeft}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {daysLeft === 999 ? "Pa afat" : "Ditë mbetur"}
                  </p>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => setShowModal(true)}>
                <HeartIcon className="h-5 w-5" />
                Dhuro Tani
              </Button>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Ndaje këtë kampanjë
                </p>
                <ShareButtons url={shareUrl} title={campaign.title} />
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" /> {campaign.location}
                </span>
                <button className="inline-flex items-center gap-1 hover:text-unify-brown">
                  <FlagIcon className="h-3 w-3" /> Raporto
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <DonationModal
        open={showModal}
        onOpenChange={setShowModal}
        campaignTitle={campaign.title}
        onSubmit={() => { window.location.href = "/sukses/donacion" }}
      />
    </PublicLayout>
  )
}
