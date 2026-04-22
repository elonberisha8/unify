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
  Switch,
  Textarea,
} from "@/components/ui"

export default function VolunteerDetailPage() {
  const params = useParams<{ id: string }>()
  // Fallback auth state until ClerkProvider is mounted app-wide.
  const isSignedIn = false
  const [applyOpen, setApplyOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [applyReason, setApplyReason] = useState("")
  const [applyAnonymous, setApplyAnonymous] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const post = {
    id: params?.id ?? "1",
    title: "Koordinator/e për shpërndarjen e ushqimeve",
    subtype: "Vullnetar terreni",
    category: "Humanitare",
    location: "Prishtinë",
    ownerName: "Shoqata Drita",
    ownerAnonymous: false,
    ownerVerified: true,
    status: "AKTIVE",
    positionsOpen: 5,
    deadline: "30 Prill 2026",
    collaborationUntil: "3 muaj",
    weeklyHours: "4-6 ore/jave",
    applicantsCount: 27,
    description:
      "Kërkojmë vullnetarë të përkushtuar për koordinimin e shpërndarjes javore të pakove ushqimore për familjet në nevojë. Roli përfshin organizimin e pikave të shpërndarjes, komunikimin me ekipin e logjistikës dhe mbikëqyrjen e dorëzimeve gjatë fundjavës.",
    terms: [
      "Duhet të jesh mbi 18 vjeç.",
      "Disponueshmëri minimale: 2 ditë në javë.",
      "Aftësi komunikimi dhe pune në ekip.",
      "Përvoja në aktivitete humanitare është përparësi.",
    ],
    responsibilities: [
      "Asistencë në pikën e pranimit",
      "Ndihmë me distribuimin e ushqimit",
      "Mbështetje në evente dhe aktivitete",
      "Asistencë logjistike për terenin",
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
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Rreth Nesh", href: "/rreth-nesh" },
    { label: "Shpalljet", href: "/shpalljet" },
    { label: "Sherbimet", href: "/sherbimet" },
    { label: "Blog", href: "/blog" },
    { label: "Kontakt", href: "/kontakt" },
  ]
  const footerSections = [
    {
      title: "Menu",
      links: navLinks,
    },
    {
      title: "Ligjore",
      links: [
        { label: "Kushtet e Perdorimit", href: "/kushtet" },
        { label: "Politika e Privatesise", href: "/privatesia" },
      ],
    },
  ]
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

  return (
    <PublicLayout
      mainClassName="bg-[#f4f0e6]"
      navbar={{
        links: navLinks,
        onLogin: () => (window.location.href = "/sign-in"),
        onRegister: () => (window.location.href = "/sign-up"),
        className: "bg-[#f4f0e6]",
      }}
      footer={{
        className: "bg-[#0796e6]",
        sections: footerSections,
        socials: [
          { platform: "twitter", href: "#" },
          { platform: "instagram", href: "#" },
          { platform: "facebook", href: "#" },
        ],
      }}
    >
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-3 text-xs text-muted-foreground">
          Kryefaqja &gt; Shpalljet &gt; Vullnetare &gt; {post.title}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[65%_35%] lg:items-start">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border-border/70">
              <div className="aspect-[16/9] w-full bg-muted">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Nuk ka foto për këtë aset
                  </div>
                )}
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{post.subtype}</Badge>
                <Badge variant="secondary">{post.category}</Badge>
                <Badge variant="secondary">{post.location}</Badge>
                <Badge variant="secondary">
                  {post.ownerAnonymous
                    ? "ANONIM"
                    : post.ownerVerified
                      ? "✓ VERIFIED"
                      : "E PAVERIFIKUAR"}
                </Badge>
              </div>
              <h1 className="text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                {post.title}
              </h1>
            </div>

            <Card className="rounded-2xl">
              <CardContent className="space-y-3 p-5">
                <p className="text-sm text-muted-foreground">Pronar i asetit</p>
                <p className="text-base font-medium text-foreground">
                  {post.ownerAnonymous ? "Pronar Anonim 🌟" : post.ownerName}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="space-y-3 p-5">
                <h2 className="text-lg font-semibold text-foreground">Rreth Pozites</h2>
                <p className="leading-7 text-foreground/90">{post.description}</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="space-y-3 p-5">
                <h2 className="text-lg font-semibold text-foreground">Pergjegjesite</h2>
                <ul className="space-y-2 text-foreground/90">
                  {post.responsibilities.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[11px] font-bold text-sky-700">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="space-y-3 p-5">
                <h2 className="text-lg font-semibold text-foreground">Kerkesat</h2>
                <ul className="list-disc space-y-2 pl-5 text-foreground/90">
                  {post.terms.map((term) => (
                    <li key={term}>{term}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="rounded-2xl">
              <CardContent className="space-y-5 p-5">
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-white p-3 text-center">
                  <div className="border-r border-border">
                    <p className="text-3xl font-bold text-[#0398ed]">{post.applicantsCount}</p>
                    <p className="text-xs text-muted-foreground">Aplikues</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#35b39f]">{post.positionsOpen}</p>
                    <p className="text-xs text-muted-foreground">Vende</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-foreground/80">
                  <p>📅 Fillimi: {post.deadline}</p>
                  <p>🕘 Kohëzgjatja: {post.collaborationUntil}</p>
                  <p>👥 Orët: {post.weeklyHours}</p>
                </div>

                <Button className="w-full rounded-full" onClick={onApplyClick}>
                  APLIKO TANI
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full border-[#d8d0c2] text-[#5b3a1f]"
                  onClick={() => setShareModalOpen(true)}
                >
                  SHPERNDAJ
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="space-y-3 p-5">
                <h3 className="text-2xl font-semibold text-[#5b3a1f]">Rreth Organizates</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Emri</p>
                    <p className="font-semibold text-foreground">{post.organization.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lokacioni</p>
                    <p className="font-medium text-foreground">{post.organization.locationFull}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lloji</p>
                    <p className="font-medium text-foreground">{post.organization.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Viti i Themelimit</p>
                    <p className="font-medium text-foreground">{post.organization.foundedYear}</p>
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
          <div className="flex justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                currentUrl || "https://localhost:3000",
              )}`}
              alt="QR code per faqen e asetit"
              className="h-64 w-64 rounded-md border border-border"
            />
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
