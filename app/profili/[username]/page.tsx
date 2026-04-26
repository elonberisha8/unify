"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { PublicProfileHero } from "@/components/dashboard"
import { CampaignCard, ShareButtons } from "@/components/public"
import { Breadcrumbs, PublicLayout } from "@/components/layout"
import { Badge, Button, Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui"
import { BadgeCheckIcon, CalendarIcon, HeartIcon, MapPinIcon } from "@/components/icons"
import { apiFetch, type PublicProfile, type PublicProfileCampaign } from "@/app/_lib/api"
import { formatCurrency } from "@/lib/format"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../../_lib/public-layout-config"

function formatJoined(value: string) {
  return new Date(value).toLocaleDateString("sq-AL", { month: "long", year: "numeric" })
}

function daysLeft(value: string | null) {
  if (!value) return undefined
  const diff = new Date(value).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
}

function imageFromCampaign(campaign: PublicProfileCampaign) {
  return Array.isArray(campaign.images) && campaign.images.length ? campaign.images[0] : undefined
}

function campaignDescription(campaign: PublicProfileCampaign) {
  return campaign.shortDescription || campaign.description
}

export default function PublicProfilPage() {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const username = params?.username ? decodeURIComponent(params.username) : ""
  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const [profile, setProfile] = React.useState<PublicProfile | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    async function loadProfile() {
      if (!username) return
      setLoading(true)
      setError("")

      try {
        const data = await apiFetch<PublicProfile>(`/users/${encodeURIComponent(username)}`)
        setProfile(data)
      } catch {
        setError("Profili publik nuk u gjet ose nuk është aktiv.")
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [username])

  const publicCampaigns = profile?.privacyCampaignsPublic ? profile.campaigns ?? [] : []
  const mainCampaign = publicCampaigns[0]
  const totalRaised = publicCampaigns.reduce((sum, campaign) => sum + campaign.currentAmount, 0)
  const donorCount = publicCampaigns.reduce((sum, campaign) => sum + (campaign._count?.donations ?? 0), 0)

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER} mainClassName="bg-unify-cream/40">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <Breadcrumbs
          items={[
            { label: "Kryefaqja", href: "/" },
            { label: "Profili publik", href: `/profili/${username}` },
            { label: profile?.name ?? username },
          ]}
          className="mb-6"
        />

        {loading && (
          <Card className="rounded-[28px] border-border/70">
            <CardContent className="p-8 text-sm text-muted-foreground">Duke ngarkuar profilin...</CardContent>
          </Card>
        )}

        {!loading && error && (
          <Card className="rounded-[28px] border-border/70">
            <CardContent className="space-y-4 p-8">
              <h1 className="font-display text-2xl text-unify-brown">Profili nuk u gjet</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button asChild>
                <Link href="/">Kthehu në kryefaqe</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && profile && (
          <>
            <PublicProfileHero
              name={profile.name}
              avatar={profile.image ?? undefined}
              cover={imageFromCampaign(mainCampaign)}
              location={profile.location ?? undefined}
              joined={formatJoined(profile.createdAt)}
              bio={profile.bio ?? "Ky profil ende nuk ka shtuar përshkrim publik."}
              verified={profile.isVerified}
              stats={[
                { label: "Kampanja", value: String(profile.privacyCampaignsPublic ? profile._count.campaigns : publicCampaigns.length) },
                { label: "Donatorë", value: profile.privacyDonationsPublic ? String(donorCount) : "Privat" },
                { label: "Të mbledhura", value: profile.privacyCampaignsPublic ? formatCurrency(Math.round(totalRaised)) : "Privat" },
              ]}
              primaryAction={mainCampaign ? { label: "Shiko kampanjat", onClick: () => router.push(`/kampanjat/${mainCampaign.slug}`) } : undefined}
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
                          Kauzat aktive që ky profil i ka bërë publike në Unify.
                        </p>
                      </div>
                      <Badge variant="secondary">{publicCampaigns.length} aktive</Badge>
                    </div>

                    {publicCampaigns.length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        {publicCampaigns.map((campaign) => (
                          <CampaignCard
                            key={campaign.id}
                            id={campaign.id}
                            title={campaign.title}
                            description={campaignDescription(campaign)}
                            imageUrl={imageFromCampaign(campaign)}
                            category={campaign.category}
                            location={campaign.location}
                            raised={campaign.currentAmount}
                            goal={campaign.targetAmount}
                            daysLeft={daysLeft(campaign.endsAt)}
                            donorCount={campaign._count?.donations}
                            creatorName={profile.name}
                            verified={profile.isVerified}
                            onClick={() => router.push(`/kampanjat/${campaign.slug}`)}
                            onDonate={() => router.push(`/kampanjat/${campaign.slug}`)}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="rounded-[24px] border-border/70">
                        <CardContent className="p-6 text-sm text-muted-foreground">
                          Ky profil nuk ka kampanja publike aktive për momentin.
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="about" className="space-y-6">
                    <Card className="rounded-[28px] border-border/70">
                      <CardContent className="space-y-5 p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant={profile.isVerified ? "success" : "secondary"}>
                            {profile.isVerified ? "Profil i verifikuar" : "Profil publik"}
                          </Badge>
                          {profile.location && (
                            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPinIcon className="h-4 w-4" />
                              {profile.location}
                            </div>
                          )}
                          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            U bashkua në {formatJoined(profile.createdAt)}
                          </div>
                        </div>

                        <p className="leading-8 text-muted-foreground">
                          {profile.bio || "Ky profil ende nuk ka shtuar një përshkrim publik."}
                        </p>

                        <div className="rounded-[24px] bg-unify-cream p-5">
                          <div className="flex items-start gap-3">
                            <BadgeCheckIcon className="mt-0.5 h-5 w-5 text-unify-blue" />
                            <p className="text-sm leading-7 text-unify-brown">
                              Ky profil shfaq vetëm informacionet që pronari i ka bërë publike në cilësimet e llogarisë.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-4">
                    <Card className="rounded-[24px] border-border/70">
                      <CardContent className="p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-unify-blue">
                          {formatJoined(profile.createdAt)}
                        </p>
                        <h3 className="mt-2 font-display text-xl text-unify-brown">Profili u krijua</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {profile.name} iu bashkua Unify dhe publikoi profilin për komunitetin.
                        </p>
                      </CardContent>
                    </Card>

                    {publicCampaigns.map((campaign) => (
                      <Card key={campaign.id} className="rounded-[24px] border-border/70">
                        <CardContent className="p-6">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-unify-blue">
                            Kampanjë aktive
                          </p>
                          <h3 className="mt-2 font-display text-xl text-unify-brown">{campaign.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            Ka mbledhur {formatCurrency(Math.round(campaign.currentAmount))} nga objektivi {formatCurrency(Math.round(campaign.targetAmount))}.
                          </p>
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
                        Nëse njeh dikë që mund të ndihmojë, dërgoja këtë profil ose një nga kampanjat aktive.
                      </p>
                    </div>
                    <ShareButtons url={shareUrl} title={profile.name} />
                    {mainCampaign && (
                      <Button asChild className="w-full">
                        <Link href={`/kampanjat/${mainCampaign.slug}`}>
                          <HeartIcon className="mr-2 h-4 w-4" />
                          Hap kampanjën kryesore
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-[28px] border-border/70">
                  <CardContent className="space-y-4 p-6">
                    <h3 className="font-display text-xl text-unify-brown">Shënim publik</h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Detajet private, dokumentet dhe komunikimi i brendshëm nuk ekspozohen në profilin publik.
                    </p>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </>
        )}
      </section>
    </PublicLayout>
  )
}
