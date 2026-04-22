"use client"

// ============================================================
// BRANCH: feat/volunteer-detail
// FIGMA:
//   • Vullnetar — Detail → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=49-2
//   • Vullnetar — Forma Aplikimit → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=200-2
// NOTION: https://www.notion.so/34874891227e81f29f6fe850f597bd61
// ============================================================
// RREGULLI: importo VETËM nga libraria — kurrë nga skedarët direkt
//   ✅ import { ... } from "@/components/ui"
//   ✅ import { ... } from "@/components/public"
//   ✅ import { ... } from "@/components/layout"
//   ❌ import { Button } from "@/components/ui/Button"  ← GABIM
// ============================================================
// Make everything exactly as shown in the Figma design above.
// Use ONLY components from @/components/* — never create new ones.
// ============================================================

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { PublicLayout } from "@/components/layout"
import { ShareButtons, BookmarkButton } from "@/components/public"
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
  Switch,
  Textarea,
} from "@/components/ui"
import { CalendarIcon, ClockIcon, UsersIcon, CheckIcon, BadgeCheckIcon } from "@/components/icons"

export default function VolunteerDetailPage() {
  const params = useParams<{ id: string }>()
  const { isSignedIn } = useUser()
  const [applyOpen, setApplyOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [applyReason, setApplyReason] = useState("")
  const [applyAnonymous, setApplyAnonymous] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const post = {
    id: params?.id ?? "1",
    title: "Vullnetarë — Spitali i Gjakovës",
    subtype: "AKTIVE",
    category: "SHËNDETËSI",
    location: "Gjakovë, Kosovë",
    ownerName: "Shoqata Drita",
    ownerAnonymous: false,
    ownerVerified: true,
    status: "AKTIVE",
    positionsOpen: 5,
    deadline: "30 Prill 2026",
    collaborationUntil: "3 muaj",
    weeklyHours: "4-6 orë/javë",
    publishedAt: "3 ditë më parë",
    applicantsCount: 12,
    description:
      "Spitali Rajonaj i Gjakovës është në kërkim të vullnetarëve të përkushtuar për të ndihmuar pacientët dhe stafin mjekësor. Kjo është një mundësi e shkëlqyer për të kontribuar në komunitetin tuaj dhe për të fituar përvojë në fushën e shëndetësisë.\n\nSi vullnetar në spitalin tonë, ju do të punoni krah për krah me stafin tonë profesional dhe do të ndihmoni në përmirësimin e cilësisë së jetës së pacientëve tanë. Kjo është një përvojë që transformon jetën dhe ju mëson vlera të rëndësishme rreth shërbimit ndaj komunitetit.",
    terms: [
      "18 vjeç",
      "Disponueshmëri fundjavë",
      "Komunikim i mirë",
      "Vullnet të ndihmosh",
    ],
    responsibilities: [
      "Asistencë në pritjen e pacientëve",
      "Ndihmë në distribuimin e ushqimit",
      "Mbështetje emocionale për pacientët",
      "Aktivitete argëtuese për fëmijët",
    ],
    organization: {
      name: "Spitali Rajonal Gjakove",
      locationFull: "Gjakove, Kosove",
      type: "Spital Publik",
      foundedYear: "1952",
    },
    imageUrl:
      "https://res.cloudinary.com/dylmfvnv3/image/upload/v1776766995/unify/campaigns/campaign-2.png",
  } as const

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

  const onSubmitApplication = () => {
    if (!canSubmit) return
    setApplyOpen(false)
    setApplyReason("")
    setApplyAnonymous(false)
  }

  const openWhatsAppShare = () => {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${post.title} ${currentUrl}`.trim())}`
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

    <PublicLayout mainClassName="bg-unify-cream">
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-6 text-sm text-muted-foreground/60">
          Kryefaqja &nbsp; &gt; &nbsp; Shpalljet &nbsp; &gt; &nbsp; <span className="font-bold text-unify-brown">{post.title}</span>
        </div>
        
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 text-white border-none px-4 py-1 text-[10px] font-bold tracking-wider">
              {post.subtype}
            </Badge>
            <Badge className="bg-unify-blue hover:bg-unify-blue/90 text-white border-none px-4 py-1 text-[10px] font-bold tracking-wider">
              {post.category}
            </Badge>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-unify-brown md:text-5xl">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70">
                <div className="flex items-center gap-1">
                  <span className="text-lg">📍</span> {post.location}
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" /> Publikuar {post.publishedAt}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[65%_35%] lg:items-start">
          <div className="space-y-8">
            <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-sm">
              <div className="aspect-[16/9] w-full bg-muted relative">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Nuk ka foto për këtë aset
                  </div>
                )}
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-2">
              <CardContent className="space-y-6 p-8">
                <h2 className="text-2xl font-bold text-unify-brown">Rreth Pozitës</h2>
                <p className="leading-relaxed text-muted-foreground text-base whitespace-pre-line">
                  {post.description}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-2">
              <CardContent className="space-y-6 p-8">
                <h2 className="text-2xl font-bold text-unify-brown">Përgjegjësitë</h2>
                <ul className="space-y-4">
                  {post.responsibilities.map((item) => (
                    <li key={item} className="flex items-center gap-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-unify-blue text-white">
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span className="text-muted-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-2">
              <CardContent className="space-y-6 p-8">
                <h2 className="text-2xl font-bold text-unify-brown">Kërkesat</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.terms.map((term) => (
                    <div key={term} className="flex items-center gap-3 p-4 rounded-2xl bg-[#eff5f2]">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#3cc08e]">
                        <CheckIcon className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground/80">{term}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="rounded-[2rem] border-none shadow-sm py-4">
              <CardContent className="space-y-8 p-6">
                <div className="flex items-center justify-around text-center">
                  <div className="flex-1 border-r border-border/10">
                    <p className="text-4xl font-bold text-unify-blue">{post.applicantsCount}</p>
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">Aplikues</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-[#3ecf8e]">{post.positionsOpen}</p>
                    <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">Vende</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground/80">
                    <CalendarIcon className="h-4 w-4 text-unify-blue" />
                    <span>Fillimi: {post.deadline}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground/80">
                    <ClockIcon className="h-4 w-4 text-unify-blue" />
                    <span>Kohëzgjatja: {post.collaborationUntil}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground/80">
                    <UsersIcon className="h-4 w-4 text-unify-blue" />
                    <span>Orët: {post.weeklyHours}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button className="w-full rounded-2xl h-12 bg-unify-blue hover:bg-unify-blue/90 font-bold uppercase tracking-wide gap-2" onClick={onApplyClick}>
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-white">
                      <CheckIcon className="h-2 w-2" />
                    </div>
                    APLIKO TANI
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-2xl h-12 border-border/20 text-unify-brown font-bold uppercase tracking-wide gap-2 bg-transparent hover:bg-muted/5 tracker-wide"
                    onClick={() => setShareModalOpen(true)}
                  >
                    <ShareButtons className="scale-75" url={currentUrl} />
                    SHPËRNDAJ
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-sm py-4">
              <CardContent className="space-y-6 p-6">
                <h3 className="text-xl font-bold text-unify-brown">Rreth Organizatës</h3>
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest leading-none mb-1">Emri</p>
                    <p className="font-bold text-unify-brown leading-tight">{post.organization.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest leading-none mb-1">Lokacioni</p>
                    <p className="font-bold text-unify-brown leading-tight">{post.organization.locationFull}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest leading-none mb-1">Lloji</p>
                    <p className="font-bold text-unify-brown leading-tight">{post.organization.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest leading-none mb-1">Viti i Themelimit</p>
                    <p className="font-bold text-unify-brown leading-tight">{post.organization.foundedYear}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Forma e aplikimit</DialogTitle>
            <DialogDescription>
              Shkruaj arsyen pse dëshiron të aplikosh (minimumi 50 karaktere).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={applyReason}
              onChange={(event) => setApplyReason(event.target.value)}
              placeholder="Përshkruaj motivimin tënd..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              {applyReason.trim().length}/50 karaktere minimale
            </p>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <p className="text-sm text-foreground">Apliko anonim</p>
              <Switch
                checked={applyAnonymous}
                onCheckedChange={setApplyAnonymous}
                aria-label="Apliko anonim"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyOpen(false)}>
              Anulo
            </Button>
            <Button onClick={onSubmitApplication} disabled={!canSubmit}>
              Dergo aplikimin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button onClick={() => (window.location.href = "/sign-in")}>Hyr / Regjistrohu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR i linkut</DialogTitle>
            <DialogDescription>Skano kodin për ta hapur këtë faqe shpejt.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-48 w-48 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                <p className="text-sm text-muted-foreground px-4">Gjenerimi i QR kodit do bëhet së shpejti nga sistemi.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQrModalOpen(false)}>
              Mbyll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Shperndaje mundesine</DialogTitle>
            <DialogDescription>Zgjidh menyren si deshiron ta ndash.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <ShareButtons url={currentUrl} title={post.title} />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button type="button" variant="outline" onClick={openWhatsAppShare}>
                WhatsApp
              </Button>
              <Button type="button" variant="outline" onClick={copyCurrentLink}>
                {copiedLink ? "U kopjua" : "Copy Link"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setQrModalOpen(true)}>
                QR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  )
}
