"use client"

// ============================================================
// BRANCH: feat/admin-moderation
// FIGMA:
//   Admin - Raportimet -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=37-2
// NOTION: https://www.notion.so/34874891227e8145ac16f2b024b58fc0
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { AdminActionMenu, AdminChartCard, AdminFilterBar, AdminQuickStats, AdminTable, type AdminActionMenuItem } from "@/components/admin"
import { AdminLayout } from "@/components/layout"
import { Badge, Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, ProgressBar, Separator, Skeleton, Textarea } from "@/components/ui"
import { apiFetch } from "@/app/_lib/api"

type ReportStatus = "open" | "investigating" | "resolved" | "dismissed"
type Severity = "low" | "medium" | "high"

interface ReportRow {
  id: string
  targetType: "Kampanje" | "Shpallje" | "Koment" | "Profil"
  targetName: string
  targetOwner: string
  targetOwnerEmail: string
  targetUrl: string
  reporter: string
  reporterEmail: string
  reason: string
  createdAt: string
  status: ReportStatus
  severity: Severity
}

interface AdminStatsResponse {
  totalUsers: number
  totalCampaigns: number
  pendingCampaigns: number
  totalVolunteers?: number
  openReports?: number
}

const statusVariant = {
  open: "destructive",
  investigating: "warning",
  resolved: "success",
  dismissed: "secondary",
} as const

export default function AdminRaportimetPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [reports, setReports] = React.useState<ReportRow[]>([])
  const [adminStats, setAdminStats] = React.useState<AdminStatsResponse | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [selected, setSelected] = React.useState<ReportRow | null>(null)

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const token = await getToken()
        const [res, stats] = await Promise.all([
          apiFetch<ReportRow[] | { reports: ReportRow[] }>("/admin/reports", { token }),
          apiFetch<AdminStatsResponse>("/admin/stats", { token }),
        ])
        const data = Array.isArray(res) ? res : ((res as { reports?: ReportRow[] }).reports ?? [])
        setReports(data)
        setAdminStats(stats)
      } catch {
        setReports([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [getToken])

  const patchReport = async (id: string, patch: Partial<ReportRow>) => {
    setReports((current) => current.map((report) => (report.id === id ? { ...report, ...patch } : report)))
    setSelected((current) => (current?.id === id ? { ...current, ...patch } : current))
    try {
      const token = await getToken()
      await apiFetch(`/admin/reports/${id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(patch),
      })
    } catch { /* keep optimistic update */ }
  }

  const deleteReport = async (id: string) => {
    setReports((current) => current.filter((report) => report.id !== id))
    setSelected((current) => (current?.id === id ? null : current))
    try {
      const token = await getToken()
      await apiFetch(`/admin/reports/${id}`, { method: "DELETE", token })
    } catch { /* keep optimistic removal */ }
  }

  const getReportActions = (report: ReportRow): AdminActionMenuItem[] => {
    const actions: AdminActionMenuItem[] = [
      { label: "Hap detajet", onClick: () => setSelected(report) },
      { label: "Hap objektivin", onClick: () => { router.push(report.targetUrl) } },
      { label: "Dergo ne moderim", onClick: () => { router.push("/admin/moderim") } },
    ]

    if (report.status === "open") {
      actions.push(
        { label: "Nis hetimin", onClick: () => patchReport(report.id, { status: "investigating" }) },
        { label: "Zgjidh raportimin", onClick: () => patchReport(report.id, { status: "resolved" }) },
        { label: "Mbyll pa veprim", onClick: () => patchReport(report.id, { status: "dismissed" }) },
      )
    }

    if (report.status === "investigating") {
      actions.push(
        { label: "Zgjidh pas hetimit", onClick: () => patchReport(report.id, { status: "resolved" }) },
        { label: "Mbyll pa veprim", onClick: () => patchReport(report.id, { status: "dismissed" }) },
      )
    }

    if (report.status === "resolved" || report.status === "dismissed") {
      actions.push({ label: "Rihap raportimin", onClick: () => patchReport(report.id, { status: "open" }) })
    }

    actions.push({ label: "Fshi raportimin", onClick: () => deleteReport(report.id), destructive: true, divider: true, confirmLabel: "A je i sigurt qe do ta fshish kete raportim?" })
    return actions
  }

  const filtered = reports.filter((report) => {
    const haystack = `${report.targetName} ${report.targetOwner} ${report.targetOwnerEmail} ${report.reporter} ${report.reporterEmail} ${report.reason}`.toLowerCase()
    const matchesSearch = haystack.includes(query.toLowerCase())
    const matchesStatus = status === "all" || report.status === status
    return matchesSearch && matchesStatus
  })

  const platformStats = [
    { label: "Total usera", value: `${adminStats?.totalUsers ?? 0}`, change: "nga DB", trend: "up" as const },
    { label: "Kampanja", value: `${adminStats?.totalCampaigns ?? 0}`, change: `${adminStats?.pendingCampaigns ?? 0} ne review`, trend: "flat" as const },
    { label: "Shpallje", value: `${adminStats?.totalVolunteers ?? 0}`, change: "aktive/review nga DB", trend: "flat" as const },
    { label: "Raporte", value: `${reports.length}`, change: `${reports.filter((r) => r.status === "open").length} hapur`, trend: "down" as const },
  ]

  const reportsByDay = Object.entries(
    reports.reduce<Record<string, number>>((acc, report) => {
      acc[report.createdAt] = (acc[report.createdAt] ?? 0) + 1
      return acc
    }, {})
  ).slice(-6).map(([label, value]) => ({ label, value }))

  const reportsByType = ([
    ["Kampanja", "Kampanje", "primary"],
    ["Shpallje", "Shpallje", "warning"],
    ["Komente", "Koment", "secondary"],
    ["Profile", "Profil", "destructive"],
  ] as const).map(([label, type, tone]) => {
    const count = reports.filter((report) => report.targetType === type).length
    const value = reports.length ? Math.round((count / reports.length) * 100) : 0
    return { label, value, tone }
  })

  return (
    <AdminLayout
      sidebar={{ activeKey: "reports" }}
      header={{
        title: "Raportimet",
        description: "Analitika e raporteve te platformes, trendeve, userave, kampanjave dhe shpalljeve.",
        notificationCount: reports.filter((report) => report.status === "open").length,
        user: { name: "Unify Admin", role: "Internal" },
        actions: (
          <Button
            variant="outline"
            onClick={async () => {
              setLoading(true)
              try {
                const token = await getToken()
                const [res, stats] = await Promise.all([
                  apiFetch<ReportRow[] | { reports: ReportRow[] }>("/admin/reports", { token }),
                  apiFetch<AdminStatsResponse>("/admin/stats", { token }),
                ])
                const data = Array.isArray(res) ? res : ((res as { reports?: ReportRow[] }).reports ?? [])
                setReports(data)
                setAdminStats(stats)
              } catch { /* keep current */ } finally { setLoading(false) }
            }}
          >
            Rifresko
          </Button>
        ),
      }}
    >
      <div className="space-y-6">
        <AdminQuickStats stats={platformStats} />

        <div className="grid gap-5 xl:grid-cols-2">
          <AdminChartCard title="Raporte sipas dites" subtitle="Volumi i raportimeve ne 6 ditet e fundit">
            <div className="space-y-3">
              {(reportsByDay.length ? reportsByDay : [{ label: "Nuk ka", value: 0 }]).map((item) => (
                <BarRow key={item.label} label={item.label} value={item.value} max={Math.max(1, ...reportsByDay.map((r) => r.value))} />
              ))}
            </div>
          </AdminChartCard>
          <AdminChartCard title="Breakdown sipas objektit" subtitle="Cfare po raportohet me se shumti">
            <div className="grid gap-3 sm:grid-cols-2">
              {reportsByType.map((item) => (
                <Card key={item.label}>
                  <CardContent className="p-4">
                    <Badge variant={item.tone}>{item.label}</Badge>
                    <p className="mt-3 font-display text-3xl text-unify-brown">{item.value}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AdminChartCard>
        </div>

        <AdminFilterBar
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Kerko raport, owner, email, reporter..."
          filters={[
            {
              key: "status",
              label: "Statusi",
              value: status,
              onChange: setStatus,
              options: [
                { label: "Te gjitha", value: "all" },
                { label: "Open", value: "open" },
                { label: "Investigating", value: "investigating" },
                { label: "Resolved", value: "resolved" },
                { label: "Dismissed", value: "dismissed" },
              ],
            },
          ]}
          actions={<Button variant="outline" onClick={() => { router.push("/admin/moderim") }}>Hap moderimin</Button>}
        />

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : null}
        <AdminTable
          rows={filtered}
          getRowId={(row) => row.id}
          columns={[
            { key: "id", label: "ID", render: (row) => <span className="font-mono text-xs">{row.id}</span> },
            { key: "target", label: "Objektivi", render: (row) => <div><p className="font-bold text-unify-brown">{row.targetName}</p><p className="text-xs text-muted-foreground">{row.targetType}</p></div> },
            { key: "owner", label: "Owner", render: (row) => <div><p>{row.targetOwner}</p><p className="text-xs text-muted-foreground">{row.targetOwnerEmail}</p></div> },
            { key: "reporter", label: "Raportuesi", render: (row) => <div><p>{row.reporter}</p><p className="text-xs text-muted-foreground">{row.reporterEmail}</p></div> },
            { key: "reason", label: "Arsyeja", render: (row) => row.reason },
            { key: "severity", label: "Risk", render: (row) => <Badge variant={row.severity === "high" ? "destructive" : row.severity === "medium" ? "warning" : "secondary"}>{row.severity}</Badge> },
            { key: "status", label: "Status", render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
            { key: "actions", label: "", align: "right", render: (row) => <AdminActionMenu items={getReportActions(row)} /> },
          ]}
          empty={<p className="text-sm text-muted-foreground">Nuk u gjet asnje raportim me keto filtra.</p>}
        />
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detaje raportimi</DialogTitle>
            <DialogDescription>Raporti mund te hetohet ketu ose te dergohet ne Moderim per vendim manual.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-5">
              <Card>
                <CardContent className="grid gap-4 p-4 text-sm md:grid-cols-2">
                  <Info label="Objektivi" value={`${selected.targetType}: ${selected.targetName}`} />
                  <Info label="Owner" value={`${selected.targetOwner} - ${selected.targetOwnerEmail}`} />
                  <Info label="Raportuesi" value={`${selected.reporter} - ${selected.reporterEmail}`} />
                  <Info label="Arsyeja" value={selected.reason} />
                  <Info label="Krijuar" value={selected.createdAt} />
                  <Info label="Risk / status" value={`${selected.severity} / ${selected.status}`} />
                </CardContent>
              </Card>
              <Textarea placeholder="Shenim hetimi: cfare u kontrollua, vendimi, dhe pse duhet/duhet jo te shkoje ne moderim..." />
              <Separator />
              <div className="flex flex-wrap gap-3">
                {selected.status === "open" && <Button onClick={() => patchReport(selected.id, { status: "investigating" })}>Nis hetimin</Button>}
                {selected.status === "investigating" && <Button onClick={() => patchReport(selected.id, { status: "resolved" })}>Zgjidh pas hetimit</Button>}
                {(selected.status === "resolved" || selected.status === "dismissed") && <Button onClick={() => patchReport(selected.id, { status: "open" })}>Rihap</Button>}
                {(selected.status === "open" || selected.status === "investigating") && <Button variant="outline" onClick={() => patchReport(selected.id, { status: "dismissed" })}>Mbyll pa veprim</Button>}
                <Button variant="outline" onClick={() => { router.push("/admin/moderim") }}>Dergo ne moderim</Button>
                <Button variant="outline" onClick={() => { router.push(selected.targetUrl) }}>Hap objektivin</Button>
                <Button variant="ghost" onClick={() => setSelected(null)}>Mbyll</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-unify-brown">{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <ProgressBar value={Math.max(4, Math.round((value / max) * 100))} />
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-medium text-unify-brown">{value}</p>
    </div>
  )
}
