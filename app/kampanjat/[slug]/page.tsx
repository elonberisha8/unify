"use client"

// ============================================================
// BRANCH: feat/campaign-detail
// FIGMA:
//   • Kampanja — Detail → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=55-2
//   • Kampanja — Modal Donacioni → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=199-2
// NOTION: https://www.notion.so/34874891227e8164afc4f7f6568c7a81
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { DonationModal, DonorList, ShareButtons, CampaignCard } from "@/components/public"
import {
  Button, Badge, Progress, Tabs, TabsList, TabsTrigger, TabsContent,
  Avatar, AvatarImage, AvatarFallback, Textarea, Separator,
} from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import {
  HeartIcon, MapPinIcon, CalendarIcon, UsersIcon, CheckIcon, FlagIcon,
} from "@/components/icons"
import { NAV_LINKS } from "@/app/_lib/constants"

// Mock data — in production: fetch by params.slug from API
const CAMPAIGN = {
  id: "c1",
  title: "Trajtim urgjent për Lirën (2 vjeç)",
  category: "Mjekësore",
  location: "Diaspora",
  urgent: true,
  images: [
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=1200",
    "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200",
    "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=1200",
    "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200",
  ],
  creator: {
    name: "Familja Berisha",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    verified: true,
    campaignCount: 1,
    username: "familja-berisha",
  },
  description: `Lira është 2 vjeç dhe ka nevojë urgjente për një operacion të rëndë që nuk mund të kryhet në Kosovë.

Mjekët në klinikën private në Turqi kanë konfirmuar se operacioni është i nevojshëm brenda 30 ditëve. Kostoja totale e trajtimit, duke përfshirë operacionin, ilaçet dhe rehabilitimin, është €45,000.

Familja jonë është e madhe por e varfër — nuk kemi mundësi ta përballojmë këtë shumë vetëm. Çdo euro që ju dhuroni do të përdoret ekskluzivisht për trajtimin e Lirës.

Faleminderit nga zemra për çdo kontribut.`,
  raised: 23100,
  goal: 45000,
  daysLeft: 8,
  donorCount: 512,
  milestones: [
    { label: "Konsultimet fillestare", amount: 5000, done: true, current: false },
    { label: "Operacioni kryesor", amount: 25000, done: true, current: false },
    { label: "Ilaçet & rehabilitimi", amount: 35000, done: false, current: true },
    { label: "Kontrolli pas-operativ", amount: 45000, done: false, current: false },
  ],
  updates: [
    { date: "20 Prill 2026", title: "Operacioni u krye me sukses!", body: "Dua të falënderoj çdo donator. Operacioni shkoi siç ishte planifikuar dhe Lira tani po qëndron në kujdes intensiv." },
    { date: "15 Prill 2026", title: "Udhëtimi për në Turqi", body: "U nisëm sot për Stamboll. Çdo hap na afron më shumë me shpresën." },
    { date: "10 Prill 2026", title: "Falë juve arritëm €20,000!", body: "Nuk mund ta besoj sa shumë njerëz na kanë ndihmuar. Mirënjohje e pafund." },
  ],
  topDonors: [
    { name: "Arben Krasniqi", amount: "€1,000", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
    { name: "Ylli Gashi", amount: "€500" },
    { name: "Anonim", amount: "€500", anonymous: true },
    { name: "Dritë Hoxha", amount: "€250" },
    { name: "Besart Aliu", amount: "€200" },
  ],
  recentDonors: [
    { name: "Anonim", amount: "€50", anonymous: true, date: "para 2 orëve", message: "Shëndet për Lirën!" },
    { name: "Valbona S.", amount: "€25", date: "para 3 orëve" },
    { name: "Diaspora NYC", amount: "€100", date: "para 5 orëve", message: "Nga New York me dashuri." },
    { name: "Arben K.", amount: "€30", date: "para 6 orëve" },
  ],
  comments: [
    { id: "cm1", name: "Valbona S.", date: "2 ditë më parë", body: "Zoti i dhëntë shëndet Lirës. Ju dëgjoj në lutje." },
    { id: "cm2", name: "Ylli Gashi", date: "3 ditë më parë", body: "Kam transferuar edhe unë. Ndihuni të fortë!" },
    { id: "cm3", name: "Arben Krasniqi", date: "5 ditë më parë", body: "Po ndaj kudo. Shpresoj arrihet qëllimi shpejt." },
  ],
  similar: [
    { id: "c2", title: "Rinovimi i bibliotekës", description: "Libra dhe mobilie për bibliotekën.", imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600", category: "Arsim", location: "Prizren", raised: 3200, goal: 5000, daysLeft: 25, donorCount: 87, creatorName: "Shoqata Dritë", verified: true },
    { id: "c3", title: "Strehimi për qentë", description: "Streha për qentë pa shtëpi.", imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600", category: "Kafshë", location: "Tiranë", raised: 1800, goal: 8000, daysLeft: 45, donorCount: 56, creatorName: "Anila Hoxha", verified: false },
    { id: "c7", title: "Ndihmë pas tërmetit", description: "Ushqim dhe strehim për familjet.", imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600", category: "Emergjencë", location: "Tiranë", raised: 12800, goal: 20000, daysLeft: 5, donorCount: 367, creatorName: "Kryqi i Kuq", verified: true },
  ],
}

function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = React.useState(0)
  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden bg-muted">
        <img src={images[idx]} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
              i === idx ? "border-unify-blue" : "border-transparent hover:border-border"
            }`}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CampaignDetailPage() {
  const router = useRouter()
  const [showModal, setShowModal] = React.useState(false)
  const [comment, setComment] = React.useState("")
  const pct = Math.min(100, Math.round((CAMPAIGN.raised / CAMPAIGN.goal) * 100))
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <PublicLayout
      navbar={{ links: NAV_LINKS, onLogin: () => {}, onRegister: () => {} }}
      footer={{
        tagline: "Platforma e parë për crowdfunding dhe ndihmë vullnetare.",
        sections: [
          { title: "Platforma", links: [{ label: "Si Funksionon", href: "/si-funksionon" }, { label: "Rreth Nesh", href: "/rreth-nesh" }, { label: "Blog", href: "/blog" }] },
          { title: "Ligjore", links: [{ label: "Kushtet", href: "/kushtet" }, { label: "Privatësia", href: "/privatesia" }] },
          { title: "Kontakt", links: [{ label: "Na Shkruaj", href: "/kontakt" }] },
        ],
        socials: [{ platform: "facebook", href: "#" }, { platform: "instagram", href: "#" }],
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
          {/* LEFT COLUMN */}
          <div className="space-y-8 min-w-0">
            <PhotoGallery images={CAMPAIGN.images} title={CAMPAIGN.title} />

            {/* Title + Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">{CAMPAIGN.category}</Badge>
                <Badge variant="secondary">{CAMPAIGN.location}</Badge>
                {CAMPAIGN.urgent && <Badge variant="destructive">URGJENTE</Badge>}
                {CAMPAIGN.creator.verified && <Badge variant="success">VERIFIKUAR</Badge>}
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-unify-brown">{CAMPAIGN.title}</h1>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-unify-cream">
              <Avatar className="h-14 w-14">
                <AvatarImage src={CAMPAIGN.creator.avatar} alt={CAMPAIGN.creator.name} />
                <AvatarFallback>{CAMPAIGN.creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-unify-brown">{CAMPAIGN.creator.name}</p>
                  {CAMPAIGN.creator.verified && <CheckIcon className="h-4 w-4 text-unify-blue" />}
                </div>
                <p className="text-sm text-muted-foreground">{CAMPAIGN.creator.campaignCount} kampanjë · {CAMPAIGN.location}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push(`/profili/${CAMPAIGN.creator.username}`)}
              >
                Shiko Profilin
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="description">Përshkrimi</TabsTrigger>
                <TabsTrigger value="updates">Lajme ({CAMPAIGN.updates.length})</TabsTrigger>
                <TabsTrigger value="donors">Donatorët</TabsTrigger>
                <TabsTrigger value="comments">Komente ({CAMPAIGN.comments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6">
                <div>
                  {CAMPAIGN.description.split("\n\n").map((p, i) => (
                    <p key={i} className="text-unify-brown leading-relaxed mb-4">{p}</p>
                  ))}
                </div>

                {/* Milestones */}
                <div className="rounded-3xl border border-border p-6 bg-white">
                  <h3 className="font-display text-xl text-unify-brown mb-4">Fazat e kampanjës</h3>
                  <div className="space-y-4">
                    {CAMPAIGN.milestones.map((m, i) => (
                      <div key={i} className="flex gap-4">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            m.done
                              ? "bg-unify-green text-white"
                              : m.current
                              ? "bg-unify-blue text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {m.done ? <CheckIcon className="h-5 w-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-bold text-unify-brown">{m.label}</p>
                            <span className="text-sm text-muted-foreground">€{m.amount.toLocaleString()}</span>
                          </div>
                          {m.current && <p className="text-xs text-unify-blue font-bold mt-1">Në progres</p>}
                          {m.done && <p className="text-xs text-unify-green font-bold mt-1">Arritur</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="updates" className="space-y-4">
                {CAMPAIGN.updates.map((u, i) => (
                  <div key={i} className="rounded-2xl border border-border p-5 bg-white">
                    <p className="text-xs text-muted-foreground mb-1">{u.date}</p>
                    <h4 className="font-display text-lg text-unify-brown mb-2">{u.title}</h4>
                    <p className="text-sm text-unify-brown leading-relaxed">{u.body}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="donors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DonorList title="Më të mëdhenj" donors={CAMPAIGN.topDonors} />
                  <DonorList title="Të fundit" donors={CAMPAIGN.recentDonors} />
                </div>
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <div className="rounded-2xl border border-border p-4 bg-white">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Shkruaj një koment (vetëm të kyçurit)..."
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <Button disabled={comment.trim().length < 3}>Komento</Button>
                  </div>
                </div>
                <ul className="space-y-3">
                  {CAMPAIGN.comments.map((c) => (
                    <li key={c.id} className="flex gap-3 p-4 rounded-2xl bg-white border border-border">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-unify-brown">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.date}</p>
                        </div>
                        <p className="text-sm text-unify-brown mt-1">{c.body}</p>
                        <button className="text-xs text-muted-foreground hover:text-unify-brown mt-2 inline-flex items-center gap-1">
                          <FlagIcon className="h-3 w-3" /> Raporto
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>

            {/* Similar */}
            <div className="pt-8 border-t border-border">
              <h2 className="font-display text-2xl text-unify-brown mb-6">Kampanja të ngjashme</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {CAMPAIGN.similar.map((s) => (
                  <CampaignCard
                    key={s.id}
                    id={s.id}
                    title={s.title}
                    description={s.description}
                    imageUrl={s.imageUrl}
                    category={s.category}
                    location={s.location}
                    raised={s.raised}
                    goal={s.goal}
                    daysLeft={s.daysLeft}
                    donorCount={s.donorCount}
                    creatorName={s.creatorName}
                    verified={s.verified}
                    onClick={() => router.push(`/kampanjat/${s.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Sticky donate panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-white p-6 space-y-5 shadow-sm">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-display text-3xl text-unify-brown">€{CAMPAIGN.raised.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">{pct}%</span>
                </div>
                <Progress value={pct} />
                <p className="text-sm text-muted-foreground mt-2">nga €{CAMPAIGN.goal.toLocaleString()} qëllimi</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-unify-brown">
                    <UsersIcon className="h-4 w-4" />
                    <span className="font-display text-xl">{CAMPAIGN.donorCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Donatorë</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-unify-brown">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-display text-xl">{CAMPAIGN.daysLeft}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Ditë mbetur</p>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => setShowModal(true)}>
                <HeartIcon className="h-5 w-5" />
                Dono Tani
              </Button>

              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Ndaje këtë kampanjë</p>
                <ShareButtons url={shareUrl} title={CAMPAIGN.title} />
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" /> {CAMPAIGN.location}
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
        campaignTitle={CAMPAIGN.title}
        onSubmit={() => router.push("/sukses/donacion")}
      />
    </PublicLayout>
  )
}
