"use client"

import * as React from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import { PublicLayout } from "@/components/layout"
import { ShareButtons } from "@/components/public"
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Spinner,
  Switch,
  Textarea,
} from "@/components/ui"
import { CalendarIcon, CheckIcon, ClockIcon, MapPinIcon, ShareIcon, UsersIcon } from "@/components/icons"
import { NAV_LINKS } from "@/app/_lib/constants"
import { apiFetch, type VolunteerListing } from "@/app/_lib/api"

const FOOTER_SECTIONS = [
  { title: "Menu", links: NAV_LINKS },
  {
    title: "Ligjore",
    links: [
      { label: "Kushtet e Perdorimit", href: "/kushtet" },
      { label: "Politika e Privatesise", href: "/privatesia" },
    ],
  },
]

function subtypeLabel(subtype: string) {
  if (subtype === "PHYSICAL_ITEM") return "Dhurim sendi"
  if (subtype === "FUND") return "Mbështetje financiare"
  return "Shërbim"
}

function formatDate(date?: string | null) {
  if (!date) return "Menjëherë"
  return new Date(date).toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" })
}

function detailsFromListing(listing: VolunteerListing) {
  const details = listing.helpDetails as Record<string, unknown> | null | undefined
  if (!details) return []
  return Object.entries(details)
    .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
    .map(([key, value]) => ({ key, value: String(value) }))
}

export default function VolunteerDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { isSignedIn } = useUser()
  const { getToken } = useAuth()
  const [listing, setListing] = React.useState<VolunteerListing | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [applyOpen, setApplyOpen] = React.useState(false)
  const [loginModalOpen, setLoginModalOpen] = React.useState(false)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)
  const [applyReason, setApplyReason] = React.useState("")
  const [applyAnonymous, setApplyAnonymous] = React.useState(false)
  const [copiedLink, setCopiedLink] = React.useState(false)
  const [submitError, setSubmitError] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    const controller = new AbortController()

    async function loadListing() {
      if (!params?.id) return
      setLoading(true)
      setError("")

      try {
        const response = await apiFetch<VolunteerListing>(`/volunteers/${params.id}`, { signal: controller.signal })
        setListing(response)
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Shpallja nuk u ngarkua.")
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadListing()
    return () => controller.abort()
  }, [params?.id])

  const currentUrl = React.useMemo(() => {
    if (typeof window === "undefined") return ""
    return window.location.href
  }, [])

  const canSubmit = applyReason.trim().length >= 10

  const onApplyClick = () => {
    if (!isSignedIn) {
      setLoginModalOpen(true)
      return
    }
    setSubmitError("")
    setApplyOpen(true)
  }

  const onSubmitApplication = async () => {
    if (!listing || !canSubmit) return
    setSubmitting(true)
    setSubmitError("")

    try {
      const token = await getToken()
      await apiFetch(`/volunteers/${listing.id}/apply`, {
        method: "POST",
        token,
        body: JSON.stringify({ reason: applyReason.trim(), anonymous: applyAnonymous }),
      })
      setApplyOpen(false)
      setApplyReason("")
      setApplyAnonymous(false)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Aplikimi nuk u dërgua.")
    } finally {
      setSubmitting(false)
    }
  }

  const openWhatsAppShare = () => {
    if (!listing) return
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${listing.title} ${currentUrl}`.trim())}`
    window.open(shareUrl, "_blank", "noopener,noreferrer")
  }

  const copyCurrentLink = async () => {
    if (!currentUrl) return
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      setCopiedLink(false)
    }
  }

  const layoutProps = {
    mainClassName: "bg-unify-cream",
    navbar: {
      links: NAV_LINKS,
      onLogin: () => router.push("/auth/login"),
      onRegister: () => router.push("/auth/register"),
      className: "bg-white",
    },
    footer: {
      className: "bg-unify-blue",
      sections: FOOTER_SECTIONS,
      socials: [
        { platform: "twitter" as const, href: "#" },
        { platform: "instagram" as const, href: "#" },
        { platform: "facebook" as const, href: "#" },
      ],
    },
  }

  if (loading) {
    return (
      <PublicLayout {...layoutProps}>
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      </PublicLayout>
    )
  }

  if (error || !listing) {
    return (
      <PublicLayout {...layoutProps}>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="mb-3 text-3xl font-bold text-unify-brown">Shpallja nuk u gjet</h1>
          <p className="mb-6 text-muted-foreground">{error || "Kjo shpallje nuk ekziston ose nuk është aprovuar ende."}</p>
          <Button onClick={() => router.push("/vullnetare")}>Kthehu te shpalljet</Button>
        </div>
      </PublicLayout>
    )
  }

  const detailItems = detailsFromListing(listing)
  const imageUrl = listing.images[0]
  const ownerName = listing.isAnonymous ? "Individuale (anonim)" : listing.organization ?? listing.owner.name

  return (
    <PublicLayout {...layoutProps}>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-6 text-sm text-muted-foreground/60">
          Kryefaqja &nbsp; &gt; &nbsp; Shpalljet &nbsp; &gt; &nbsp; <span className="font-bold text-unify-brown">{listing.title}</span>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-none bg-unify-blue px-4 py-1 text-[10px] font-bold tracking-wider text-white hover:bg-unify-blue/90">
              {subtypeLabel(listing.subtype)}
            </Badge>
            <Badge className="border-none bg-unify-blue px-4 py-1 text-[10px] font-bold tracking-wider text-white hover:bg-unify-blue/90">
              {listing.category}
            </Badge>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-unify-brown md:text-5xl">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" /> {listing.location}
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" /> Publikuar {formatDate(listing.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[65%_35%] lg:items-start">
          <div className="space-y-8">
            <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-sm">
              <div className="relative aspect-[16/9] w-full bg-muted">
                {imageUrl ? (
                  <img src={imageUrl} alt={listing.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Nuk ka foto për këtë shpallje
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-sm">
              <CardContent className="space-y-6 p-8">
                <h2 className="text-2xl font-bold text-unify-brown">Përshkrimi</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">{listing.description}</p>
              </CardContent>
            </Card>

            {detailItems.length > 0 && (
              <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-sm">
                <CardContent className="space-y-6 p-8">
                  <h2 className="text-2xl font-bold text-unify-brown">Detajet</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {detailItems.map((item) => (
                      <div key={item.key} className="rounded-2xl bg-unify-cream p-4">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{item.key}</p>
                        <p className="text-sm font-bold text-unify-brown">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {listing.conditions && (
              <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-sm">
                <CardContent className="space-y-6 p-8">
                  <h2 className="text-2xl font-bold text-unify-brown">Kushtet</h2>
                  <p className="whitespace-pre-line text-muted-foreground">{listing.conditions}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="rounded-[2rem] border-none py-4 shadow-sm">
              <CardContent className="space-y-8 p-6">
                <div className="flex items-center justify-around text-center">
                  <div className="flex-1 border-r border-border/10">
                    <p className="text-4xl font-bold text-unify-blue">{listing._count.applications}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Aplikues</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-unify-blue">1</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Shpallje</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground/80">
                    <CalendarIcon className="h-4 w-4 text-unify-blue" />
                    <span>Afati: {formatDate(listing.applicationDeadline)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground/80">
                    <ClockIcon className="h-4 w-4 text-unify-blue" />
                    <span>Lloji: {subtypeLabel(listing.subtype)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground/80">
                    <UsersIcon className="h-4 w-4 text-unify-blue" />
                    <span>{listing.valueLabel ?? listing.category}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button className="h-12 w-full gap-2 rounded-2xl bg-unify-blue font-bold uppercase tracking-wide hover:bg-unify-blue/90" onClick={onApplyClick}>
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-white">
                      <CheckIcon className="h-2 w-2" />
                    </div>
                    Apliko tani
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full gap-2 rounded-2xl border-border/20 bg-transparent font-bold uppercase tracking-wide text-unify-brown hover:bg-muted/5"
                    onClick={() => setShareModalOpen(true)}
                  >
                    <ShareIcon className="h-4 w-4" />
                    Shpërndaj
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none py-4 shadow-sm">
              <CardContent className="space-y-6 p-6">
                <h3 className="text-xl font-bold text-unify-brown">Rreth publikuesit</h3>
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-muted-foreground/50">Emri</p>
                    <p className="font-bold leading-tight text-unify-brown">{ownerName}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-muted-foreground/50">Lokacioni</p>
                    <p className="font-bold leading-tight text-unify-brown">{listing.location}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-muted-foreground/50">Statusi</p>
                    <p className="font-bold leading-tight text-unify-brown">{listing.owner.isVerified ? "I verifikuar" : "Publikues"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="overflow-hidden rounded-[2rem] border-none p-0 sm:max-w-[480px]">
          <div className="space-y-6 p-8">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-unify-blue">Apliko</p>
              <h2 className="text-2xl font-bold leading-tight text-unify-brown">{listing.title}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block text-sm font-bold text-unify-blue">
                  Pse dëshiron të aplikosh? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={applyReason}
                  onChange={(event) => setApplyReason(event.target.value)}
                  placeholder="Shkruaj arsyen tënde..."
                  rows={5}
                  className="rounded-2xl border-border/10 bg-muted/20 focus-visible:ring-unify-blue"
                />
                <p className="mt-1 text-right text-[10px] font-medium text-muted-foreground">{applyReason.length} / 10 min</p>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-unify-cream p-5">
                <div>
                  <p className="text-sm font-bold text-unify-brown">Apliko anonimisht</p>
                  <p className="text-[10px] text-muted-foreground">Emri yt nuk do të zbulohet publikisht</p>
                </div>
                <Switch checked={applyAnonymous} onCheckedChange={setApplyAnonymous} aria-label="Apliko anonim" />
              </div>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <Button
                onClick={onSubmitApplication}
                disabled={!canSubmit || submitting}
                className="h-14 w-full gap-2 rounded-2xl bg-unify-blue text-sm font-bold uppercase tracking-wider hover:bg-unify-blue/90"
              >
                {submitting ? "Duke dërguar..." : "Dërgo aplikimin"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ky veprim kërkon hyrje</DialogTitle>
            <DialogDescription>Duhet të jesh i loguar që të aplikosh për këtë shpallje.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginModalOpen(false)}>
              Mbyll
            </Button>
            <Button onClick={() => router.push(`/auth/login?redirect=/vullnetare/${listing.id}`)}>Hyr / Regjistrohu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Shpërndaje mundësinë</DialogTitle>
            <DialogDescription>Zgjidh mënyrën si dëshiron ta ndash.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <ShareButtons url={currentUrl} title={listing.title} />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={openWhatsAppShare}>
                WhatsApp
              </Button>
              <Button type="button" variant="outline" onClick={copyCurrentLink}>
                {copiedLink ? "U kopjua" : "Copy Link"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  )
}
