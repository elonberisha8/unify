"use client"

// ============================================================
// BRANCH: feat/static-pages
// FIGMA:
//   • Rreth Nesh → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=88-792
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import * as React from "react"
import { ValueCard, StatsBar, CallToActionSection } from "@/components/public"
import { Badge, Card, CardContent, Avatar, AvatarFallback } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import {
  HandHeartIcon,
  HeartIcon,
  ShieldIcon,
  UsersIcon,
  SparklesIcon,
  GlobeIcon,
} from "@/components/icons"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../_lib/public-layout-config"

const VALUES = [
  {
    icon: <HandHeartIcon className="h-6 w-6" />,
    title: "Solidaritet",
    description:
      "Besojmë se bashkimi i shqiptarëve kudo në botë mund të ndryshojë jetë. Çdo donacion është një gur i vogël që ndërton diçka të madhe.",
  },
  {
    icon: <ShieldIcon className="h-6 w-6" />,
    title: "Transparencë",
    description:
      "Çdo kampanjë verifikohet përmes Stripe Identity. Çdo donacion ndiqet me milestones publike. Asnjë gjë fshihet.",
  },
  {
    icon: <HeartIcon className="h-6 w-6" />,
    title: "Empati",
    description:
      "Pas çdo kampanje është një histori reale. E trajtojmë çdo person me dinjitet dhe respekt.",
  },
  {
    icon: <GlobeIcon className="h-6 w-6" />,
    title: "Komunitet Global",
    description:
      "Kosovë, Shqipëri, Maqedoni, Mal i Zi dhe diasporë — një platformë për të gjithë shqipfolësit kudo që janë.",
  },
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    title: "Inovacion",
    description:
      "Teknologjia e fundit në shërbim të kauzave të mira. Pagesa të sigurta, verifikim automatik, email njoftime.",
  },
  {
    icon: <UsersIcon className="h-6 w-6" />,
    title: "Pa Komision",
    description:
      "Unify nuk merr përqindje. Krijuesi mban 100% të donacioneve. Ne mbahemi nga bakshishe opsionale të donatorëve.",
  },
]

const REAL_TEAM = [
  {
    name: "Albert Aliu",
    role: "Frontend Developer",
    bio: "Fronti i duket i qete, por Alberti e di qe nje margin gabim mund ta prishe krejt universin.",
    initials: "AA",
    avatarClass: "from-fuchsia-400 to-rose-700",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Albert-CSS-Dragon",
  },
  {
    name: "Rilind Krasniqi",
    role: "Frontend Developer",
    bio: "I ben komponentet te rrine drejt edhe kur browseri vendos te kete mendimin e vet artistik.",
    initials: "RK",
    avatarClass: "from-sky-400 to-blue-800",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Rilind-Responsive-Ninja",
  },
  {
    name: "Resul Sopa",
    role: "Design & Front Management",
    bio: "Menaxhon dizajnin dhe frontin me sy shqiponje. Nese nje buton leviz 2px, Resuli e degjon.",
    initials: "RS",
    avatarClass: "from-emerald-400 to-teal-700",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Resul-Pixel-Police",
  },
  {
    name: "Bleon Bajraktari",
    role: "Backend Developer",
    bio: "I flet API-ve me qetesi dhe i bind response-at te kthehen me status 200 si njerez te edukuar.",
    initials: "BB",
    avatarClass: "from-amber-400 to-orange-700",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Bleon-API-Wizard",
  },
  {
    name: "Elon Berisha",
    role: "Team Leader, Backend & DB",
    bio: "Mban drejtimin, backend-in dhe databazen. Pra, njeriu qe pyetet kur tabela vendos te behet filozofike.",
    initials: "EB",
    avatarClass: "from-unify-blue to-blue-900",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Elon-Backend-King",
  },
]

const STATS = [
  { label: "Fonde të mbledhura", value: "€0+" },
  { label: "Kampanja aktive", value: "0" },
  { label: "Donatorë", value: "0" },
  { label: "Komuna të mbuluara", value: "30+" },
]

export default function RrethNeshPage() {
  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      {/* Hero */}
      <section className="bg-unify-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <Badge variant="secondary" className="mb-4">Rreth Unify</Badge>
          <h1 className="font-display text-4xl md:text-6xl text-unify-brown mb-6 max-w-3xl mx-auto">
            Bashkë e bëjmë Shqipërinë, Kosovën dhe diasporën më të fortë.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unify është platforma e parë shqiptare që bashkon crowdfunding-un me
            ndihmën vullnetare. Një vend ku çdo shqiptar, kudo që të jetë, mund
            të ndihmojë ose të marrë ndihmë.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <StatsBar stats={STATS} />
      </section>

      {/* Misioni */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <Badge variant="outline" className="mb-4">Misioni ynë</Badge>
          <h2 className="font-display text-3xl md:text-4xl text-unify-brown mb-4">
            T&apos;i bëjmë donacionet transparente, të sigurta dhe të arritshme për të gjithë.
          </h2>
          <p className="text-muted-foreground mb-4">
            Shumë shqiptarë kanë nevojë për ndihmë — qoftë për trajtim mjekësor,
            arsim, emergjencë, apo thjesht për të filluar diçka të re. Nga ana
            tjetër, diaspora shqiptare është e madhe, e fortë dhe bujare.
          </p>
          <p className="text-muted-foreground">
            Unify i lidh të dyja palët përmes një platforme moderne që respekton
            standardet më të larta të sigurisë dhe transparencës. Pa komisione
            për krijuesin. Pa fshehje për donatorin.
          </p>
        </div>
        <div className="rounded-[32px] overflow-hidden aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200"
            alt="Komuniteti shqiptar"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Vlerat */}
      <section className="bg-unify-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Vlerat tona</Badge>
            <h2 className="font-display text-3xl md:text-4xl text-unify-brown mb-3">
              Në çfarë besojmë
            </h2>
            <p className="text-muted-foreground">
              Gjashtë parime që na udhëheqin çdo ditë në ndërtimin e platformës.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <ValueCard key={v.title} {...v} />
            ))}
          </div>
        </div>
      </section>

      {/* Ekipi */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Ekipi</Badge>
          <h2 className="font-display text-3xl md:text-4xl text-unify-brown mb-3">
            Njerëzit pas Unify
          </h2>
          <p className="text-muted-foreground">
            Një ekip i vogël, i përkushtuar, që beson në fuqinë e komunitetit.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_TEAM.map((m) => (
            <Card key={m.name} className="overflow-hidden">
              <div className={`relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br ${m.avatarClass}`}>
                <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-white/15" />
                <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-black/10" />
                <Avatar className="relative h-24 w-24 rotate-[-5deg] border-4 border-white/30 bg-white/20 shadow-xl transition-transform duration-500 hover:rotate-3 hover:scale-105">
                  <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" />
                  <AvatarFallback className="bg-transparent font-display text-2xl font-black text-white">
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="font-display text-xl text-unify-brown">{m.name}</h3>
                <p className="text-sm text-unify-blue font-bold mt-1">{m.role}</p>
                <p className="text-sm text-muted-foreground mt-3">{m.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 rounded-[28px] bg-unify-cream p-8 text-center">
          <h3 className="font-display text-2xl text-unify-brown">Ekipi i plotë po rritet bashkë me platformën</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Unify ndërtohet nga njerëz që mbulojnë produktin, teknologjinë, sigurinë, komunikimin,
            komunitetin dhe partneritetet. Kjo faqe do përditësohet me çdo rol të ri që i shtohet ekipit.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <CallToActionSection
          title="Bashkohu me komunitetin tonë"
          description="Bëhu pjesë e një lëvizjeje që po ndryshon jetë. Krijo kampanjën tënde ose dhuro për një shkak që të frymëzon."
          variant="inverse"
          primaryAction={{
            label: "Fillo një kampanjë",
            onClick: () => { window.location.href = "/dashboard/krijo/kampanje" },
          }}
          secondaryAction={{
            label: "Shfleto kampanjat",
            onClick: () => { window.location.href = "/shpalljet" },
          }}
        />
      </section>
    </PublicLayout>
  )
}
