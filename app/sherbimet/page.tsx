"use client"

// ============================================================
// BRANCH: feat/static-pages
// FIGMA:
//   • Sherbimet / Si Funksionon → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=181-275
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { ValueCard, CallToActionSection, FAQAccordion } from "@/components/public"
import { Badge, Button, Card, CardContent } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import {
  UserIcon,
  EditIcon,
  CheckCircleIcon,
  HeartIcon,
  WalletIcon,
  ShieldIcon,
  HandHeartIcon,
  TargetIcon,
  UsersIcon,
} from "@/components/icons"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../_lib/public-layout-config"

const STEPS_DONORS = [
  { num: "01", icon: <UserIcon className="h-6 w-6" />, title: "Regjistrohu falas", desc: "Krijo llogarinë në 30 sekonda me email ose Google." },
  { num: "02", icon: <HeartIcon className="h-6 w-6" />, title: "Gjej një kauzë", desc: "Shfleto qindra kampanja të verifikuara sipas kategorisë dhe lokacionit." },
  { num: "03", icon: <WalletIcon className="h-6 w-6" />, title: "Dhuro me siguri", desc: "Pagesa përmes Stripe — kartë, Apple Pay, Google Pay. Paratë shkojnë direkt te krijuesi." },
  { num: "04", icon: <CheckCircleIcon className="h-6 w-6" />, title: "Ndjek progresin", desc: "Merr email njoftime për milestones dhe rezultatet finale të kampanjës." },
]

const STEPS_CREATORS = [
  { num: "01", icon: <EditIcon className="h-6 w-6" />, title: "Krijo kampanjën", desc: "Formular 4 hapa — titull, foto, shumë target, milestones." },
  { num: "02", icon: <ShieldIcon className="h-6 w-6" />, title: "Verifiko identitetin", desc: "Stripe Identity — selfie + dokument ID. Zgjat 1 minutë, automatik." },
  { num: "03", icon: <CheckCircleIcon className="h-6 w-6" />, title: "Prit aprovimin", desc: "Admini shqyrton kampanjën brenda 24-48 orëve pune." },
  { num: "04", icon: <TargetIcon className="h-6 w-6" />, title: "Mblidh fondet", desc: "Paratë arrijnë direkt në IBAN-in tënd përmes Stripe Connect. 0% komision." },
]

const STEPS_VOLUNTEERS = [
  { num: "01", icon: <HandHeartIcon className="h-6 w-6" />, title: "Gjej shpallje", desc: "Shfleto mundësi ku kërkohet kohë, aftësi, transport, gjëra materiale ose ndihmë praktike." },
  { num: "02", icon: <CheckCircleIcon className="h-6 w-6" />, title: "Apliko", desc: "Lexo kushtet, trego pse mund të ndihmosh dhe dërgo aplikimin për organizatën ose familjen." },
  { num: "03", icon: <UsersIcon className="h-6 w-6" />, title: "Lidhu me krijuesin", desc: "Pas aprovimit, komunikimi kalon në dashboard që të dakordohen detajet dhe afatet." },
  { num: "04", icon: <HeartIcon className="h-6 w-6" />, title: "Ndihmo realisht", desc: "Kontributi yt shfaqet si ndikim publik dhe ndihmon komunitetin të shohë progresin." },
]

const WHY = [
  { icon: <ShieldIcon className="h-6 w-6" />, title: "100% Transparente", description: "Çdo kampanjë verifikohet. Çdo donacion ndiqet publikisht." },
  { icon: <WalletIcon className="h-6 w-6" />, title: "Pa komision", description: "Krijuesi mban 100% të donacioneve. Stripe tarifë vetëm ~1.4%." },
  { icon: <HandHeartIcon className="h-6 w-6" />, title: "Për shqiptarët", description: "Kosovë, Shqipëri, Maqedoni, Mal i Zi dhe diasporë — të gjithë bashkë." },
]

const FAQS = [
  { question: "Sa kushton të krijosh kampanjë?", answer: "Falas. Nuk ka asnjë pagesë paraprake ose mujore. Tarifa Stripe (~1.4% + €0.25) zbritet nga çdo donacion." },
  { question: "Çfarë dokumenti nevojitet për verifikim?", answer: "Letërnjoftim ose pasaportë e vlefshme, plus një selfie. Procesi i Stripe Identity zgjat 1-2 minuta." },
  { question: "A mund ta mbyll kampanjën para kohe?", answer: "Po. Në dashboard-in tënd klikon 'Mbyll kampanjën'. Paratë e mbledhura mbeten tuajat." },
  { question: "Çfarë ndodh nëse nuk arrij target-in?", answer: "Keep-it-all — krijuesi mban të gjitha paratë e mbledhura edhe nëse nuk arrin target-in. S'ka rimbursim." },
  { question: "A mund të krijoj kampanjë për dikë tjetër?", answer: "Po, por duhet ta specifikosh qartë në përshkrim dhe të kesh leje nga personi për të cilin po mbledh fonde." },
]

export default function SherbiметPage() {
  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      {/* Hero */}
      <section className="bg-unify-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <Badge variant="secondary" className="mb-4">Si funksionon</Badge>
          <h1 className="font-display text-4xl md:text-6xl text-unify-brown mb-6 max-w-3xl mx-auto">
            Thjesht. Shpejt. I sigurt.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Unify e bën të lehtë si të dhurosh ashtu edhe të mbledhësh fonde.
            Ja si funksionon në 4 hapa të thjeshtë.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" onClick={() => { router.push("/shpalljet") }}>
              Shfleto kampanjat
            </Button>
            <Button size="lg" variant="outline" onClick={() => { router.push("/auth/register") }}>
              Krijo llogari
            </Button>
          </div>
        </div>
      </section>

      {/* Për donatorët */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Për donatorët</Badge>
          <h2 className="font-display text-3xl md:text-4xl text-unify-brown mb-3">
            Dhuro në 4 hapa
          </h2>
          <p className="text-muted-foreground">
            Procesi më i thjeshtë i donacioneve për shqiptarët.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS_DONORS.map((s) => (
            <Card key={s.num}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-unify-blue/10 text-unify-blue flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="font-display text-3xl text-unify-blue/40">{s.num}</span>
                </div>
                <h3 className="font-display text-lg text-unify-brown mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Për krijuesit */}
      <section className="bg-unify-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Për krijuesit</Badge>
            <h2 className="font-display text-3xl md:text-4xl text-unify-brown mb-3">
              Mblidh fonde në 4 hapa
            </h2>
            <p className="text-muted-foreground">
              Nga ideja te fondet në llogari bankare — pa komplikime.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS_CREATORS.map((s) => (
              <Card key={s.num}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-unify-green/10 text-unify-green flex items-center justify-center">
                      {s.icon}
                    </div>
                    <span className="font-display text-3xl text-unify-green/40">{s.num}</span>
                  </div>
                  <h3 className="font-display text-lg text-unify-brown mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Për vullnetarët */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Për ndihmë vullnetare</Badge>
          <h2 className="font-display text-3xl md:text-4xl text-unify-brown mb-3">
            Jep kohë, aftësi ose gjëra konkrete
          </h2>
          <p className="text-muted-foreground">
            Unify nuk është vetëm për para. Shpalljet vullnetare i lidhin njerëzit që kanë diçka për të dhënë
            me ata që kanë nevojë për ndihmë praktike.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS_VOLUNTEERS.map((s) => (
            <Card key={s.num}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-unify-blue/10 text-unify-blue flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="font-display text-3xl text-unify-blue/40">{s.num}</span>
                </div>
                <h3 className="font-display text-lg text-unify-brown mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" onClick={() => { router.push("/vullnetare") }}>
            Shiko mundësitë vullnetare
          </Button>
        </div>
      </section>

      {/* Pse Unify */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Pse Unify</Badge>
          <h2 className="font-display text-3xl md:text-4xl text-unify-brown mb-3">
            Çfarë na bën të ndryshëm
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w) => (
            <ValueCard key={w.title} {...w} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4">Pyetje të shpeshta</Badge>
          <h2 className="font-display text-3xl md:text-4xl text-unify-brown mb-3">
            Përgjigje për pyetjet më të zakonshme
          </h2>
        </div>
        <FAQAccordion items={FAQS} />
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <CallToActionSection
          title="Gati të fillosh?"
          description="Krijo llogarinë falas në 30 sekonda dhe fillo të ndikosh sot."
          variant="inverse"
          primaryAction={{
            label: "Regjistrohu",
            onClick: () => { router.push("/auth/register") },
          }}
          secondaryAction={{
            label: "Shfleto kampanjat",
            onClick: () => { router.push("/shpalljet") },
          }}
        />
      </section>
    </PublicLayout>
  )
}
