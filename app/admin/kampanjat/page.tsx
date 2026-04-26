"use client"

// ============================================================
// BRANCH: feat/admin-core
// FIGMA:
//   Admin — Kampanjat → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=41-2
// NOTION: https://www.notion.so/34874891227e812cb190ea4b86cfa9bc
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/_lib/useAuthLocal"
import { AdminActionMenu, AdminFilterBar, AdminTable } from "@/components/admin"
import { AdminLayout } from "@/components/layout"
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  ProgressBar,
  Separator,
  Skeleton,
  Textarea,
} from "@/components/ui"
import {
  ADMIN_LIFECYCLE_META,
  getAdminLifecycleActions,
  type AdminLifecycleStatus,
} from "@/app/admin/_lib/adminLifecycle"
import { apiFetch, type AdminCampaign } from "@/app/_lib/api"

type StatusFilter = "all" | AdminLifecycleStatus

// Map backend status strings → lifecycle status
function toLifecycle(s: string): AdminLifecycleStatus {
  const map: Record<string, AdminLifecycleStatus> = {
    PENDING: "review",
    ACTIVE: "active",
    PAUSED: "paused",
    REJECTED: "rejected",
    COMPLETED: "active",
    SUSPENDED: "paused",
  }
  return map[s] ?? "review"
}

type CampaignRow = AdminCampaign & { _lifecycle: AdminLifecycleStatus }

export default function AdminKampanjatPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [campaigns, setCampaigns] = React.useState<CampaignRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [editing, setEditing] = React.useState<CampaignRow | null>(null)
  const [note, setNote] = React.useState("")

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const res = await apiFetch<{ campaigns: AdminCampaign[]; total: number }>(
        "/admin/campaigns",
        { token }
      )
      setCampaigns(
        res.campaigns.map((c) => ({ ...c, _lifecycle: toLifecycle(c.status) }))
      )
    } catch {
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => { load() }, [load])

  const filtered = campaigns.filter((c) => {
    const matchesSearch = `${c.title} ${c.creator.name}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === "all" || c._lifecycle === status
    return matchesSearch && matchesStatus
  })

  // ── Mutations ──────────────────────────────────────────────
  const mutate = React.useCallback(
    async (path: string, method = "PATCH", body?: Record<string, unknown>) => {
      const token = await getToken()
      await apiFetch(path, {
        method,
        token,
        body: body ? JSON.stringify(body) : undefined,
      })
      await load()
    },
    [getToken, load]
  )

  const approve = (id: string) => mutate(`/admin/campaigns/${id}/approve`)
  const reject = (id: string) => mutate(`/admin/campaigns/${id}/reject`, "PATCH", { reason: note || "Refuzuar nga admin." })
  const toggleFeatured = (id: string) => mutate(`/admin/campaigns/${id}/featured`)

  const setCampaignStatus = (id: string, backendStatus: string, reason?: string) =>
    mutate(`/admin/campaigns/${id}/status`, "PATCH", { status: backendStatus, reason })

  const getCampaignActions = (c: CampaignRow) =>
    getAdminLifecycleActions({
      status: c._lifecycle,
      noun: "kampanjen",
      details: () => setEditing(c),
      preview: () => { router.push(`/kampanjat/${c.slug}`) },
      owner: () => { router.push(`/admin/perdoruesit/${c.creator.id}`) },
      approve: () => approve(c.id),
      pause: () => setCampaignStatus(c.id, "PAUSED", "Pauzuar nga admin."),
      resume: () => setCampaignStatus(c.id, "ACTIVE", "Riaktivizuar nga admin."),
      review: () => setCampaignStatus(c.id, "PENDING", "Kthyer ne review."),
      reject: () => reject(c.id),
      requestDocuments: () => setCampaignStatus(c.id, "PENDING", "Kerkohet dokumentacion shtese."),
      remove: () => setCampaignStatus(c.id, "REJECTED", "Arkivuar nga admin."),
    })

  return (
    <AdminLayout
      sidebar={{ activeKey: "campaigns" }}
      header={{
        title: "Kampanjat",
        description: "Menaxhim i kampanjave me veprime sipas statusit: review, aktive, pauzuar, refuzuar.",
        actions: (
          <div className="flex gap-2">
            <Button variant="outline" onClick={load}>Rifresko</Button>
            <Button onClick={() => { router.push("/kampanjat") }}>Shiko publiken</Button>
          </div>
        ),
        user: { name: "Unify Admin", role: "Internal" },
      }}
    >
      <div className="space-y-4">
        <AdminFilterBar
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Kerko kampanje ose krijues..."
          filters={[
            {
              key: "status",
              label: "Statusi",
              value: status,
              onChange: (v) => setStatus(v as StatusFilter),
              options: [
                { label: "Te gjitha", value: "all" },
                { label: "Review", value: "review" },
                { label: "Aktive", value: "active" },
                { label: "Pauzuar", value: "paused" },
                { label: "Refuzuar", value: "rejected" },
              ],
            },
          ]}
        />

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <AdminTable
            rows={filtered}
            getRowId={(row) => row.id}
            columns={[
              {
                key: "title",
                label: "Kampanja",
                render: (row) => (
                  <div>
                    <p className="font-bold text-unify-brown">{row.title}</p>
                    <p className="text-xs text-muted-foreground">{row.creator.name}</p>
                  </div>
                ),
              },
              {
                key: "category",
                label: "Kategoria",
                render: (row) => (
                  <div>
                    <p>{row.category}</p>
                    <p className="text-xs text-muted-foreground">{row.location}</p>
                  </div>
                ),
              },
              {
                key: "money",
                label: "Mbledhur",
                render: (row) => (
                  <div className="min-w-40">
                    <p>
                      €{row.currentAmount.toLocaleString()} / {row.targetAmount.toLocaleString()}
                    </p>
                    <ProgressBar
                      value={Math.min(100, Math.round((row.currentAmount / row.targetAmount) * 100))}
                      className="mt-2"
                    />
                  </div>
                ),
              },
              {
                key: "featured",
                label: "Featured",
                render: (row) => (
                  <Button
                    size="sm"
                    variant={row.isFeatured ? "primary" : "outline"}
                    onClick={() => toggleFeatured(row.id)}
                  >
                    {row.isFeatured ? "Featured" : "Jo"}
                  </Button>
                ),
              },
              {
                key: "status",
                label: "Status",
                render: (row) => (
                  <Badge variant={ADMIN_LIFECYCLE_META[row._lifecycle].variant}>
                    {ADMIN_LIFECYCLE_META[row._lifecycle].label}
                  </Badge>
                ),
              },
              {
                key: "donors",
                label: "Donatorë",
                align: "center",
                render: (row) => <span>{row._count.donations}</span>,
              },
              {
                key: "actions",
                label: "",
                align: "right",
                render: (row) => <AdminActionMenu items={getCampaignActions(row)} />,
              },
            ]}
            empty={<p className="text-sm text-muted-foreground">Nuk u gjet asnje kampanje me keto filtra.</p>}
          />
        )}
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => { if (!open) { setEditing(null); setNote("") } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detaje dhe kontroll i kampanjes</DialogTitle>
            <DialogDescription>
              Veprimet ndryshojne sipas statusit aktual. Shtypni Aprovo/Refuzo per te ruajtur ne backend.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <Input value={editing.title} readOnly />
                <Input value={editing.category} readOnly />
                <Input value={editing.location} readOnly />
                <Input value={`€${editing.targetAmount.toLocaleString()}`} readOnly />
              </div>
              <Card>
                <CardContent className="grid gap-4 p-4 text-sm md:grid-cols-3">
                  <Info label="Creator" value={editing.creator.name} />
                  <Info label="Email" value={editing.creator.email} />
                  <Info label="Donatorë" value={`${editing._count.donations}`} />
                  <Info label="Mbledhur" value={`€${editing.currentAmount.toLocaleString()}`} />
                  <Info label="Target" value={`€${editing.targetAmount.toLocaleString()}`} />
                  <Info label="Featured" value={editing.isFeatured ? "Po" : "Jo"} />
                </CardContent>
              </Card>
              <Separator />
              <Textarea
                placeholder="Arsye aprovimi/refuzimi ose shenim per moderim..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex flex-wrap gap-3">
                {editing._lifecycle === "review" && (
                  <>
                    <Button onClick={() => { approve(editing.id); setEditing(null) }}>
                      Aprovo dhe publiko
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => { reject(editing.id); setEditing(null) }}
                    >
                      Refuzo
                    </Button>
                  </>
                )}
                {editing._lifecycle === "active" && (
                  <Button variant="outline" onClick={() => { setCampaignStatus(editing.id, "PAUSED", "Pauzuar nga admin."); setEditing(null) }}>
                    Pauzo kampanjen
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => toggleFeatured(editing.id)}
                >
                  {editing.isFeatured ? "Hiq featured" : "Shto featured"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { router.push(`/kampanjat/${editing.slug}`) }}
                >
                  Preview publik
                </Button>
                <Button variant="ghost" onClick={() => setEditing(null)}>Mbyll</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
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

