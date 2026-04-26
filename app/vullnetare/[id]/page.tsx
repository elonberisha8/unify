"use client"

// ============================================================
// BRANCH: feat/volunteer-detail
// FIGMA:
//   • Vullnetar — Detail → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=49-2
//   • Vullnetar — Forma Aplikimit → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=200-2
// NOTION: https://www.notion.so/34874891227e81f29f6fe850f597bd61
// ============================================================

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
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
  Switch,
  Textarea,
} from "@/components/ui"
import { CalendarIcon, CheckIcon, ClockIcon, MapPinIcon, ShareIcon, UsersIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../../_lib/public-layout-config"

const VOLUNTEER_DETAILS = {
  "1": {
    title: "Vullnetarë — Spitali i Gjakovës",
    category: "SHËNDETËSI",
    location: "Gjakovë, Kosovë",
    organization: "Spitali Rajonal Gjakove",
    weeklyHours: "4-6 orë/javë",
    deadline: "30 Prill 2026",
    applicantsCount: 12,
    imageUrl: "https://res.cloudinary.com/dylmfvnv3/image/upload/v1776766995/unify/campaigns/campaign-2.png",
    description:
      "Spitali Rajonal i Gjakovës kërkon vullnetarë të përkushtuar për të ndihmuar pacientët dhe stafin mjekësor.",
    terms: ["18 vjeç", "Disponueshmëri fundjavë", "Komunikim i mirë", "Vullnet për të ndihmuar"],
  },
  v1: {
    title: "Mësues vullnetar matematike për 6 fëmijë",
    category: "ARSIM",
    location: "Tiranë, Shqipëri",
    organization: "Shkolla 7 Shtatori",
    weeklyHours: "4h/javë",
    deadline: "1 Maj 2026",
    applicantsCount: 12,
    imageUrl: "https://res.cloudinary.com/dylmfvnv3/image/upload/v1776766995/unify/campaigns/campaign-2.png",
    description:
      "Shkolla kërkon një vullnetar që mund të ndihmojë 6 fëmijë me matematikë bazike dhe përgatitje pas mësimit.",
    terms: ["Matematikë", "Mësimdhënie", "Durim me fëmijë", "2 ditë në javë"],
  },
  v2: {
    title: "Dhurim rrobash dimërore",
    category: "KOMUNITET",
    location: "Shkup, Maqedoni e Veriut",
    organization: "Individuale (anonim)",
    weeklyHours: "Një herë",
    deadline: "Menjëherë",
    applicantsCount: 34,
    imageUrl: "https://res.cloudinary.com/dylmfvnv3/image/upload/v1776766995/unify/campaigns/campaign-2.png",
    description:
      "Kërkohet koordinim për dhurimin dhe shpërndarjen e rrobave dimërore për familje që kanë nevojë.",
    terms: ["Rroba dimërore", "Koordinim", "Shpërndarje", "Kontakt me familje"],
  },
  v3: {
    title: "Transport për të moshuarit te mjeku",
    category: "KOMUNITET",
    location: "Prishtinë, Kosovë",
    organization: "Drita e Shpresës",
    weeklyHours: "6h/javë",
    deadline: "Menjëherë",
    applicantsCount: 8,
    imageUrl: "https://res.cloudinary.com/dylmfvnv3/image/upload/v1776766995/unify/campaigns/campaign-2.png",
    description:
      "Kërkohen persona me patentë shoferi dhe makinë për transport të sigurt të të moshuarve drejt kontrollave mjekësore.",
    terms: ["Patentë shoferi", "Makinë", "Përpikëri", "Komunikim i kujdesshëm"],
  },
  v4: {
    title: "Riparim laptopësh për studentë",
    category: "ARSIM",
    location: "Prishtinë, Kosovë",
    organization: "TechHelp KS",
    weeklyHours: "2h/javë",
    deadline: "15 Maj 2026",
    applicantsCount: 19,
    imageUrl: "https://res.cloudinary.com/dylmfvnv3/image/upload/v1776766995/unify/campaigns/campaign-2.png",
    description:
      "TechHelp KS kërkon vullnetarë IT për riparime bazike laptopësh që do t'u dhurohen studentëve.",
    terms: ["IT", "Hardware", "Diagnostikim bazik", "Punë ekipore"],
  },
  v5: {
    title: "Kurs falas kompjuteri për të moshuarit",
    category: "ARSIM",
    location: "Tiranë, Shqipëri",
    organization: "Qendra e Komunitetit",
    weeklyHours: "3h/javë",
    deadline: "1 Qershor 2026",
    applicantsCount: 6,
    imageUrl: "https://res.cloudinary.com/dylmfvnv3/image/upload/v1776766995/unify/campaigns/campaign-2.png",
    description:
      "Qendra kërkon vullnetarë për të mësuar të moshuarit si të përdorin kompjuterin, email-in dhe shërbimet bazike online.",
    terms: ["Kompjuter bazik", "Durim", "Komunikim i qartë", "3 orë në javë"],
  },
} as const

export default function VolunteerDetailPage() {
  const params = useParams<{ id: string }>()
  const [applyOpen, setApplyOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [applyReason, setApplyReason] = useState("")
  const [applyAnonymous, setApplyAnonymous] = useState(false)
  const isSignedIn = false

  const post = VOLUNTEER_DETAILS[params?.id as keyof typeof VOLUNTEER_DETAILS] ?? VOLUNTEER_DETAILS["1"]
  const currentUrl = useMemo(() => {
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

  return (
    <PublicLayout mainClassName="bg-unify-cream" navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-6 text-sm text-muted-foreground/70">
          Kryefaqja &gt; Shpalljet &gt; <span className="font-bold text-unify-brown">{post.title}</span>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="border-none bg-unify-blue px-4 py-1 text-[10px] font-bold tracking-wider text-white">
              AKTIVE
            </Badge>
            <Badge className="border-none bg-unify-blue px-4 py-1 text-[10px] font-bold tracking-wider text-white">
              {post.category}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-unify-brown md:text-5xl">{post.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" /> {post.location}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" /> Publikuar 3 ditë më parë
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[65%_35%] lg:items-start">
          <div className="space-y-8">
            <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-sm">
              <div className="relative aspect-[16/9] w-full bg-muted">
                <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-sm">
              <CardContent className="space-y-5 p-8">
                <h2 className="text-2xl font-bold text-unify-brown">Rreth Pozitës</h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {post.description} Kjo është një mundësi për të kontribuar drejtpërdrejt në komunitet dhe për të
                  ndihmuar njerëzit që kanë nevojë për kohë, kujdes dhe aftësi praktike.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-sm">
              <CardContent className="space-y-5 p-8">
                <h2 className="text-2xl font-bold text-unify-brown">Kërkesat</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {post.terms.map((term) => (
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
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="rounded-[2rem] border-none py-4 shadow-sm">
              <CardContent className="space-y-8 p-6">
                <div className="flex items-center justify-around text-center">
                  <div className="flex-1 border-r border-border/20">
                    <p className="text-4xl font-bold text-unify-blue">{post.applicantsCount}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Aplikues</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-unify-blue">5</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Vende</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 text-unify-blue" /> Fillimi: {post.deadline}
                  </p>
                  <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <ClockIcon className="h-4 w-4 text-unify-blue" /> Orët: {post.weeklyHours}
                  </p>
                  <p className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <UsersIcon className="h-4 w-4 text-unify-blue" /> Organizata: {post.organization}
                  </p>
                </div>

                <Button className="h-12 w-full gap-2 rounded-2xl font-bold uppercase tracking-wide" onClick={onApplyClick}>
                  <CheckIcon className="h-4 w-4" />
                  Apliko tani
                </Button>
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

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="overflow-hidden rounded-[2rem] border-none p-0 sm:max-w-[480px]">
          <div className="space-y-6 p-8">
            <DialogHeader>
              <DialogTitle>{post.title}</DialogTitle>
              <DialogDescription>Shkruaj pse dëshiron të aplikosh për këtë mundësi.</DialogDescription>
            </DialogHeader>
            <div>
              <Label className="mb-2 block text-sm font-bold text-unify-blue">
                Arsyeja <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={applyReason}
                onChange={(event) => setApplyReason(event.target.value)}
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
                <p className="text-[10px] text-muted-foreground">Emri juaj nuk do të zbulohet publikisht</p>
              </div>
              <Switch checked={applyAnonymous} onCheckedChange={setApplyAnonymous} aria-label="Apliko anonim" />
            </div>
            <Button disabled={!canSubmit} className="h-14 w-full rounded-2xl font-bold uppercase tracking-wider">
              Dërgo aplikimin
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ky veprim kërkon hyrje</DialogTitle>
            <DialogDescription>Duhet të jesh i loguar që të aplikosh për këtë aset vullnetar.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginModalOpen(false)}>
              Mbyll
            </Button>
            <Button onClick={() => (window.location.href = "/auth/login")}>Hyr / Regjistrohu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Shpërndaje mundësinë</DialogTitle>
            <DialogDescription>Kopjo ose shpërndaje këtë link me komunitetin.</DialogDescription>
          </DialogHeader>
          <ShareButtons url={currentUrl} title={post.title} />
        </DialogContent>
      </Dialog>
    </PublicLayout>
  )
}
