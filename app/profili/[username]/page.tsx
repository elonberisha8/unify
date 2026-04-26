"use client"
import { useRouter } from "next/navigation"

// ============================================================
// BRANCH: feat/dashboard-profile
// FIGMA:
//   • Profili Publik → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=177-2
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { PublicProfileHero } from "@/components/dashboard"
import { CampaignCard, ShareButtons } from "@/components/public"
import { Breadcrumbs, PublicLayout } from "@/components/layout"
import { Badge, Button, Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui"
import { BadgeCheckIcon, CalendarIcon, HeartIcon, MapPinIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../../_lib/public-layout-config"

const PROFILE = {
  name: "Familja Berisha",
  username: "familja-berisha",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  cover:
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80",
  location: "Diaspora · Zürich",
  joined: "Prill 2026",
  bio:
    "Jemi një familje shqiptare që përdor Unify për të kërkuar ndihmë në raste mjekësore urgjente dhe për të ndarë përditësime të qarta me komunitetin tonë.",
  verified: true,
  stats: [
    { label: "Kampanja", value: "2" },
    { label: "Donatorë", value: "642" },
    { label: "Të mbledhura", value: "€31.4K" },
  ],
  story: [
    "Për ne, transparenca nuk është thjesht një fjalë. Është mënyra si i respektojmë njerëzit që zgjedhin të ndihmojnë.",
    "Në çdo përditësim publik mundohemi të tregojmë qartë ku shkojnë fondet, çfarë hapash janë kryer dhe çfarë nevojitet më tej.",
  ],
}

const CAMPAIGNS = [
  {
    id: "c1",
    title: "Trajtim urgjent për Lirën (2 vjeç)",
    description: "Operacion dhe rehabilitim pas ndërhyrjes kryesore në Turqi.",
    imageUrl:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1000&q=80",
    category: "Mjekësore",
    location: "Diaspora",
    raised: 23100,
    goal: 45000,
    daysLeft: 8,
    donorCount: 512,
    creatorName: "Familja Berisha",
    verified: true,
  },
  {
    id: "c11",
    title: "Rehabilitim dhe terapi pas operacionit",
    description: "Mbështetje për fazën pas-operatore dhe terapitë e rikuperimit.",
    imageUrl:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1000&q=80",
    category: "Shëndetësi",
    location: "Prishtinë",
    raised: 8300,
    goal: 12000,
    daysLeft: 19,
    donorCount: 130,
    creatorName: "Familja Berisha",
    verified: true,
  },
]

const ACTIVITY = [
  {
    title: "Përditësim i kampanjës",
    date: "24 Prill 2026",
    body: "Lira po reagon mirë pas operacionit dhe jemi në fazën e parë të rehabilitimit.",
  },
  {
    title: "Milestone u arrit",
    date: "20 Prill 2026",
    body: "Kaluam pragun e €20,000 falë 500+ donatorëve nga diaspora dhe Kosova.",
  },
  {
    title: "Kampanja u publikua",
    date: "12 Prill 2026",
    body: "Publikuam historinë, dokumentet bazë dhe planin e trajtimit që në fillim.",
  },
]

export default function PublicProfilPage() {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const username = params?.username ?? PROFILE.username
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER} mainClassName="bg-unify-cream/40">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <Breadcrumbs
          items={[
            { label: "Kryefaqja", href: "/" },
            { label: "Profili publik", href: `/profili/${username}` },
            { label: PROFILE.name },
          ]}
          className="mb-6"
        />

        <PublicProfileHero
          name={PROFILE.name}
          avatar={PROFILE.avatar}
          cover={PROFILE.cover}
          location={PROFILE.location}
          joined={PROFILE.joined}
          bio={PROFILE.bio}
          verified={PROFILE.verified}
          stats={PROFILE.stats}
          primaryAction={{ label: "Shiko kampanjat", onClick: () => router.push("/kampanjat") }}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <Tabs defaultValue="campaigns">
              <TabsList>
                <TabsTrigger value="campaigns">Kampanjat</TabsTrigger>
                <TabsTrigger value="about">Rreth profilit</TabsTrigger>
                <TabsTrigger value="activity">Aktiviteti</TabsTrigger>
              </TabsList>

              <TabsContent value="campaigns" className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-unify-brown">Kampanjat publike</h2>
                    <p className="text-sm text-muted-foreground">
                      Kauza që ky profil i ka bërë publike në Unify.
                    </p>
                  </div>
                  <Badge variant="secondary">{CAMPAIGNS.length} aktive</Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {CAMPAIGNS.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      {...campaign}
                      onClick={() => router.push(`/kampanjat/${campaign.id}`)}
                      onDonate={() => router.push(`/kampanjat/${campaign.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about" className="space-y-6">
                <Card className="rounded-[28px] border-border/70">
                  <CardContent className="space-y-5 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="secondary">Profil i verifikuar</Badge>
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPinIcon className="h-4 w-4" />
                        {PROFILE.location}
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        U bashkua në {PROFILE.joined}
                      </div>
                    </div>

                    {PROFILE.story.map((paragraph) => (
                      <p key={paragraph} className="leading-8 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}

                    <div className="rounded-[24px] bg-unify-cream p-5">
                      <div className="flex items-start gap-3">
                        <BadgeCheckIcon className="mt-0.5 h-5 w-5 text-unify-blue" />
                        <p className="text-sm leading-7 text-unify-brown">
                          Ky profil ka kaluar verifikimin bazë të identitetit dhe ruan
                          një histori të qartë të përditësimeve publike rreth kampanjave të tij.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                {ACTIVITY.map((item) => (
                  <Card key={item.title} className="rounded-[24px] border-border/70">
                    <CardContent className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-unify-blue">
                        {item.date}
                      </p>
                      <h3 className="mt-2 font-display text-xl text-unify-brown">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="rounded-[28px] border-border/70">
              <CardContent className="space-y-5 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-unify-blue">
                    Ndaje profilin
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-unify-brown">
                    Përhape historinë
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Nëse njeh dikë që mund të ndihmojë, dërgoja këtë profil ose një nga
                    kampanjat aktive të lidhura me të.
                  </p>
                </div>
                <ShareButtons url={shareUrl} title={PROFILE.name} />
                <Button asChild className="w-full">
                  <Link href={`/kampanjat/${CAMPAIGNS[0].id}`}>
                    <HeartIcon className="mr-2 h-4 w-4" />
                    Hap kampanjën kryesore
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-border/70">
              <CardContent className="space-y-4 p-6">
                <h3 className="font-display text-xl text-unify-brown">Shënim publik</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Ky profil prezanton vetëm informacione që pronari ka zgjedhur t’i bëjë publike.
                  Detajet private, dokumentet dhe komunikimi i brendshëm nuk ekspozohen këtu.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </PublicLayout>
  )
}
