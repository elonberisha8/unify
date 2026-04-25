"use client"

// ============================================================
// BRANCH: feat/static-pages
// FIGMA:
//   • Politika e Privatësisë → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=76-2
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import { Badge } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../_lib/public-layout-config"

const SECTIONS = [
  {
    title: "1. Hyrje",
    body: `Unify ("ne", "ne") respekton privatësinë tënde. Kjo Politikë e Privatësisë shpjegon se si i mbledhim, përdorim dhe mbrojmë të dhënat e tua personale në përputhje me Rregulloren e Përgjithshme të Mbrojtjes së të Dhënave (GDPR) dhe ligjet e tjera në fuqi.`,
  },
  {
    title: "2. Çfarë të dhënash mbledhim",
    body: `• Të dhëna identifikimi: emri, email, numri i telefonit, fotoja e profilit.
• Të dhëna të verifikimit: për krijuesit, dokumenti ID dhe selfie (procesuar nga Stripe Identity — nuk i ruajmë ne).
• Të dhëna financiare: IBAN-i i krijuesit (ruhet nga Stripe Connect, jo nga ne).
• Të dhëna aktiviteti: kampanjat e krijuara, donacionet e bëra, mesazhet.
• Të dhëna teknike: adresa IP, lloji i shfletuesit, sistemi operativ.`,
  },
  {
    title: "3. Si i përdorim",
    body: `• Për të ofruar dhe përmirësuar shërbimet tona.
• Për të verifikuar identitetin e krijuesve dhe parandaluar mashtrimet.
• Për të procesuar pagesat (përmes Stripe).
• Për të të dërguar email njoftime për kampanjat (të domosdoshme) dhe newsletter (opsionale — mund të çregjistrohesh në çdo kohë).
• Për të analizuar trendin e përdorimit dhe përmirësuar platformën.`,
  },
  {
    title: "4. Kush i sheh të dhënat e tua",
    body: `• Ne (ekipi i Unify) për mirëmbajtjen e platformës.
• Partnerët tanë të procesimit: Stripe (pagesa), Clerk (autentikim), Cloudinary (foto), Resend (email).
• Autoritetet publike — vetëm kur kërkohet nga ligji.
• Nuk i shesim ose ndajmë të dhënat e tua me palë të treta për qëllime marketingu.`,
  },
  {
    title: "5. Cookies",
    body: `Përdorim cookies të domosdoshme për funksionimin e platformës (sesioni i kyçjes, parapëlqimet e gjuhës) dhe cookies analitikë për të kuptuar trafikun. Mund t'i menaxhosh preferencat e cookies nga shfletuesi yt.`,
  },
  {
    title: "6. Të drejtat e tua (GDPR)",
    body: `• E drejta e qasjes: mund të kërkosh një kopje të të dhënave të tua.
• E drejta e korrigjimit: mund t'i korrigjosh të dhëna të pasakta.
• E drejta e fshirjes ("e drejta për t'u harruar"): mund të kërkosh fshirjen e llogarisë.
• E drejta e portabilitetit: mund t'i shkarkosh të dhënat e tua në format të lexueshëm.
• E drejta e kundërshtimit: mund të kundërshtosh përdorimin e caktuar të të dhënave.

Për të ushtruar këto të drejta, na kontakto në: privacy@unify.al`,
  },
  {
    title: "7. Ruajtja e të dhënave",
    body: `Të dhënat e tua ruhen në serverë të sigurt në Bashkimin Evropian. Donacionet dhe kampanjat ruhen edhe pas fshirjes së llogarisë (me emër "Përdorues i Fshirë") për integritet ligjor dhe financiar.`,
  },
  {
    title: "8. Mosha minimale",
    body: `Platforma Unify nuk është e dedikuar për fëmijë nën 18 vjeç. Nuk mbledhim me vetëdije të dhëna nga persona nën 18 vjeç.`,
  },
  {
    title: "9. Ndryshimet",
    body: `Mund ta përditësojmë këtë Politikë kohë pas kohe. Ndryshimet e rëndësishme do të njoftohen me email.`,
  },
  {
    title: "10. Kontakti DPO",
    body: `Për çdo pyetje në lidhje me privatësinë, na kontakto: privacy@unify.al ose na shkruaj në adresën postare të listuar te faqja Kontakt.`,
  },
]

export default function PrivatesiaPage() {
  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="bg-unify-cream border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
          <Badge variant="secondary" className="mb-4">GDPR compliant</Badge>
          <h1 className="font-display text-4xl md:text-5xl text-unify-brown mb-4">
            Politika e Privatësisë
          </h1>
          <p className="text-sm text-muted-foreground">
            Versioni 1.0 — përditësuar më: 24 Prill 2026
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 md:px-6 py-16 space-y-10">
        <p className="text-muted-foreground leading-relaxed">
          Privatësia jote është prioriteti ynë. Ky dokument shpjegon se si i trajtojmë
          të dhënat e tua personale në përputhje me GDPR dhe standardet më të larta
          të sigurisë.
        </p>

        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-2xl text-unify-brown mb-3">{s.title}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{s.body}</p>
          </section>
        ))}

        <div className="rounded-2xl bg-unify-cream p-6 border border-border">
          <p className="text-sm text-unify-brown">
            Ke pyetje për privatësinë?{" "}
            <a href="/kontakt" className="underline font-bold text-unify-blue">
              Na shkruaj
            </a>{" "}
            ose dërgo email në <strong>privacy@unify.al</strong>.
          </p>
        </div>
      </article>
    </PublicLayout>
  )
}
