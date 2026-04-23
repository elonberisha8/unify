"use client"

// ============================================================
// BRANCH: feat/homepage
// FIGMA: node-id=88-1175
// NOTION: https://www.notion.so/34874891227e8103a6b4cf331028bb95
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  HeroSection, StatsBar, CampaignCard, CategoryCard,
  FAQAccordion, CallToActionSection, NewsletterSignup,
} from "@/components/public"
import { PublicLayout } from "@/components/layout"
import { HeartIcon, HandHeartIcon, GiftIcon, UsersIcon, ShieldIcon, GlobeIcon } from "@/components/icons"

// ─── Mock data ────────────────────────────────────────────────
const STATS = [
  { value: "€124K", label: "Mbledhur gjithsej" },
  { value: "342",   label: "Kampanja aktive" },
  { value: "8,400", label: "Donatorë" },
  { value: "96",    label: "Shpallje vullnetare" },
]

const FEATURED_CAMPAIGNS = [
  {
    id: "1", title: "Ujë i Pastër për Familjet e Lipjanit",
    description: "Ndihmë familjet në Lipjan të kenë qasje në ujë të pastër.",
    category: "Emergjencë", location: "Lipjan", raised: 2450, goal: 10000,
    daysLeft: 18, donorCount: 124, creatorName: "Fondacioni Kosovës", verified: true,
  },
  {
    id: "2", title: "Libra Shkollore për 200 Nxënës",
    description: "Biej libra shkollore për 200 nxënës në nevojë financiare.",
    category: "Arsim", location: "Suharekë", raised: 1200, goal: 5000,
    daysLeft: 12, donorCount: 67, creatorName: "Shkolia Faik Konica", verified: true,
  },
  {
    id: "3", title: "Ndërtim Sheshi Lojërash — Fshati Lubinë",
    description: "Krijim hapësire rekreative dhe lojërash për fëmijët e fshatit.",
    category: "Komunitet", location: "Prishtinë", raised: 7200, goal: 12000,
    daysLeft: 30, donorCount: 203, creatorName: "Luan Morina", verified: false,
  },
]

const CATEGORIES = [
  { title: "Mjekësi & Shëndetësi", count: 48, icon: <HeartIcon className="h-5 w-5" /> },
  { title: "Arsim & Fëmijë",       count: 61, icon: <UsersIcon className="h-5 w-5" /> },
  { title: "Ndihmë Vullnetare",    count: 34, icon: <HandHeartIcon className="h-5 w-5" /> },
  { title: "Emergjencë",           count: 22, icon: <ShieldIcon className="h-5 w-5" /> },
  { title: "Komunitet",            count: 57, icon: <GlobeIcon className="h-5 w-5" /> },
  { title: "Dhurime & Sende",      count: 19, icon: <GiftIcon className="h-5 w-5" /> },
]

const FAQ_ITEMS = [
  { question: "Si mund të krijoj një kampanjë?",          answer: "Klikoni 'Krijo Kampanjë' dhe ndiqni hapat e magjistrarit 4-hap. Duhet të verifikoheni me Stripe Identity para se të publikoni." },
  { question: "A ka komisione Unify?",                    answer: "Unify nuk mban komisione. Tipat janë krejtësisht vullnetare nga donatorët gjatë procesit të dhurimit." },
  { question: "Si verifikohen krijuesit?",                answer: "Nëpërmjet Stripe Identity — selfie + dokumenti ID (automatik). Procesi zgjat 2–3 minuta." },
  { question: "A mund të dhurojë edhe dikush pa llogari?",answer: "Po — vizitorët mund të dhurojnë si mysafirë me email, pa krijuar llogari." },
  { question: "Çfarë ndodh nëse fushata nuk e arrin targetin?", answer: "Unify përdor modelin keep-it-all — krijuesi i mban të gjitha paratë edhe pa arritur targetin." },
]

const NAV_LINKS = [
  { label: "Kryefaqja",         href: "/" },
  { label: "Kampanjat",         href: "/kampanjat" },
  { label: "Ndihmë Vullnetare", href: "/vullnetare" },
  { label: "Si Funksionon",     href: "/si-funksionon" },
  { label: "Blog",              href: "/blog" },
  { label: "Kontakt",           href: "/kontakt" },
]

// ─── Faqja ────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()

  return (
    <PublicLayout
      navbar={{
        links: NAV_LINKS,
        onLogin:    () => router.push("/auth/login"),
        onRegister: () => router.push("/auth/register"),
      }}
      footer={{
        tagline: "Platforma e parë crowdfunding dhe ndihmë vullnetare për të gjithë shqiptarët.",
        sections: [
          {
            title: "Platforma",
            links: [
              { label: "Si Funksionon", href: "/si-funksionon" },
              { label: "Rreth Nesh",    href: "/rreth-nesh" },
              { label: "Blog",          href: "/blog" },
            ],
          },
          {
            title: "Ligjore",
            links: [
              { label: "Kushtet e Përdorimit",    href: "/kushtet" },
              { label: "Politika e Privatësisë",  href: "/privatesia" },
              { label: "Kontakt",                 href: "/kontakt" },
            ],
          },
        ],
        socials: [
          { platform: "facebook",  href: "#" },
          { platform: "instagram", href: "#" },
          { platform: "twitter",   href: "#" },
        ],
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16 py-8">

        {/* ── Hero ── */}
        <HeroSection
          eyebrow="Platforma shqiptare e solidaritetit"
          title="Unite, Ignite, Make It Right"
          description="Bashkohuni me mijëra shqiptarë që ndihmojnë njëri-tjetrin çdo ditë — me donacione, vullnetarizëm dhe dashuri."
          primaryAction={{
            label: "Shiko Kampanjat",
            onClick: () => router.push("/kampanjat"),
          }}
          secondaryAction={{
            label: "Ofro Ndihmë",
            onClick: () => router.push("/vullnetare"),
          }}
          variant="split"
        />

        {/* ── Statistikat ── */}
        <StatsBar stats={STATS} />

        {/* ── Kampanjat e Fundit ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-unify-brown">Shpalljet Tona të Fundit</h2>
            <button
              onClick={() => router.push("/kampanjat")}
              className="font-sans text-sm font-bold text-unify-blue hover:underline"
            >
              Shiko të gjitha →
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_CAMPAIGNS.map((c) => (
              <CampaignCard
                key={c.id}
                {...c}
                onDonate={() => router.push(`/kampanjat/${c.id}`)}
                onClick={()  => router.push(`/kampanjat/${c.id}`)}
              />
            ))}
          </div>
        </section>

        {/* ── Si Funksionon ── */}
        <section className="bg-unify-cream rounded-[32px] p-8 md:p-12">
          <h2 className="font-display text-3xl text-unify-brown text-center mb-10">
            Forma më e lehtë dhe e shkathtë për të ndihmuar
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { step: "01", title: "Krijo Kampanjën",   desc: "Plotëso formularin 4-hap dhe publiko fushatën tënde brenda minutave." },
              { step: "02", title: "Merr Donacione",     desc: "Donatorët dhurojnë me kartë bankare direkt në llogarinë tënde." },
              { step: "03", title: "Ndihmoni Njëri-tjetrin", desc: "Paratë transferohen menjëherë, pa komisione dhe pa pritje." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <span className="font-display text-5xl text-unify-blue">{s.step}</span>
                <h3 className="font-display text-xl text-unify-brown">{s.title}</h3>
                <p className="font-sans text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Kategoritë ── */}
        <section>
          <h2 className="font-display text-3xl text-unify-brown mb-6">Shërbime të Ofruara</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.title}
                title={cat.title}
                count={cat.count}
                icon={cat.icon}
                onClick={() => router.push("/kampanjat")}
              />
            ))}
          </div>
        </section>

        {/* ── CTA Newsletter ── */}
        <NewsletterSignup
          title="Bashkohuni me misionin tonë"
          description="Merrni lajme për kampanjat e reja, histori suksesi dhe mundësi vullnetarizmi."
          onSubmit={(email) => console.log("newsletter:", email)}
        />

        {/* ── FAQ ── */}
        <section>
          <h2 className="font-display text-3xl text-unify-brown text-center mb-8">
            Pyetjet e Gjitha — Përgjigjet Tuaja
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={FAQ_ITEMS} />
          </div>
        </section>

        {/* ── CTA fund ── */}
        <CallToActionSection
          variant="inverse"
          title="Çdo veprim ka rëndësi. Fillo sot."
          description="Krijo kampanjën tënde ose ofro ndihmë vullnetare — bashkë jemi më të fortë."
          primaryAction={{
            label: "Krijo Kampanjë",
            onClick: () => router.push("/auth/register"),
          }}
          secondaryAction={{
            label: "Ofro Ndihmë",
            onClick: () => router.push("/vullnetare"),
          }}
        />

      </div>
    </PublicLayout>
  )
}
