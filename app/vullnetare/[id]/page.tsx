"use client"

// ============================================================
// BRANCH: feat/volunteer-detail
// FIGMA:
//   • Vullnetar — Detail → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=49-2
//   • Vullnetar — Forma Aplikimit → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=200-2
// NOTION: https://www.notion.so/34874891227e81f29f6fe850f597bd61
// ============================================================

import * as React from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import Image from "next/image"
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

export default function VolunteerDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ""
  const { isSignedIn, getToken } = useAuth()

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
    async function load() {
      setLoading(true)
      setNotFound(false)
      try {
        const data = await apiFetch<VolunteerListing>(`/volunteers/${id}`)
        setPost(data)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const currentUrl = React.useMemo(() => {
    if (typeof window === "undefined") return ""
    return window.location.href
  }, [])

  const canSubmit = applyReason.trim().length >= 50

  const onApplyClick = () => {
    if (!isSignedIn) {
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
    } catch {
      // keep dialog open so user can retry
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PublicLayout mainClassName="bg-unify-cream" navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
        <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[65%_35%]">
            <div className="space-y-6">
              <Skeleton className="aspect-[16/9] w-full rounded-[2.5rem]" />
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-[2rem]" />
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
          <p className="text-muted-foreground">Kjo shpallje nuk ekziston ose është mbyllur.</p>
          <Button onClick={() => { window.location.href = "/shpalljet" }}>Shiko shpalljet</Button>
        </div>
      </PublicLayout>
    )
  }

  const ownerName = post.isAnonymous ? "Anonim" : post.owner.name
  const conditions = post.conditions
    ? post.conditions.split(",").map((s) => s.trim()).filter(Boolean)
    : []
  const deadline = post.applicationDeadline
    ? new Date(post.applicationDeadline).toLocaleDateString("sq-AL")
    : "Menjëherë"

  return (
    <PublicLayout mainClassName="bg-unify-cream" navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-6 text-sm text-muted-foreground/70">
          Kryefaqja &gt; Shpalljet &gt;{" "}
          <span className="font-bold text-unify-brown">{post.title}</span>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="border-none bg-unify-blue px-4 py-1 text-[10px] font-bold tracking-wider text-white">
              AKTIVE
            </Badge>
            <Badge className="border-none bg-unify-blue px-4 py-1 text-[10px] font-bold tracking-wider text-white">
              {post.category.toUpperCase()}
            </Badge>
            {post.isAnonymous && (
              <Badge className="border-none bg-muted px-4 py-1 text-[10px] font-bold tracking-wider">
                ANONIM
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-unify-brown md:text-5xl">{post.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" /> {post.location}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />{" "}
              Publikuar {new Date(post.createdAt).toLocaleDateString("sq-AL")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[65%_35%] lg:items-start">
          <div className="space-y-8">
            {/* Image */}
            {post.images.length > 0 && (
              <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-sm">
                <div className="relative aspect-[16/9] w-full bg-muted">
                  <Image src={post.images[0]} alt={post.title} fill className="object-cover" />
                </div>
              </Card>
            )}

            {/* Description */}
            <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-sm">
              <CardContent className="space-y-5 p-8">
                <h2 className="text-2xl font-bold text-unify-brown">Rreth Pozitës</h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {post.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {conditions.length > 0 && (
              <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-sm">
                <CardContent className="space-y-5 p-8">
                  <h2 className="text-2xl font-bold text-unify-brown">Kërkesat</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {conditions.map((term) => (
                      <div
                        key={term}
                        className="flex items-center gap-3 rounded-2xl bg-unify-cream p-4"
                      >
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

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="rounded-[2rem] border-none py-4 shadow-sm">
              <CardContent className="space-y-8 p-6">
                <div className="flex items-center justify-around text-center">
                  <div className="flex-1 border-r border-border/20">
                    <p className="text-4xl font-bold text-unify-blue">{post._count.applications}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Aplikues
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-unify-blue">—</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Vende
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 text-unify-blue" /> Deadline: {deadline}
                  </p>
                  <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <ClockIcon className="h-4 w-4 text-unify-blue" /> Nëntipi: {post.subtype}
                  </p>
                  <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <UsersIcon className="h-4 w-4 text-unify-blue" /> Pronari: {ownerName}
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="rounded-2xl bg-unify-green/10 p-4 text-center text-sm font-bold text-unify-green">
                    ✓ Aplikimi u dërgua me sukses!
                  </div>
                ) : (
                  <Button
                    className="h-12 w-full gap-2 rounded-2xl font-bold uppercase tracking-wide"
                    onClick={onApplyClick}
                  >
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
                  Shpërndaj
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {/* Apply dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="overflow-hidden rounded-[2rem] border-none p-0 sm:max-w-[480px]">
          <div className="space-y-6 p-8">
            <DialogHeader>
              <DialogTitle>{post.title}</DialogTitle>
              <DialogDescription>
                Shkruaj pse dëshiron të aplikosh për këtë mundësi.
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label className="mb-2 block text-sm font-bold text-unify-blue">
                Arsyeja <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={applyReason}
                onChange={(e) => setApplyReason(e.target.value)}
                placeholder="Shkruaj arsyen tënde (min. 50 karaktere)..."
                rows={5}
                className="rounded-2xl"
              />
              <p className="mt-1 text-right text-[10px] font-medium text-muted-foreground">
                {applyReason.length} / 50 min
              </p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-unify-cream p-5">
              <div>
                <p className="text-sm font-bold text-unify-brown">Apliko anonimisht</p>
                <p className="text-[10px] text-muted-foreground">
                  Emri juaj nuk do të zbulohet publikisht
                </p>
              </div>
              <Switch
                checked={applyAnonymous}
                onCheckedChange={setApplyAnonymous}
                aria-label="Apliko anonim"
              />
            </div>
            <Button
              disabled={!canSubmit || submitting}
              className="h-14 w-full rounded-2xl font-bold uppercase tracking-wider"
              onClick={onSubmitApplication}
            >
              {submitting ? "Duke dërguar..." : "Dërgo aplikimin"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login prompt */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ky veprim kërkon hyrje</DialogTitle>
            <DialogDescription>
              Duhet të jesh i loguar që të aplikosh për këtë aset vullnetar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginModalOpen(false)}>
              Mbyll
            </Button>
            <Button onClick={() => { window.location.href = "/auth/login" }}>
              Hyr / Regjistrohu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share dialog */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Shpërndaje mundësinë</DialogTitle>
            <DialogDescription>
              Kopjo ose shpërndaje këtë link me komunitetin.
            </DialogDescription>
          </DialogHeader>
          <ShareButtons url={currentUrl} title={post.title} />
        </DialogContent>
      </Dialog>
    </PublicLayout>
  )
}
