"use client"

// ============================================================
// BRANCH: feat/dashboard-home
// FIGMA:
//   • Dashboard — Home → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=50-2
// NOTION: https://www.notion.so/34874891227e81f2a6e0ec234fd70570
// ============================================================

import { DashboardLayout } from "@/components/layout"
import { Button, Card, CardContent } from "@/components/ui"
import { FileTextIcon, HandHeartIcon, MegaphoneIcon, WalletIcon } from "@/components/icons"

const STATS = [
  { label: "Kampanja aktive", value: "3", icon: <MegaphoneIcon className="h-5 w-5" /> },
  { label: "Shpallje vullnetare", value: "5", icon: <HandHeartIcon className="h-5 w-5" /> },
  { label: "Transaksione", value: "€1,240", icon: <WalletIcon className="h-5 w-5" /> },
  { label: "Artikuj blogu", value: "4", icon: <FileTextIcon className="h-5 w-5" /> },
]

export default function DashboardHomePage() {
  return (
    <DashboardLayout
      activeKey="home"
      user={{ name: "Unify User", email: "user@unify.local" }}
      onLogout={() => {
        window.location.href = "/"
      }}
    >
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-unify-blue">Dashboard</p>
            <h1 className="mt-2 font-display text-4xl text-unify-brown">Mirë se erdhe në Unify</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Menaxho kampanjat, shpalljet, aplikimet dhe hyr shpejt te blogu publik i platformës.
            </p>
          </div>
          <Button onClick={() => { window.location.href = "/blog" }}>
            Hap Blogun
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 font-display text-3xl text-unify-brown">{stat.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-unify-blue/10 text-unify-blue">
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-display text-2xl text-unify-brown">Hyrje të shpejta</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" onClick={() => { window.location.href = "/dashboard/krijo/kampanje" }}>
                Krijo kampanjë
              </Button>
              <Button variant="outline" onClick={() => { window.location.href = "/dashboard/krijo/shpallje" }}>
                Krijo shpallje
              </Button>
              <Button variant="outline" onClick={() => { window.location.href = "/dashboard/aplikimet" }}>
                Aplikimet
              </Button>
              <Button variant="outline" onClick={() => { window.location.href = "/blog" }}>
                Blog
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
