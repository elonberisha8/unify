"use client"

// ============================================================
// BRANCH: feat/admin-core
// FIGMA:
//   Admin — Dashboard → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=40-2
// NOTION: https://www.notion.so/34874891227e812cb190ea4b86cfa9bc
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { AdminQuickStats, AdminStatCard, AdminTable } from "@/components/admin"
import { AdminLayout } from "@/components/layout"
import { Badge, Button, Card, CardContent, Skeleton } from "@/components/ui"
import { AlertTriangleIcon, HandHeartIcon, MegaphoneIcon, UsersIcon } from "@/components/icons"
import { apiFetch, type AdminStats } from "@/app/_lib/api"

interface RecentEvent {
  id: string
  area: string
  event: string
  owner: string
  status: string
}

export default function AdminDashPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [stats, setStats] = React.useState<AdminStats | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [recentEvents, setRecentEvents] = React.useState<RecentEvent[]>([])

  React.useEffect(() => {
    async function load() {
      try {
        const token = await getToken()
        const [statsData, auditRes] = await Promise.all([
          apiFetch<AdminStats>("/admin/stats", { token }),
          apiFetch<{ entries?: { id: string; actor: string; action: string; target: string; severity: string; timestamp: string }[] } | { id: string; actor: string; action: string; target: string; severity: string; timestamp: string }[]>("/admin/audit-log", { token }),
        ])
        setStats(statsData)

        const auditArr = Array.isArray(auditRes) ? auditRes : (auditRes as { entries?: typeof auditRes }).entries ?? []
        const events: RecentEvent[] = (auditArr as { id: string; actor: string; action: string; target: string; severity: string }[]).slice(0, 8).map((e) => ({
          id: e.id,
          area: e.target,
          event: e.action.replace(/_/g, " "),
          owner: e.actor,
          status: e.severity === "warning" ? "Urgjent" : e.severity === "critical" ? "Kritik" : "OK",
        }))
        setRecentEvents(events)
      } catch {
        setStats({ totalCampaigns: 0, activeCampaigns: 0, pendingCampaigns: 0, totalUsers: 0, totalRaised: 0 })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken])

  const systemStats = stats
    ? [
        { label: "Perdorues", value: stats.totalUsers.toLocaleString(), icon: <UsersIcon className="h-5 w-5" />, change: { value: "Total", trend: "up" as const } },
        { label: "Kampanja aktive", value: stats.activeCampaigns.toLocaleString(), icon: <MegaphoneIcon className="h-5 w-5" />, change: { value: `${stats.pendingCampaigns} pending`, trend: "up" as const } },
        { label: "Total kampanja", value: stats.totalCampaigns.toLocaleString(), icon: <HandHeartIcon className="h-5 w-5" />, change: { value: "Gjithsej", trend: "up" as const } },
        { label: "Fonde te mbledhura", value: `€${stats.totalRaised.toLocaleString()}`, icon: <AlertTriangleIcon className="h-5 w-5" />, change: { value: "Stripe confirmed", trend: "up" as const } },
      ]
    : []

  const healthStats = [
    { label: "API status", value: stats ? "Online" : "Offline", change: stats ? "admin/stats OK" : "pa pergjigje", trend: stats ? "up" as const : "down" as const },
    { label: "Audit log", value: `${recentEvents.length}`, change: "ngjarje nga DB", trend: recentEvents.length ? "up" as const : "flat" as const },
    { label: "Review queue", value: `${stats?.pendingCampaigns ?? 0}`, change: "kampanja pending", trend: (stats?.pendingCampaigns ?? 0) ? "down" as const : "up" as const },
    { label: "Admin access", value: "Internal", change: "kontrollo settings/network rules", trend: "flat" as const },
  ]

  return (
    <AdminLayout
      sidebar={{ activeKey: "dashboard" }}
      header={{
        title: "Admin Dashboard",
        description: "Panel intern pa login per momentin. Kufizimi real duhet bere ne nivel VPN/IP allowlist.",
        notificationCount: stats?.pendingCampaigns ?? 0,
        user: { name: "Unify Admin", role: "Internal" },
        actions: <Button onClick={() => { router.push("/") }}>Faqja publike</Button>,
      }}
    >
      <div className="space-y-6">
        <Card className="border-unify-blue/20 bg-unify-blue/5">
          <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge variant="primary">Internal only</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                Ky admin nuk ka login per MVP. Para deploy publik duhet izoluar me VPN, reverse proxy allowlist ose firewall rules.
              </p>
            </div>
            <Button variant="outline" onClick={() => { router.push("/admin/audit-log") }}>
              Shiko audit log
            </Button>
          </CardContent>
        </Card>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {systemStats.map((stat) => (
              <AdminStatCard key={stat.label} {...stat} />
            ))}
          </div>
        )}

        <AdminQuickStats stats={healthStats} />

        <AdminTable
          rows={recentEvents}
          getRowId={(row) => row.id}
          columns={[
            { key: "id", label: "ID", render: (row) => <span className="font-mono text-xs">{row.id}</span> },
            { key: "area", label: "Zona", render: (row) => row.area },
            { key: "event", label: "Ngjarja", render: (row) => row.event },
            { key: "owner", label: "Owner", render: (row) => row.owner },
            { key: "status", label: "Status", render: (row) => <Badge variant={row.status === "Urgjent" || row.status === "Kritik" ? "destructive" : "secondary"}>{row.status}</Badge> },
          ]}
          empty={<p className="text-sm text-muted-foreground">Nuk ka ngjarje te fundit.</p>}
        />
      </div>
    </AdminLayout>
  )
}

