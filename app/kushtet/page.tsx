"use client"

// ============================================================
// BRANCH: feat/static-pages
// FIGMA:
//   • Kushtet e Përdorimit → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=75-2
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import { Badge } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../_lib/public-layout-config"

const SECTIONS = [
  {
    title: "1. Hyrje",
    body: `Këto Kushte të Përdorimit ("Kushtet") rregullojnë përdorimin e platformës Unify ("Platforma", "ne", "ne"). Duke krijuar llogari ose duke përdorur Platformën, ti ("Përdoruesi", "ti") pranon këto Kushte dhe Politikën e Privatësisë. Nëse nuk pajtohesh, mos e përdor Platformën.`,
  },
  {
    title: "2. Llogaria e Përdoruesit",
    body: `Duhet të jesh mbi 18 vjeç për të krijuar llogari. Informacioni që jep gjatë regjistrimit duhet të jetë i saktë dhe i plotë. Je përgjegjës për mbajtjen e sigurisë së fjalëkalimit tënd dhe për çdo aktivitet që ndodh në llogarinë tënde.`,
  },
  {
    title: "3. Kampanjat dhe Donacionet",
    body: `Krijuesit janë vetë-përgjegjës për përmbajtjen e kampanjave të tyre. Ne rezervojmë të drejtën të aprovojmë, refuzojmë ose pezullojmë çdo kampanjë që shkel këto Kushte. Donacionet janë përfundimtare — nuk ka rimbursim automatik nëse kampanja nuk arrin target-in (modeli keep-it-all).`,
  },
  {
    title: "4. Verifikimi i Identitetit",
    body: `Për të postuar kampanja donacionesh, duhet të kalosh verifikimin e identitetit përmes Stripe Identity. Ne ruajmë të drejtën të revokojmë statusin "Verified Creator" në rast abuzimi.`,
  },
  {
    title: "5. Pagesat",
    body: `Pagesat procesohen nga Stripe (Stripe, Inc.). Tarifat e Stripe (~1.4% + €0.25 për kartat EU) aplikohen automatikisht. Unify nuk merr komision, por donatorët mund të lënë bakshish opsional (0%, 5%, 10%).`,
  },
  {
    title: "6. Përmbajtja e Ndaluar",
    body: `Ndalohet rreptësisht: kampanja mashtruese, përmbajtje e dhunshme ose urrejtjeje, fushata politike, aktivitete ilegale, apo çdo gjë që shkel ligjet në fuqi. Kampanja të tilla fshihen menjëherë dhe llogaria bllokohet.`,
  },
  {
    title: "7. Pronësia Intelektuale",
    body: `Platforma dhe gjithë përmbajtja e saj (përveç asaj të krijuar nga përdoruesit) janë pronë e Unify. Duke ngarkuar përmbajtje (foto, tekst), i jep Unify një licencë të kufizuar për ta shfaqur dhe promovuar kampanjën tënde.`,
  },
  {
    title: "8. Kufizimi i Përgjegjësisë",
    body: `Unify nuk garanton rezultatet e kampanjave. Nuk jemi përgjegjës për dështime teknike, humbje të drejtpërdrejta ose të tërthorta që mund të vijnë nga përdorimi i Platformës.`,
  },
  {
    title: "9. Ndryshimet në Kushte",
    body: `Mund t'i ndryshojmë këto Kushte në çdo kohë. Ndryshimet bëhen efektive menjëherë pas publikimit. Do të të njoftojmë me email për ndryshime të rëndësishme.`,
  },
  {
    title: "10. Kontakt",
    body: `Për çdo pyetje në lidhje me këto Kushte, na kontakto në: info@unify.al`,
  },
]

export default function KushtetPage() {
  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="bg-unify-cream border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
          <Badge variant="secondary" className="mb-4">Dokument ligjor</Badge>
          <h1 className="font-display text-4xl md:text-5xl text-unify-brown mb-4">
            Kushtet e Përdorimit
          </h1>
          <p className="text-sm text-muted-foreground">
            Versioni 1.0 — përditësuar më: 24 Prill 2026
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 md:px-6 py-16 space-y-10">
        <p className="text-muted-foreground leading-relaxed">
          Mirë se erdhe në Unify. Ky dokument përshkruan rregullat që rregullojnë
          përdorimin e platformës tonë. Të lutemi lexoji me kujdes.
        </p>

        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-2xl text-unify-brown mb-3">{s.title}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{s.body}</p>
          </section>
        ))}

        <div className="rounded-2xl bg-unify-cream p-6 border border-border">
          <p className="text-sm text-unify-brown">
            Duke përdorur Unify, konfirmon që i ke lexuar dhe i pranon këto Kushte të Përdorimit
            si dhe{" "}
            <a href="/privatesia" className="underline font-bold text-unify-blue">
              Politikën e Privatësisë
            </a>
            .
          </p>
        </div>
      </article>
    </PublicLayout>
  )
}
