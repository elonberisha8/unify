"use client"

// ============================================================
// BRANCH: feat/admin-moderation
// FIGMA:
//   Admin - Moderim -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=38-2
// NOTION: https://www.notion.so/34874891227e8145ac16f2b024b58fc0
// ============================================================

import * as React from "react"
import { useAuth } from "@clerk/nextjs"
import { AdminTable, ModerationDecisionCard } from "@/components/admin"
import { AdminLayout } from "@/components/layout"
import { Badge, Button, Card, CardContent, Input, Skeleton } from "@/components/ui"
import { apiFetch, type AdminCampaign, type AdminVolunteer } from "@/app/_lib/api"

type ModerationRisk = "low" | "medium" | "high"
type DecisionStatus = "approved" | "rejected" | "paused"

interface ModerationItem {
  id: string
  type: "Kampanje" | "Shpallje"
  title: string
  owner: string
  ownerId: string
  ownerEmail: string
  submittedAt: string
  category: string
  location: string
  risk: ModerationRisk
  objectUrl: string
  ownerUrl: string
  details: { label: string; value: string }[]
  evidence: string[]
}

interface DecisionLog {
  id: string
  title: string
  decision: DecisionStatus
  note: string
  decidedAt: string
}

interface BlockListItem {
  id: string
  type: "user" | "email" | "ip" | "domain"
  value: string
  reason: string
  expires: string
}

function campaignToItem(c: AdminCampaign): ModerationItem {
  return {
    id: c.id,
    type: "Kampanje",
    title: c.title,
    owner: c.creator.name,
    ownerId: c.creator.id,
    ownerEmail: c.creator.email,
    submittedAt: new Date(c.createdAt).toLocaleDateString("sq-AL"),
    category: c.category,
    location: c.location,
    risk: c.isUrgent ? "high" : "medium",
    objectUrl: `/admin/kampanjat`,
    ownerUrl: `/admin/perdoruesit/${c.creator.id}`,
    details: [
      { label: "Shuma", value: `€${c.currentAmount.toLocaleString()} / ${c.targetAmount.toLocaleString()}` },
      { label: "Donatorë", value: `${c._count.donations}` },
      { label: "Featured", value: c.isFeatured ? "Po" : "Jo" },
      { label: "Status", value: c.status },
    ],
    evidence: [
      `Kampanja "${c.title}" pret rishikim manual para publikimit.`,
      `Krijuesi: ${c.creator.email}`,
    ],
  }
}

function volunteerToItem(v: AdminVolunteer): ModerationItem {
  return {
    id: v.id,
    type: "Shpallje",
    title: v.title,
    owner: v.owner.name,
    ownerId: v.owner.id,
    ownerEmail: v.owner.email,
    submittedAt: new Date(v.createdAt).toLocaleDateString("sq-AL"),
    category: v.category,
    location: v.location,
    risk: "medium",
    objectUrl: `/admin/vullnetare`,
    ownerUrl: `/admin/perdoruesit/${v.owner.id}`,
    details: [
      { label: "Aplikime", value: `${v._count.applications}` },
      { label: "Anonim", value: v.isAnonymous ? "Po" : "Jo" },
      { label: "Status", value: v.status },
    ],
    evidence: [
      `Shpallja "${v.title}" pret rishikim manual.`,
      `Pronari: ${v.owner.email}`,
    ],
  }
}

export default function AdminModerimPage() {
  const { getToken } = useAuth()
  const [queue, setQueue] = React.useState<ModerationItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [decisions, setDecisions] = React.useState<DecisionLog[]>([])
  const [blocklist, setBlocklist] = React.useState<BlockListItem[]>([
    { id: "BL-01", type: "email", value: "spam@example.com", reason: "3+ raportime", expires: "permanent" },
    { id: "BL-02", type: "ip", value: "185.22.91.10", reason: "rate limit", expires: "2026-05-02" },
  ])
  const [blockValue, setBlockValue] = React.useState("")

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const [campaignRes, volunteerRes] = await Promise.all([
        apiFetch<{ campaigns: AdminCampaign[] } | AdminCampaign[]>("/admin/campaigns", { token }),
        apiFetch<AdminVolunteer[]>("/admin/volunteers", { token }),
      ])
      const campaigns = Array.isArray(campaignRes)
        ? campaignRes
        : ((campaignRes as { campaigns?: AdminCampaign[] }).campaigns ?? [])
      const volunteers = Array.isArray(volunteerRes) ? volunteerRes : []

      const pendingCampaigns = campaigns
        .filter((c) => c.status === "PENDING")
        .map(campaignToItem)
      const pendingVolunteers = volunteers
        .filter((v) => v.status === "PENDING")
        .map(volunteerToItem)

      setQueue([...pendingCampaigns, ...pendingVolunteers])
    } catch {
      setQueue([])
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => { load() }, [load])

  const approve = async (item: ModerationItem) => {
    try {
      const token = await getToken()
      const path = item.type === "Kampanje"
        ? `/admin/campaigns/${item.id}/approve`
        : `/admin/volunteers/${item.id}/approve`
      await apiFetch(path, { method: "PATCH", token })
    } catch { /* continue anyway */ }
    recordDecision(item, "approved", "")
    setQueue((cur) => cur.filter((e) => e.id !== item.id))
  }

  const reject = async (item: ModerationItem, note: string) => {
    try {
      const token = await getToken()
      if (item.type === "Kampanje") {
        await apiFetch(`/admin/campaigns/${item.id}/reject`, {
          method: "PATCH",
          token,
          body: JSON.stringify({ reason: note || "Refuzuar nga admin." }),
        })
      }
    } catch { /* continue anyway */ }
    recordDecision(item, "rejected", note)
    setQueue((cur) => cur.filter((e) => e.id !== item.id))
  }

  const pause = (item: ModerationItem, note: string) => {
    recordDecision(item, "paused", note)
    setQueue((cur) => cur.filter((e) => e.id !== item.id))
  }

  const recordDecision = (item: ModerationItem, decision: DecisionStatus, note: string) => {
    setDecisions((cur) => [
      {
        id: item.id,
        title: item.title,
        decision,
        note: note.trim() || "Pa shenim të brendshëm",
        decidedAt: new Date().toLocaleTimeString("sq-AL", { hour: "2-digit", minute: "2-digit" }),
      },
      ...cur,
    ])
  }

  const addBlock = (type: BlockListItem["type"], value: string, reason = "Shtuar nga moderimi") => {
    const clean = value.trim()
    if (!clean) return
    setBlocklist((cur) => [
      { id: `BL-${Date.now()}`, type, value: clean, reason, expires: "permanent" },
      ...cur,
    ])
    setBlockValue("")
  }

  const highRisk = queue.filter((i) => i.risk === "high").length

  return (
    <AdminLayout
      sidebar={{ activeKey: "moderation" }}
      header={{
        title: "Moderim",
        description: "Queue vendimesh manuale — kampanja dhe shpallje PENDING që presin aprovim.",
        notificationCount: queue.length,
        user: { name: "Unify Admin", role: "Internal" },
        actions: <Button variant="outline" onClick={load}>Rifresko</Button>,
      }}
    >
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Në queue" value={loading ? "…" : `${queue.length}`} tone="warning" />
          <SummaryCard label="High risk" value={loading ? "…" : `${highRisk}`} tone="destructive" />
          <SummaryCard label="Vendime sot" value={`${decisions.length}`} tone="primary" />
          <SummaryCard label="Blocklist" value={`${blocklist.length}`} tone="secondary" />
        </div>

        {/* Queue */}
        {loading ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : queue.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Badge variant="success">Queue e pastër</Badge>
              <h2 className="mt-3 font-display text-2xl text-unify-brown">Nuk ka raste për moderim</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Të gjitha kampanjat dhe shpalljet janë procesuar.
              </p>
              <Button className="mt-4" variant="outline" onClick={load}>
                Rifresko
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {queue.map((item) => (
              <ModerationDecisionCard
                key={item.id}
                title={`${item.type}: ${item.title}`}
                submittedBy={item.owner}
                submittedAt={item.submittedAt}
                reason={`${item.type} ne pritje per aprovim manual.`}
                targetType={item.type}
                targetId={item.id}
                targetTitle={item.title}
                targetStatus="Ne shqyrtim"
                ownerName={item.owner}
                ownerId={item.ownerId}
                category={item.category}
                location={item.location}
                risk={item.risk}
                details={item.details}
                evidence={item.evidence}
                objectUrl={item.objectUrl}
                ownerUrl={item.ownerUrl}
                onApprove={(note) => approve(item)}
                onReject={(note) => reject(item, note)}
                onPause={(note) => pause(item, note)}
                onBlockEmail={() => addBlock("email", item.ownerEmail, `Bllokuar nga rasti ${item.id}`)}
                onBlockUser={() => addBlock("user", item.ownerEmail, `Bllokuar user nga rasti ${item.id}`)}
              />
            ))}
          </div>
        )}

        {/* Blocklist */}
        <div className="space-y-3">
          <div>
            <h2 className="font-display text-xl text-unify-brown">Blocklist</h2>
            <p className="text-sm text-muted-foreground">
              Email, usera, IP ose domain-e të bllokuara.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-3 sm:flex-row">
            <Input
              value={blockValue}
              onChange={(e) => setBlockValue(e.target.value)}
              placeholder="email, user id, IP ose domain..."
            />
            <Button onClick={() => addBlock("email", blockValue)}>Shto email</Button>
            <Button variant="outline" onClick={() => addBlock("ip", blockValue)}>Shto IP</Button>
            <Button variant="outline" onClick={() => addBlock("domain", blockValue)}>Shto domain</Button>
          </div>
          <AdminTable
            rows={blocklist}
            getRowId={(row) => row.id}
            columns={[
              {
                key: "type", label: "Tipi",
                render: (row) => (
                  <Badge variant={row.type === "user" || row.type === "email" ? "primary" : row.type === "ip" ? "warning" : "destructive"}>
                    {row.type}
                  </Badge>
                ),
              },
              { key: "value", label: "Vlera", render: (row) => <span className="font-mono text-xs">{row.value}</span> },
              { key: "reason", label: "Arsyeja", render: (row) => row.reason },
              { key: "expires", label: "Skadon", render: (row) => row.expires },
              {
                key: "actions", label: "", align: "right",
                render: (row) => (
                  <Button size="sm" variant="ghost" onClick={() => setBlocklist((cur) => cur.filter((b) => b.id !== row.id))}>
                    Hiq
                  </Button>
                ),
              },
            ]}
          />
        </div>

        {/* Decisions log */}
        {decisions.length > 0 && (
          <div className="space-y-3">
            <div>
              <h2 className="font-display text-xl text-unify-brown">Vendimet e sesionit</h2>
              <p className="text-sm text-muted-foreground">Këto janë vendimet e marra gjatë sesionit aktual.</p>
            </div>
            <AdminTable
              rows={decisions}
              getRowId={(row) => `${row.id}-${row.decidedAt}`}
              columns={[
                { key: "id", label: "Objekti", render: (row) => <span className="font-mono text-xs">{row.id}</span> },
                { key: "title", label: "Titulli", render: (row) => row.title },
                {
                  key: "decision", label: "Vendimi",
                  render: (row) => (
                    <Badge variant={row.decision === "approved" ? "success" : row.decision === "paused" ? "warning" : "destructive"}>
                      {row.decision}
                    </Badge>
                  ),
                },
                { key: "note", label: "Shënimi", render: (row) => row.note },
                { key: "time", label: "Koha", render: (row) => row.decidedAt },
              ]}
              empty={<p className="text-sm text-muted-foreground">Ende nuk ka vendime.</p>}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "primary" | "secondary" | "warning" | "destructive"
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <Badge variant={tone}>{label}</Badge>
        <p className="mt-3 font-display text-3xl text-unify-brown">{value}</p>
      </CardContent>
    </Card>
  )
}
