// ============================================================
// BRANCH: feat/static-pages
// FIGMA:
//   • 404 — Faqja Nuk U Gjet → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=123-2
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import Link from "next/link"
import { EmptyState, PublicLayout } from "@/components/layout"
import { Button, Card, CardContent } from "@/components/ui"
import { AlertCircleIcon, ArrowRightIcon, SearchIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "./_lib/public-layout-config"

const QUICK_LINKS = [
  {
    title: "Shpalljet",
    description: "Kërko kauza aktive, histori reale dhe ndihmë të verifikuar.",
    href: "/shpalljet",
  },
  {
    title: "Si funksionon",
    description: "Shih si funksionon Unify për donatorët dhe krijuesit.",
    href: "/sherbimet",
  },
  {
    title: "Blog",
    description: "Lexo udhëzime, këshilla dhe përditësime nga ekipi.",
    href: "/blog",
  },
]

export default function NotFoundPage() {
  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="border-b border-border bg-unify-cream">
        <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
          <EmptyState
            icon={<AlertCircleIcon className="h-7 w-7" />}
            title="Faqja që po kërkon nuk u gjet."
            description="Mund të jetë zhvendosur, fshirë ose linku mund të jetë shkruar gabim."
            className="py-0"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/">
                Shko në kryefaqe
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/shpalljet">Shiko shpalljet</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-unify-blue">
            Ku mund të vazhdosh
          </p>
          <h2 className="mt-3 font-display text-3xl text-unify-brown">
            Disa destinacione të dobishme
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {QUICK_LINKS.map((item) => (
            <Card key={item.href} className="overflow-hidden">
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-unify-blue/10 text-unify-blue">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl text-unify-brown">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <Button asChild variant="ghost" className="mt-5 justify-start pl-0">
                  <Link href={item.href}>
                    Hape faqen
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  )
}
