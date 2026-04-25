"use client"

// ============================================================
// BRANCH: feat/campaign-detail
// FIGMA:
//   • Sukses Donacioni → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=97-2
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import { ShareButtons } from "@/components/public"
import { Button, Card, CardContent } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { ArrowRightIcon, CalendarIcon, CheckIcon, CreditCardIcon, FileTextIcon, HeartIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../../_lib/public-layout-config"

const DONATION = {
  amount: 50,
  currency: "€",
  campaignTitle: "Ujë i Pastër — Lipjan",
  campaignSlug: "c1",
  txId: "UNF-2026-8841",
  date: "14 Prill 2026, 16:42",
  method: "Kartë Krediti (Visa)",
}

export default function SuksesPage() {
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/kampanjat/${DONATION.campaignSlug}` : ""
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: DONATION.campaignTitle, url: shareUrl })
      return
    }

    await navigator.clipboard.writeText(shareUrl)
  }

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER} mainClassName="bg-unify-cream">
      <section className="relative overflow-hidden px-4 py-12 md:px-6 md:py-20">
        <div className="absolute left-[18%] top-[18%] h-5 w-5 rounded-full bg-unify-blue/30" />
        <div className="absolute right-[15%] top-[24%] h-6 w-6 rounded-full bg-[#2fb0ab]/35" />
        <div className="absolute left-[32%] top-[12%] h-4 w-4 rounded-full bg-[#2fb0ab]/30" />

        <Card className="relative mx-auto max-w-[600px] rounded-[32px] border-border bg-white shadow-[0_25px_50px_rgba(0,0,0,0.18)]">
          <CardContent className="px-8 py-10 md:px-12 md:py-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#2fb0ab] text-white shadow-lg">
              <CheckIcon className="h-14 w-14" />
            </div>

            <div className="mt-8 text-center">
              <h1 className="font-display text-4xl text-unify-brown md:text-5xl">Faleminderit!</h1>
              <p className="mx-auto mt-4 max-w-[500px] text-base leading-7 text-unify-brown/70 md:text-lg">
                Donacioni juaj u pranua me sukses. Faleminderit që jeni pjesë e ndryshimit pozitiv!
              </p>
            </div>

            <div className="my-9 border-t border-border" />

            <dl className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-3 text-sm text-muted-foreground">
                  <HeartIcon className="h-5 w-5 text-unify-blue" />
                  Fushatë
                </dt>
                <dd className="text-right font-bold text-unify-brown">{DONATION.campaignTitle}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="text-xl font-bold text-unify-brown">{DONATION.currency}</span>
                  Shuma
                </dt>
                <dd className="font-bold text-[#2fb0ab]">
                  {DONATION.currency}
                  {DONATION.amount.toFixed(2)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CreditCardIcon className="h-5 w-5 text-unify-blue" />
                  Mënyra
                </dt>
                <dd className="text-right font-bold text-unify-brown">{DONATION.method}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-3 text-sm text-muted-foreground">
                  <FileTextIcon className="h-5 w-5 text-unify-blue" />
                  Referenca
                </dt>
                <dd className="font-bold text-unify-brown">{DONATION.txId}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CalendarIcon className="h-5 w-5 text-unify-blue" />
                  Data
                </dt>
                <dd className="text-right font-bold text-unify-brown">{DONATION.date}</dd>
              </div>
            </dl>

            <div className="my-9 border-t border-border" />

            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                size="lg"
                onClick={() => {
                  window.location.href = `/kampanjat/${DONATION.campaignSlug}`
                }}
              >
                Kthehu te Kampanja
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                Shpërnda <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 flex justify-center">
              <ShareButtons url={shareUrl} title={DONATION.campaignTitle} />
            </div>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  )
}
