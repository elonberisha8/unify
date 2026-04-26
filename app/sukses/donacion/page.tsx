"use client"

// ============================================================
// BRANCH: feat/campaign-detail
// FIGMA:
//   • Sukses Donacioni → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=97-2
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { SuccessHero, ShareButtons, DonorList } from "@/components/public"
import { Button, Card, CardContent } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { HeartIcon, ArrowRightIcon } from "@/components/icons"
import { NAV_LINKS } from "@/app/_lib/constants"

// In production: read payment details via query params
const DONATION = {
  donorName: "Elon",
  amount: 50,
  currency: "€",
  campaignTitle: "Trajtim urgjent për Lirën (2 vjeç)",
  campaignSlug: "c1",
  txId: "DON-2026-04-24-A1B2C3",
  date: "24 Prill 2026, 14:32",
}

const RECENT_DONORS = [
  { name: "Elon", amount: "€50", date: "tani" },
  { name: "Anonim", amount: "€25", anonymous: true, date: "para 1 ore" },
  { name: "Valbona S.", amount: "€100", date: "para 2 orëve" },
  { name: "Diaspora NYC", amount: "€75", date: "para 3 orëve" },
]

export default function SuksesPage() {
  const router = useRouter()
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/kampanjat/${DONATION.campaignSlug}`
    : ""

  return (
    <PublicLayout
      navbar={{ links: NAV_LINKS }}
      footer={{
        tagline: "Platforma e parë për crowdfunding dhe ndihmë vullnetare.",
        sections: [
          { title: "Platforma", links: [{ label: "Si Funksionon", href: "/si-funksionon" }, { label: "Rreth Nesh", href: "/rreth-nesh" }] },
          { title: "Ligjore", links: [{ label: "Kushtet", href: "/kushtet" }, { label: "Privatësia", href: "/privatesia" }] },
          { title: "Kontakt", links: [{ label: "Na Shkruaj", href: "/kontakt" }] },
        ],
        socials: [{ platform: "facebook", href: "#" }, { platform: "instagram", href: "#" }],
      }}
    >
      <div className="bg-unify-cream">
        <SuccessHero
          title={`Faleminderit, ${DONATION.donorName}!`}
          description={`Donacioni juaj për "${DONATION.campaignTitle}" u realizua me sukses.`}
          amount={`${DONATION.currency}${DONATION.amount.toLocaleString()}`}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-8">
        {/* Receipt */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-display text-xl text-unify-brown">Detajet e transaksionit</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Numri i transaksionit</dt>
                <dd className="mt-1 font-mono text-unify-brown">{DONATION.txId}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Data</dt>
                <dd className="mt-1 text-unify-brown">{DONATION.date}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Shuma</dt>
                <dd className="mt-1 font-bold text-unify-blue">{DONATION.currency}{DONATION.amount.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Kampanja</dt>
                <dd className="mt-1 text-unify-brown">{DONATION.campaignTitle}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              Faturën do ta merrni me email brenda pak minutash. Nëse nuk e gjeni, kontrolloni folderin Spam.
            </p>
          </CardContent>
        </Card>

        {/* Share + CTA */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="font-display text-xl text-unify-brown mb-2">Ndihmoje më shumë</h2>
              <p className="text-sm text-muted-foreground">
                Ndaje këtë kampanjë me rrjetin tënd — çdo ndarje sjell donatorë të rinj.
              </p>
            </div>
            <ShareButtons url={shareUrl} title={DONATION.campaignTitle} />
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className="flex-1"
                onClick={() => router.push(`/kampanjat/${DONATION.campaignSlug}`)}
              >
                <HeartIcon className="h-4 w-4" /> Kthehu te kampanja
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/kampanjat")}
              >
                Zbulo kampanja të tjera <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Donor wall preview */}
        <DonorList title="Donatorët e fundit për këtë kampanjë" donors={RECENT_DONORS} />
      </div>
    </PublicLayout>
  )
}
