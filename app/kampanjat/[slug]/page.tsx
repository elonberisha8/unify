"use client"

// ============================================================
// BRANCH: feat/campaign-detail
// FIGMA:
//   - Kampanja Detail -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=55-2
// NOTION: https://www.notion.so/34874891227e8164afc4f7f6568c7a81
// ============================================================

import * as React from "react"
import { useAuth } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import { CampaignCard, DonationModal, DonorList, ShareButtons } from "@/components/public"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  Progress,
  Separator,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { CalendarIcon, CheckIcon, FlagIcon, HeartIcon, MapPinIcon, UsersIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../../_lib/public-layout-config"
import { apiFetch, type Campaign } from "../../_lib/api"

type JsonRecord = Record<string, unknown>
type CampaignComment = { id: string; content: string; author?: { name: string } }

function calcDaysLeft(endsAt: string | null): number {
  if (!endsAt) return 999
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
}

function asRecords(value: unknown): JsonRecord[] {
  return Array.isArray(value)
    ? value.filter((item): item is JsonRecord => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    : []
}

function textValue(value: unknown) {
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

function money(value: number) {
  return `EUR ${Number(value || 0).toLocaleString("sq-AL")}`
}

function descriptionSections(description: string) {
  return description
    .split(/\n\n## /)
    .map((section, index) => {
      if (index === 0) return { title: "Problemi", body: section.replace(/^##\s*/, "").trim() }
      const [rawTitle, ...rest] = section.split("\n")
      return { title: rawTitle.trim(), body: rest.join("\n").trim() }
    })
    .filter((section) => section.body)
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-3xl border-border bg-white shadow-sm">
      <CardContent className="space-y-4 p-6 md:p-8">
        <h2 className="font-display text-2xl text-unify-brown">{title}</h2>
        {children}
      </CardContent>
    </Card>
  )
}

function InfoTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-unify-cream p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-bold text-unify-brown">{value}</div>
    </div>
  )
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
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params?.slug ?? ""
  const { isLoaded, isSignedIn, getToken } = useAuth()

  const [campaign, setCampaign] = React.useState<Campaign | null>(null)
  const [similar, setSimilar] = React.useState<Campaign[]>([])
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [comment, setComment] = React.useState("")
  const [comments, setComments] = React.useState<CampaignComment[]>([])
  const [liked, setLiked] = React.useState(false)
  const [messageSent, setMessageSent] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setNotFound(false)
      try {
        const data = await apiFetch<Campaign>(`/campaigns/${slug}`)
        if (cancelled) return
        setCampaign(data)
        setComments((data.comments ?? []).map((item) => ({ id: item.id, content: item.content, author: item.author })))

        try {
          const res = await apiFetch<{ campaigns: Campaign[] }>(`/campaigns?category=${encodeURIComponent(data.category)}&limit=4`)
          if (!cancelled) setSimilar((res.campaigns ?? []).filter((item) => item.id !== data.id).slice(0, 3))
        } catch {
          if (!cancelled) setSimilar([])
        }
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (slug) load()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
            <div className="space-y-6">
              <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
              <Skeleton className="h-10 w-2/3 rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <Skeleton className="h-72 w-full rounded-3xl" />
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
          <p className="text-muted-foreground">Kjo kampanje nuk ekziston ose eshte fshire.</p>
          <Button onClick={() => router.push("/kampanjat")}>Shiko kampanjat</Button>
        </div>
      </PublicLayout>
    )
  }

  const pct = Math.min(100, Math.round((campaign.currentAmount / campaign.targetAmount) * 100))
  const daysLeft = calcDaysLeft(campaign.endsAt)
  const creatorName = campaign.isAnonymous ? "Anonim" : campaign.creator.name
  const creatorAvatar = campaign.creator.image ?? ""
  const creatorUsername = campaign.creator.username ?? campaign.creator.id
  const budgetItems = asRecords(campaign.budgetItems)
  const budgetBreakdown = asRecords(campaign.budgetBreakdown)
  const faqs = asRecords(campaign.faqs)
  const docs = campaign.supportingDocs ?? []
  const milestones = campaign.milestones ?? []
  const updates = campaign.updates ?? []
  const sections = descriptionSections(campaign.description)
  const donors = (campaign.donations ?? []).map((donation) => ({
    name: donation.donor?.name ?? donation.guestName ?? "Guest",
    amount: money(donation.amount),
    avatar: donation.donor?.image ?? undefined,
    message: donation.message ?? undefined,
    date: new Date(donation.createdAt).toLocaleDateString("sq-AL"),
    anonymous: donation.isAnonymous,
  }))
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const requireLogin = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(`/kampanjat/${slug}`)}`)
  }

  async function submitComment() {
    if (!isLoaded || !campaign) return
    if (!isSignedIn) {
      requireLogin()
      return
    }
    const token = await getToken()
    const created = await apiFetch<CampaignComment>(`/campaigns/${campaign.id}/comments`, {
      method: "POST",
      token,
      body: JSON.stringify({ content: comment.trim() }),
    })
    setComments((prev) => [created, ...prev])
    setComment("")
  }

  async function startDirectMessage() {
    if (!isLoaded || !campaign) return
    if (!isSignedIn) {
      requireLogin()
      return
    }
    if (!campaign.creator.username) return
    const token = await getToken()
    await apiFetch("/messages/start", {
      method: "POST",
      token,
      body: JSON.stringify({
        username: campaign.creator.username,
        content: `Pershendetje, po ju shkruaj per kampanjen "${campaign.title}".`,
      }),
    })
    setMessageSent(true)
  }

  function toggleReaction() {
    if (!isLoaded) return
    if (!isSignedIn) {
      requireLogin()
      return
    }
    setLiked((value) => !value)
  }

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
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
              {campaign.shortDescription && <p className="text-lg text-muted-foreground">{campaign.shortDescription}</p>}
            </div>

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
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => router.push(`/profili/${creatorUsername}`)}>
                    Shiko Profilin
                  </Button>
                  {campaign.creator.username && (
                    <Button variant="secondary" onClick={startDirectMessage}>
                      {messageSent ? "Mesazhi u dergua" : "Shkruaj"}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="description">Detajet</TabsTrigger>
                <TabsTrigger value="budget">Buxheti</TabsTrigger>
                <TabsTrigger value="updates">Lajme</TabsTrigger>
                <TabsTrigger value="donors">Donatoret</TabsTrigger>
                <TabsTrigger value="comments">Komente</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <InfoTile label="Grupi qe preket" value={campaign.targetGroup || "Nuk eshte specifikuar"} />
                  <InfoTile label="Urgjenca" value={campaign.urgency ? `${campaign.urgency}/10` : campaign.isUrgent ? "Urgjente" : "Normale"} />
                  <InfoTile label="Afati" value={campaign.endsAt ? new Date(campaign.endsAt).toLocaleDateString("sq-AL") : "Pa afat"} />
                </div>

                {campaign.problemStatement && (
                  <DetailBlock title="Problemi kryesor">
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{campaign.problemStatement}</p>
                  </DetailBlock>
                )}

                <DetailBlock title="Storyja dhe plani">
                  <div className="space-y-5">
                    {sections.map((section) => (
                      <div key={section.title}>
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-unify-blue">{section.title}</h3>
                        <p className="whitespace-pre-line leading-relaxed text-unify-brown">{section.body}</p>
                      </div>
                    ))}
                  </div>
                </DetailBlock>

                {(campaign.expectedOutcome || campaign.verificationPlan || campaign.partners || campaign.videoUrl) && (
                  <DetailBlock title="Transparenca dhe rezultati">
                    <div className="grid gap-4 md:grid-cols-2">
                      {campaign.expectedOutcome && <InfoTile label="Rezultati i pritur" value={campaign.expectedOutcome} />}
                      {campaign.verificationPlan && <InfoTile label="Plani i verifikimit" value={campaign.verificationPlan} />}
                      {campaign.partners && <InfoTile label="Partneret" value={campaign.partners} />}
                      {campaign.videoUrl && (
                        <InfoTile
                          label="Video"
                          value={<a className="text-unify-blue hover:underline" href={campaign.videoUrl} target="_blank" rel="noreferrer">Hap videon</a>}
                        />
                      )}
                    </div>
                  </DetailBlock>
                )}

                {faqs.length > 0 && (
                  <DetailBlock title="Pyetje te shpeshta">
                    <div className="space-y-3">
                      {faqs.map((faq, index) => (
                        <div key={index} className="rounded-2xl border border-border p-4">
                          <p className="font-bold text-unify-brown">{textValue(faq.q) || `Pyetja ${index + 1}`}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{textValue(faq.a)}</p>
                        </div>
                      ))}
                    </div>
                  </DetailBlock>
                )}
              </TabsContent>

              <TabsContent value="budget" className="space-y-6">
                <DetailBlock title="Buxheti i kampanjes">
                  <div className="grid gap-4 md:grid-cols-3">
                    <InfoTile label="Qellimi" value={money(campaign.targetAmount)} />
                    <InfoTile label="Mbledhur" value={money(campaign.currentAmount)} />
                    <InfoTile label="Tip per platformen" value={campaign.tipPercent != null ? `${campaign.tipPercent}%` : "Nuk eshte specifikuar"} />
                  </div>

                  {budgetItems.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-unify-cream text-left text-xs uppercase tracking-wide text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3">Item</th>
                            <th className="px-4 py-3 text-right">Shuma</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {budgetItems.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 font-medium text-unify-brown">{textValue(item.label) || `Item ${index + 1}`}</td>
                              <td className="px-4 py-3 text-right text-muted-foreground">
                                {textValue(item.amount) ? money(Number(textValue(item.amount))) : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {budgetBreakdown.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-2">
                      {budgetBreakdown.map((item, index) => {
                        const pctValue = Number(textValue(item.pct)) || 0
                        return (
                          <div key={index} className="rounded-2xl bg-unify-cream p-4">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-bold text-unify-brown">{textValue(item.label) || `Ndarja ${index + 1}`}</span>
                              <span className="text-sm font-bold text-unify-blue">{pctValue}%</span>
                            </div>
                            <Progress value={pctValue} className="mt-3" />
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {milestones.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Milestones</h3>
                      {milestones.map((milestone) => (
                        <div key={milestone.id} className="flex flex-col gap-2 rounded-2xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-bold text-unify-brown">{milestone.title}</p>
                            {milestone.description && <p className="text-sm text-muted-foreground">{milestone.description}</p>}
                          </div>
                          <Badge variant={milestone.isReached ? "success" : "outline"}>{money(milestone.amount)}</Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {docs.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Dokumente mbeshtetese</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {docs.map((doc, index) => (
                          <a key={doc} href={doc} target="_blank" rel="noreferrer" className="rounded-2xl border border-border p-4 text-sm font-bold text-unify-blue hover:bg-unify-cream">
                            Dokumenti {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </DetailBlock>
              </TabsContent>

              <TabsContent value="updates" className="space-y-4">
                {updates.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">Nuk ka lajme akoma.</div>
                ) : (
                  updates.map((update) => (
                    <DetailBlock key={update.id} title={update.title}>
                      {update.image && <img src={update.image} alt="" className="max-h-72 w-full rounded-2xl object-cover" />}
                      <p className="whitespace-pre-line text-muted-foreground">{update.content}</p>
                      <p className="text-xs text-muted-foreground">{new Date(update.createdAt).toLocaleDateString("sq-AL")}</p>
                    </DetailBlock>
                  ))
                )}
              </TabsContent>

              <TabsContent value="donors">
                {donors.length === 0 ? (
                  <div className="rounded-3xl border border-border bg-white py-10 text-center text-muted-foreground">Ende nuk ka donatore.</div>
                ) : (
                  <DonorList title="Donatoret e fundit" donors={donors} />
                )}
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="rounded-2xl border border-border bg-white p-4">
                  <Textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Shkruaj nje koment (vetem te kycurit)..."
                    rows={3}
                  />
                  <div className="mt-3 flex justify-end">
                    <Button onClick={submitComment} disabled={comment.trim().length < 3}>
                      Komento
                    </Button>
                  </div>
                </div>
                {comments.length > 0 ? (
                  <div className="space-y-3">
                    {comments.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-border bg-white p-4">
                        <p className="text-sm font-bold text-unify-brown">{item.author?.name ?? "Perdorues"}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">Nuk ka komente akoma. Behu i pari!</div>
                )}
              </TabsContent>
            </Tabs>

            {similar.length > 0 && (
              <div className="border-t border-border pt-8">
                <h2 className="mb-6 font-display text-2xl text-unify-brown">Kampanja te ngjashme</h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {similar.map((item) => (
                    <CampaignCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      description={item.shortDescription ?? item.description.slice(0, 100)}
                      imageUrl={item.images[0] ?? ""}
                      category={item.category}
                      location={item.location}
                      raised={item.currentAmount}
                      goal={item.targetAmount}
                      daysLeft={calcDaysLeft(item.endsAt)}
                      donorCount={item._count.donations}
                      creatorName={item.isAnonymous ? "Anonim" : item.creator.name}
                      verified={item.creator.isVerified}
                      onClick={() => router.push(`/kampanjat/${item.slug}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-5 rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-display text-3xl text-unify-brown">{money(campaign.currentAmount)}</span>
                  <span className="text-sm text-muted-foreground">{pct}%</span>
                </div>
                <Progress value={pct} />
                <p className="mt-2 text-sm text-muted-foreground">nga {money(campaign.targetAmount)} qellimi</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-border py-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-unify-brown">
                    <UsersIcon className="h-4 w-4" />
                    <span className="font-display text-xl">{campaign._count.donations}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Donatore</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-unify-brown">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-display text-xl">{daysLeft === 999 ? "-" : daysLeft}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{daysLeft === 999 ? "Pa afat" : "Dite mbetur"}</p>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => setShowModal(true)}>
                <HeartIcon className="h-5 w-5" />
                Dhuro Tani
              </Button>
              <Button variant={liked ? "primary" : "outline"} className="w-full" onClick={toggleReaction}>
                {liked ? "E pelqyer" : "Reago / Pelqe"}
              </Button>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Ndaje kete kampanje</p>
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
        onSubmit={() => router.push("/sukses/donacion")}
      />
    </PublicLayout>
  )
}
