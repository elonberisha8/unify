"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SuccessHero, ShareButtons } from "@/components/public"
import { Button, Card, CardContent } from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import { HeartIcon, ArrowRightIcon } from "@/components/icons"
import { NAV_LINKS } from "@/app/_lib/constants"
import { useUser } from "@clerk/nextjs"

export default function SuksesPage() {
  const router       = useRouter()
  const params       = useSearchParams()
  const { user }     = useUser()

  const pi        = params.get("pi")     ?? ""
  const amount    = params.get("amount") ?? "0"
  const title     = params.get("title")  ?? "Kampanja"
  const slug      = params.get("slug")   ?? ""

  const donorName = user?.firstName ?? user?.fullName ?? "Donator"
  const now       = new Date().toLocaleDateString("sq-AL", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
  const txId = pi ? `DON-${pi.slice(-8).toUpperCase()}` : "—"
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/kampanjat/${slug}`
    : ""

  return (
    <PublicLayout
      navbar={{ links: NAV_LINKS, onLogin: () => router.push("/auth/login"), onRegister: () => router.push("/auth/register") }}
      footer={{
        tagline: "Platforma e parë për crowdfunding dhe ndihmë vullnetare.",
        sections: [
          { title: "Platforma", links: [{ label: "Si Funksionon", href: "/si-funksionon" }, { label: "Rreth Nesh", href: "/rreth-nesh" }] },
          { title: "Ligjore",   links: [{ label: "Kushtet", href: "/kushtet" }, { label: "Privatësia", href: "/privatesia" }] },
          { title: "Kontakt",   links: [{ label: "Na Shkruaj", href: "/kontakt" }] },
        ],
        socials: [{ platform: "facebook", href: "#" }, { platform: "instagram", href: "#" }],
      }}
    >
      <div className="bg-unify-cream">
        <SuccessHero
          title={`Faleminderit, ${donorName}!`}
          description={`Donacioni juaj për "${title}" u realizua me sukses.`}
          amount={`€${Number(amount).toLocaleString("sq-AL")}`}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 space-y-8">
        {/* Receipt */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-display text-xl text-unify-brown">Detajet e transaksionit</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wide">ID Transaksionit</dt>
                <dd className="mt-1 font-mono text-unify-brown break-all">{txId}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Data</dt>
                <dd className="mt-1 text-unify-brown">{now}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Shuma</dt>
                <dd className="mt-1 font-bold text-unify-blue">€{Number(amount).toLocaleString("sq-AL")}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Kampanja</dt>
                <dd className="mt-1 text-unify-brown">{title}</dd>
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
            {shareUrl && <ShareButtons url={shareUrl} title={title} />}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {slug && (
                <Button className="flex-1" onClick={() => router.push(`/kampanjat/${slug}`)}>
                  <HeartIcon className="h-4 w-4" /> Kthehu te kampanja
                </Button>
              )}
              <Button variant="outline" className="flex-1" onClick={() => router.push("/kampanjat")}>
                Zbulo kampanja të tjera <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
