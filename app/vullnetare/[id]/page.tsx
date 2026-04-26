"use client"

// ============================================================
// BRANCH: feat/volunteer-detail
// FIGMA:
//   - Vullnetar Detail -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=49-2
// NOTION: https://www.notion.so/34874891227e81f29f6fe850f597bd61
// ============================================================

import * as React from "react"
import Image from "next/image"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
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
  Skeleton,
  Switch,
  Textarea,
} from "@/components/ui"
import { CalendarIcon, CheckIcon, ClockIcon, MapPinIcon, ShareIcon, UsersIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../../_lib/public-layout-config"
import { apiFetch, type VolunteerListing } from "../../_lib/api"

type JsonRecord = Record<string, unknown>

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : {}
}

function textValue(value: unknown) {
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

function kindLabel(kind?: string) {
  if (kind === "SUPPORT_REQUEST") return "Kerkese mbeshtetjeje"
  return "Kontribut vullnetar"
}

function subtypeLabel(subtype?: string) {
  if (subtype === "PHYSICAL_ITEM") return "Send fizik"
  if (subtype === "SERVICE") return "Sherbim / kohe"
  if (subtype === "FUND") return "Fond monetar"
  return subtype ?? "-"
}

function splitTerms(value: string | null) {
  return value
    ? value.split(/[\n,]/).map((term) => term.trim()).filter(Boolean)
    : []
}

function detailRows(post: VolunteerListing) {
  const details = asRecord(post.helpDetails)
  if (post.subtype === "PHYSICAL_ITEM") {
    return [
      ["Sasia", textValue(details.quantity)],
      ["Gjendja", textValue(details.condition)],
    ].filter(([, value]) => value)
  }
  if (post.subtype === "SERVICE") {
    return [
      ["Kohezgjatja", textValue(details.duration)],
      ["Disponueshmeria", textValue(details.availability)],
    ].filter(([, value]) => value)
  }
  if (post.subtype === "FUND") {
    return [
      ["Shuma maksimale", textValue(details.maxAmount) ? `EUR ${Number(textValue(details.maxAmount)).toLocaleString("sq-AL")}` : ""],
      ["Qellimi", textValue(details.purpose)],
      ["Kriteret", textValue(details.criteria)],
    ].filter(([, value]) => value)
  }
  return []
}

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = React.useState(0)
  if (images.length === 0) return <div className="aspect-[16/9] rounded-[2.5rem] bg-muted" />

  return (
    <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-sm">
      <div className="relative aspect-[16/9] w-full bg-muted">
        <Image src={images[active]} alt={title} fill className="object-cover" />
      </div>
      {images.length > 1 && (
        <CardContent className="grid grid-cols-4 gap-2 p-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-video overflow-hidden rounded-xl border-2 ${
                active === index ? "border-unify-blue" : "border-transparent"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </CardContent>
      )}
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

export default function VolunteerDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params?.id ?? ""
  const { isSignedIn, getToken } = useAuth()
  // Auth efektive: Clerk OSE demo localStorage authToken
  const [hasLocalAuth, setHasLocalAuth] = React.useState(false)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setHasLocalAuth(Boolean(window.localStorage.getItem("authToken")))
    }
  }, [])
  const effectivelySignedIn = Boolean(isSignedIn) || hasLocalAuth

  const [post, setPost] = React.useState<VolunteerListing | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)
  const [applyOpen, setApplyOpen] = React.useState(false)
  const [loginModalOpen, setLoginModalOpen] = React.useState(false)
  const [shareModalOpen, setShareModalOpen] = React.useState(false)
  const [applyReason, setApplyReason] = React.useState("")
  const [applyAnonymous, setApplyAnonymous] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitSuccess, setSubmitSuccess] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setNotFound(false)
      try {
        const data = await apiFetch<VolunteerListing>(`/volunteers/${id}`)
        if (!cancelled) setPost(data)
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) load()
    return () => {
      cancelled = true
    }
  }, [id])

  const currentUrl = React.useMemo(() => {
    if (typeof window === "undefined") return ""
    return window.location.href
  }, [])

  // Auto-open apply form pas login (redirect query ?action=apply)
  React.useEffect(() => {
    if (effectivelySignedIn && searchParams?.get("action") === "apply" && post && !applyOpen) {
      setApplyOpen(true)
    }
  }, [effectivelySignedIn, searchParams, post, applyOpen])

  if (loading) {
    return (
      <PublicLayout mainClassName="bg-unify-cream" navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
        <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[65%_35%]">
            <div className="space-y-6">
              <Skeleton className="aspect-[16/9] w-full rounded-[2.5rem]" />
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-72 w-full rounded-[2rem]" />
          </div>
        </section>
      </PublicLayout>
    )
  }

  if (notFound || !post) {
    return (
      <PublicLayout mainClassName="bg-unify-cream" navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20">
          <p className="font-display text-3xl text-unify-brown">Shpallja nuk u gjet</p>
          <p className="text-muted-foreground">Kjo shpallje nuk ekziston ose eshte mbyllur.</p>
          <Button onClick={() => router.push("/shpalljet")}>Shiko shpalljet</Button>
        </div>
      </PublicLayout>
    )
  }

  const ownerName = post.isAnonymous ? "Anonim" : post.owner.name
  const conditions = splitTerms(post.conditions)
  const deadline = post.applicationDeadline ? new Date(post.applicationDeadline).toLocaleDateString("sq-AL") : "Menjehere"
  const details = detailRows(post)
  const canSubmit = applyReason.trim().length >= 50

  const onApplyClick = () => {
    if (!effectivelySignedIn) {
      setLoginModalOpen(true)
      return
    }
    setApplyOpen(true)
  }

  const onSubmitApplication = async () => {
    if (!canSubmit || !post) return
    setSubmitting(true)
    try {
      const token = await getToken()
      await apiFetch(`/volunteers/${post.id}/apply`, {
        method: "POST",
        token,
        body: JSON.stringify({ reason: applyReason, anonymous: applyAnonymous }),
      })
      setSubmitSuccess(true)
      setApplyOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PublicLayout mainClassName="bg-unify-cream" navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-6 text-sm text-muted-foreground/70">
          Kryefaqja &gt; Shpalljet &gt; <span className="font-bold text-unify-brown">{post.title}</span>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="border-none bg-unify-blue px-4 py-1 text-[10px] font-bold tracking-wider text-white">AKTIVE</Badge>
            <Badge variant={post.kind === "SUPPORT_REQUEST" ? "secondary" : "primary"}>{kindLabel(post.kind)}</Badge>
            <Badge variant="outline">{subtypeLabel(post.subtype)}</Badge>
            {post.isAnonymous && <Badge variant="secondary">ANONIM</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-unify-brown md:text-5xl">{post.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" /> {post.location}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" /> Publikuar {new Date(post.createdAt).toLocaleDateString("sq-AL")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[65%_35%] lg:items-start">
          <div className="space-y-8">
            <ImageGallery images={post.images} title={post.title} />

            <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-sm">
              <CardContent className="space-y-5 p-8">
                <h2 className="text-2xl font-bold text-unify-brown">Rreth shpalljes</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">{post.description}</p>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-sm">
              <CardContent className="space-y-5 p-8">
                <h2 className="text-2xl font-bold text-unify-brown">Detajet e ndihmes</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoTile label="Lloji" value={kindLabel(post.kind)} />
                  <InfoTile label="Nentipi" value={subtypeLabel(post.subtype)} />
                  <InfoTile label="Kategoria" value={post.category} />
                  <InfoTile label="Lokacioni" value={post.remote ? "Online" : post.location} />
                  {post.organization && <InfoTile label="Organizata" value={post.organization} />}
                  {post.valueLabel && <InfoTile label="Vlera / kapaciteti" value={post.valueLabel} />}
                  {details.map(([label, value]) => (
                    <InfoTile key={label} label={label} value={value} />
                  ))}
                </div>
                {post.subtype === "PHYSICAL_ITEM" && (
                  <p className="rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-800">
                    Adresa e marrjes nuk shfaqet publikisht. Ajo ndahet vetem pasi pronari pranon aplikantin.
                  </p>
                )}
              </CardContent>
            </Card>

            {conditions.length > 0 && (
              <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-sm">
                <CardContent className="space-y-5 p-8">
                  <h2 className="text-2xl font-bold text-unify-brown">Kushtet / kriteret</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {conditions.map((term) => (
                      <div key={term} className="flex items-center gap-3 rounded-2xl bg-unify-cream p-4">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-unify-blue">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        <span className="text-sm font-bold text-muted-foreground">{term}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="rounded-[2rem] border-none py-4 shadow-sm">
              <CardContent className="space-y-8 p-6">
                <div className="flex items-center justify-around text-center">
                  <div className="flex-1 border-r border-border/20">
                    <p className="text-4xl font-bold text-unify-blue">{post._count.applications}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Aplikues</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-unify-blue">{post.fulfilledAt ? "Po" : "Jo"}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Permbyllur</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 text-unify-blue" /> Deadline: {deadline}
                  </p>
                  <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <ClockIcon className="h-4 w-4 text-unify-blue" /> {subtypeLabel(post.subtype)}
                  </p>
                  <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <UsersIcon className="h-4 w-4 text-unify-blue" /> Pronari: {ownerName}
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="rounded-2xl bg-green-50 p-4 text-center text-sm font-bold text-green-700">
                    Aplikimi u dergua me sukses.
                  </div>
                ) : (
                  <Button className="h-12 w-full gap-2 rounded-2xl font-bold uppercase tracking-wide" onClick={onApplyClick}>
                    <CheckIcon className="h-4 w-4" />
                    Apliko tani
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full gap-2 rounded-2xl font-bold uppercase tracking-wide"
                  onClick={() => setShareModalOpen(true)}
                >
                  <ShareIcon className="h-4 w-4" />
                  Shperndaj
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="overflow-hidden rounded-[2rem] border-none p-0 sm:max-w-[480px]">
          <div className="space-y-6 p-8">
            <DialogHeader>
              <DialogTitle>{post.title}</DialogTitle>
              <DialogDescription>Shkruaj pse deshiron te aplikosh per kete mundesi.</DialogDescription>
            </DialogHeader>
            <div>
              <Label className="mb-2 block text-sm font-bold text-unify-blue">
                Arsyeja <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={applyReason}
                onChange={(event) => setApplyReason(event.target.value)}
                placeholder="Shkruaj arsyen tende (min. 50 karaktere)..."
                rows={5}
                className="rounded-2xl"
              />
              <p className="mt-1 text-right text-[10px] font-medium text-muted-foreground">{applyReason.length} / 50 min</p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-unify-cream p-5">
              <div>
                <p className="text-sm font-bold text-unify-brown">Apliko anonimisht</p>
                <p className="text-[10px] text-muted-foreground">Emri yt nuk do te zbulohet publikisht.</p>
              </div>
              <Switch checked={applyAnonymous} onCheckedChange={setApplyAnonymous} aria-label="Apliko anonim" />
            </div>
            <Button disabled={!canSubmit || submitting} className="h-14 w-full rounded-2xl font-bold uppercase tracking-wider" onClick={onSubmitApplication}>
              {submitting ? "Duke derguar..." : "Dergo aplikimin"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ky veprim kerkon hyrje</DialogTitle>
            <DialogDescription>Duhet te jesh i loguar qe te aplikosh per kete shpallje.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginModalOpen(false)}>Mbyll</Button>
            <Button onClick={() => {
              const here = `/vullnetare/${params.id}?action=apply`
              router.push(`/auth/login?redirect=${encodeURIComponent(here)}`)
            }}>Hyr / Regjistrohu</Button>
            <Button variant="outline" onClick={() => {
              const here = `/vullnetare/${params.id}?action=apply`
              router.push(`/auth/register?redirect=${encodeURIComponent(here)}`)
            }}>Regjistrohu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Shperndaje mundesine</DialogTitle>
            <DialogDescription>Kopjo ose shperndaje kete link me komunitetin.</DialogDescription>
          </DialogHeader>
          <ShareButtons url={currentUrl} title={post.title} />
        </DialogContent>
      </Dialog>
    </PublicLayout>
  )
}
