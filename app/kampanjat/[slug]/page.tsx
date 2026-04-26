"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import { DonationModal, DonorList, ShareButtons } from "@/components/public"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Progress,
  Separator,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { BookmarkIcon, CalendarIcon, CheckIcon, FlagIcon, HeartIcon, MapPinIcon, MessageCircleIcon, UsersIcon } from "@/components/icons"
import { NAV_LINKS } from "@/app/_lib/constants"
import { apiFetch, type Campaign } from "@/app/_lib/api"
import { formatCurrency } from "@/lib/format"

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

function daysLeft(endsAt?: string | null) {
  if (!endsAt) return null
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" })
}

function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  const safeImages = images.length > 0 ? images : [""]
  const [idx, setIdx] = React.useState(0)

  React.useEffect(() => {
    setIdx(0)
  }, [title])

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted">
        {safeImages[idx] ? (
          <img src={safeImages[idx]} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Nuk ka foto për këtë kampanjë
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
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
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const { isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const [campaign, setCampaign] = React.useState<Campaign | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [showModal, setShowModal] = React.useState(false)
  const [comment, setComment] = React.useState("")
  const [bookmarked, setBookmarked] = React.useState(false)
  const [bookmarkLoading, setBookmarkLoading] = React.useState(false)
  const [showReport, setShowReport] = React.useState(false)
  const [reportReason, setReportReason] = React.useState("")
  const [reportSent, setReportSent] = React.useState(false)
  const [showDm, setShowDm] = React.useState(false)
  const [dmContent, setDmContent] = React.useState("")
  const [dmSent, setDmSent] = React.useState(false)

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadCampaign() {
      if (!params?.slug) return
      setLoading(true)
      setError("")

      try {
        const response = await apiFetch<Campaign>(`/campaigns/${params.slug}`, { signal: controller.signal })
        setCampaign(response)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Kampanja nuk u ngarkua.")
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadCampaign()
    return () => controller.abort()
  }, [params?.slug])

  // Kontrozo bookmark kur kampanja ngarkohet
  React.useEffect(() => {
    if (!campaign?.id || !isSignedIn) return
    getToken().then(token => {
      apiFetch<{ bookmarked: boolean }>(`/users/bookmark/${campaign.id}/check`, { token })
        .then(r => setBookmarked(r.bookmarked))
        .catch(() => {})
    })
  }, [campaign?.id, isSignedIn, getToken])

  async function toggleBookmark() {
    if (!isSignedIn) { router.push("/auth/login"); return }
    if (!campaign?.id) return
    setBookmarkLoading(true)
    try {
      const token = await getToken()
      const r = await apiFetch<{ bookmarked: boolean }>(`/users/bookmark/${campaign.id}`, { method: "POST", token })
      setBookmarked(r.bookmarked)
    } catch {} finally { setBookmarkLoading(false) }
  }

  async function sendReport() {
    if (!campaign?.id || !reportReason.trim()) return
    try {
      const token = await getToken()
      await apiFetch(`/campaigns/${campaign.id}/report`, { method: "POST", token, body: JSON.stringify({ reason: reportReason }) })
      setReportSent(true)
    } catch {}
  }

  async function sendDm() {
    if (!campaign?.creator?.username || !dmContent.trim()) return
    try {
      const token = await getToken()
      await apiFetch("/messages/start", { method: "POST", token, body: JSON.stringify({ username: campaign.creator.username, content: dmContent }) })
      setDmSent(true)
    } catch {}
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  if (loading) {
    return (
      <PublicLayout navbar={{ links: NAV_LINKS, onLogin: () => router.push("/auth/login"), onRegister: () => router.push("/auth/register") }}>
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      </PublicLayout>
    )
  }

  if (error || !campaign) {
    return (
      <PublicLayout navbar={{ links: NAV_LINKS, onLogin: () => router.push("/auth/login"), onRegister: () => router.push("/auth/register") }}>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="mb-3 font-display text-3xl text-unify-brown">Kampanja nuk u gjet</h1>
          <p className="mb-6 text-muted-foreground">{error || "Kjo kampanjë nuk ekziston ose nuk është aprovuar ende."}</p>
          <Button onClick={() => router.push("/kampanjat")}>Kthehu te kampanjat</Button>
        </div>
      </PublicLayout>
    )
  }

  const rawPct = Math.min(100, (campaign.currentAmount / campaign.targetAmount) * 100)
  const pct    = rawPct > 0 && rawPct < 1 ? 1 : Math.round(rawPct)
  const pctLabel = rawPct >= 1 ? `${Math.round(rawPct)}%` : rawPct > 0 ? `${rawPct.toFixed(1)}%` : "0%"
  const remainingDays = daysLeft(campaign.endsAt)
  const donorCount = campaign._count?.donations ?? campaign.donations?.length ?? 0
  const recentDonors = (campaign.donations ?? []).map((donation) => ({
    name: donation.isAnonymous ? "Anonim" : donation.donor?.name ?? donation.guestName ?? "Anonim",
    amount: formatCurrency(donation.amount),
    avatar: donation.donor?.image ?? undefined,
    anonymous: donation.isAnonymous,
    date: formatDate(donation.createdAt),
    message: donation.message ?? undefined,
  }))

  return (
    <PublicLayout
      navbar={{ links: NAV_LINKS, onLogin: () => router.push("/auth/login"), onRegister: () => router.push("/auth/register") }}
      footer={{
        tagline: "Platforma e parë për crowdfunding dhe ndihmë vullnetare.",
        sections: [
          { title: "Platforma", links: [{ label: "Si Funksionon", href: "/si-funksionon" }, { label: "Rreth Nesh", href: "/rreth-nesh" }] },
          { title: "Ligjore", links: [{ label: "Kushtet", href: "/kushtet" }, { label: "Privatësia", href: "/privatesia" }] },
          { title: "Kontakt", links: [{ label: "Na Shkruaj", href: "/kontakt" }] },
        ],
        socials: [{ platform: "facebook", href: "#" }, { platform: "instagram", href: "#" }],
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
          <div className="min-w-0 space-y-8">
            <PhotoGallery images={campaign.images} title={campaign.title} />

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{CATEGORY_LABELS[campaign.category] ?? campaign.category}</Badge>
                <Badge variant="secondary">{campaign.location}</Badge>
                {campaign.isUrgent && <Badge variant="destructive">URGJENTE</Badge>}
                {campaign.creator?.isVerified && <Badge variant="success">VERIFIKUAR</Badge>}
              </div>
              <h1 className="font-display text-3xl text-unify-brown md:text-4xl">{campaign.title}</h1>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-unify-cream p-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={campaign.creator?.image ?? undefined} alt={campaign.creator?.name ?? "Profil"} />
                <AvatarFallback>{campaign.creator?.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-unify-brown">{campaign.isAnonymous ? "Anonim" : campaign.creator?.name ?? "Përdorues"}</p>
                  {campaign.creator?.isVerified && <CheckIcon className="h-4 w-4 text-unify-blue" />}
                </div>
                <p className="text-sm text-muted-foreground">{campaign.location}</p>
              </div>
              {campaign.creator?.username && (
                <Button variant="outline" onClick={() => router.push(`/profili/${campaign.creator.username}`)}>
                  Shiko Profilin
                </Button>
              )}
            </div>

            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="description">Përshkrimi</TabsTrigger>
                <TabsTrigger value="updates">Lajme ({campaign.updates?.length ?? 0})</TabsTrigger>
                <TabsTrigger value="donors">Donatorët</TabsTrigger>
                <TabsTrigger value="comments">Komente ({campaign.comments?.length ?? 0})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6">
                <div>
                  {campaign.description.split("\n\n").map((paragraph) => (
                    <p key={paragraph} className="mb-4 leading-relaxed text-unify-brown">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {(campaign.milestones?.length ?? 0) > 0 && (
                  <div className="rounded-3xl border border-border bg-white p-6">
                    <h3 className="mb-4 font-display text-xl text-unify-brown">Fazat e kampanjës</h3>
                    <div className="space-y-4">
                      {campaign.milestones?.map((milestone, index) => (
                        <div key={milestone.id} className="flex gap-4">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${milestone.isReached ? "bg-unify-green text-white" : "bg-muted text-muted-foreground"}`}>
                            {milestone.isReached ? <CheckIcon className="h-5 w-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-bold text-unify-brown">{milestone.title}</p>
                              <span className="text-sm text-muted-foreground">{formatCurrency(milestone.amount)}</span>
                            </div>
                            {milestone.description && <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="updates" className="space-y-4">
                {campaign.updates?.length ? (
                  campaign.updates.map((update) => (
                    <div key={update.id} className="rounded-2xl border border-border bg-white p-5">
                      <p className="mb-1 text-xs text-muted-foreground">{formatDate(update.createdAt)}</p>
                      <h4 className="mb-2 font-display text-lg text-unify-brown">{update.title}</h4>
                      <p className="text-sm leading-relaxed text-unify-brown">{update.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-muted-foreground">Ende nuk ka lajme për këtë kampanjë.</p>
                )}
              </TabsContent>

              <TabsContent value="donors">
                <DonorList title="Donatorët e fundit" donors={recentDonors} />
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="rounded-2xl border border-border bg-white p-4">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Shkruaj një koment..."
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end">
                    <Button disabled={comment.trim().length < 3}>Komento</Button>
                  </div>
                </div>
                <ul className="space-y-3">
                  {campaign.comments?.map((item) => (
                    <li key={item.id} className="flex gap-3 rounded-2xl border border-border bg-white p-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.author?.image ?? undefined} alt={item.author?.name ?? "Koment"} />
                        <AvatarFallback>{item.author?.name?.charAt(0) ?? "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-unify-brown">{item.author?.name ?? "Përdorues"}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                        </div>
                        <p className="mt-1 text-sm text-unify-brown">{item.content}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-5 rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-display text-3xl text-unify-brown">{formatCurrency(campaign.currentAmount)}</span>
                  <span className="text-sm text-muted-foreground">{pctLabel}</span>
                </div>
                <Progress value={pct} />
                <p className="mt-2 text-sm text-muted-foreground">nga {formatCurrency(campaign.targetAmount)} qëllimi</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-border py-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-unify-brown">
                    <UsersIcon className="h-4 w-4" />
                    <span className="font-display text-xl">{donorCount}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Donatorë</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-unify-brown">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-display text-xl">{remainingDays ?? "-"}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Ditë mbetur</p>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => setShowModal(true)}>
                <HeartIcon className="h-5 w-5" />
                Dono Tani
              </Button>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Ndaje këtë kampanjë</p>
                <ShareButtons url={shareUrl} title={campaign.title} />
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" /> {campaign.location}
                </span>
                <button onClick={() => { if (!isSignedIn) { router.push("/auth/login"); return } setShowReport(true) }} className="inline-flex items-center gap-1 hover:text-unify-brown">
                  <FlagIcon className="h-3 w-3" /> Raporto
                </button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  disabled={bookmarkLoading}
                  onClick={toggleBookmark}
                >
                  <BookmarkIcon className={`h-4 w-4 ${bookmarked ? "fill-unify-blue text-unify-blue" : ""}`} />
                  {bookmarked ? "E Ruajtur" : "Ruaj"}
                </Button>
                {campaign.creator?.username && !campaign.isAnonymous && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => { if (!isSignedIn) { router.push("/auth/login"); return } setShowDm(true) }}
                  >
                    <MessageCircleIcon className="h-4 w-4" />
                    Mesazh
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <DonationModal
        open={showModal}
        onOpenChange={setShowModal}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
      />

      {/* Report Dialog */}
      <Dialog open={showReport} onOpenChange={(o) => { setShowReport(o); if (!o) { setReportReason(""); setReportSent(false) } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Raporto këtë kampanjë</DialogTitle></DialogHeader>
          {reportSent ? (
            <div className="py-4 text-center text-sm text-green-700 font-medium">✓ Raporti u dërgua. Faleminderit!</div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                placeholder="Përshkruaj arsyen e raportimit (p.sh. përmbajtje e rreme, mashtrim...)"
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReport(false)}>Anulo</Button>
                <Button disabled={reportReason.trim().length < 10} onClick={sendReport}>Dërgo Raportin</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DM Dialog */}
      <Dialog open={showDm} onOpenChange={(o) => { setShowDm(o); if (!o) { setDmContent(""); setDmSent(false) } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Dërgoi mesazh krijuesit</DialogTitle></DialogHeader>
          {dmSent ? (
            <div className="space-y-4 text-center py-4">
              <p className="text-sm text-green-700 font-medium">✓ Mesazhi u dërgua!</p>
              <Button onClick={() => router.push("/dashboard/inbox")}>Shiko Inbox</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Dërgoi mesazh <strong>{campaign.isAnonymous ? "Krijuesit" : campaign.creator?.name}</strong> lidhur me këtë kampanjë.</p>
              <Textarea
                value={dmContent}
                onChange={e => setDmContent(e.target.value)}
                placeholder="Shkruaj mesazhin tënd..."
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDm(false)}>Anulo</Button>
                <Button disabled={dmContent.trim().length < 3} onClick={sendDm}>Dërgo</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  )
}
