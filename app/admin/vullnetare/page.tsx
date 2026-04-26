"use client"

// ============================================================
// BRANCH: feat/admin-core
// FIGMA:
//   Admin — Vullnetare → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=42-2
// NOTION: https://www.notion.so/34874891227e812cb190ea4b86cfa9bc
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
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
  Separator,
  Skeleton,
  Textarea,
} from "@/components/ui"
import {
  ADMIN_LIFECYCLE_META,
  getAdminLifecycleActions,
  type AdminLifecycleStatus,
} from "@/app/admin/_lib/adminLifecycle"
import { apiFetch, type AdminVolunteer } from "@/app/_lib/api"

type ListingRow = AdminVolunteer & { _lifecycle: AdminLifecycleStatus }

function toLifecycle(s: string): AdminLifecycleStatus {
  const map: Record<string, AdminLifecycleStatus> = {
    PENDING: "review",
    ACTIVE: "active",
    PAUSED: "paused",
    REJECTED: "rejected",
    IN_REVIEW: "paused",
    CLAIMED: "active",
    CLOSED: "rejected",
  }
  return map[s] ?? "review"
}

export default function AdminVullnetarePage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [listings, setListings] = React.useState<ListingRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [editing, setEditing] = React.useState<ListingRow | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const data = await apiFetch<AdminVolunteer[]>("/admin/volunteers", { token })
      setListings(data.map((l) => ({ ...l, _lifecycle: toLifecycle(l.status) })))
    } catch {
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => { load() }, [load])

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

  const setListingStatus = (id: string, backendStatus: string, reason?: string) =>
    mutate(`/admin/volunteers/${id}/status`, "PATCH", { status: backendStatus, reason })

  const filtered = listings.filter((l) => {
    const matchesSearch = `${l.title} ${l.owner.name} ${l.location}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === "all" || l._lifecycle === status
    return matchesSearch && matchesStatus
  })

  const getListingActions = (listing: ListingRow) =>
    getAdminLifecycleActions({
      status: listing._lifecycle,
      noun: "shpalljen",
      details: () => setEditing(listing),
      preview: () => { router.push(`/vullnetare/${listing.id}`) },
      owner: () => { router.push(`/admin/perdoruesit/${listing.owner.id}`) },
      approve: () => mutate(`/admin/volunteers/${listing.id}/approve`),
      pause: () => setListingStatus(listing.id, "PAUSED", "Pauzuar nga admin."),
      resume: () => mutate(`/admin/volunteers/${listing.id}/approve`),
      review: () => setListingStatus(listing.id, "PENDING", "Kthyer ne review."),
      reject: () => mutate(`/admin/volunteers/${listing.id}/reject`),
      remove: () => setListingStatus(listing.id, "REJECTED", "Arkivuar nga admin."),
    })

  return (
    <AdminLayout
      sidebar={{ activeKey: "volunteers" }}
      header={{
        title: "Vullnetare",
        description: "Menaxhim i shpalljeve vullnetare me veprime sipas statusit aktual.",
        actions: (
          <div className="flex gap-2">
            <Button variant="outline" onClick={load}>Rifresko</Button>
            <Button onClick={() => { router.push("/shpalljet") }}>Shiko shpalljet</Button>
          </div>
        ),
        user: { name: "Unify Admin", role: "Internal" },
      }}
    >
      <div className="space-y-4">
        <AdminFilterBar
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Kerko shpallje, owner ose lokacion..."
          filters={[
            {
              key: "status",
              label: "Statusi",
              value: status,
              onChange: setStatus,
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
                label: "Shpallja",
                render: (row) => (
                  <div>
                    <p className="font-bold text-unify-brown">{row.title}</p>
                    <p className="text-xs text-muted-foreground">{row.owner.name}</p>
                  </div>
                ),
              },
              { key: "category", label: "Kategoria", render: (row) => row.category },
              { key: "location", label: "Lokacioni", render: (row) => row.location },
              {
                key: "applicants",
                label: "Aplikime",
                align: "center",
                render: (row) => <span>{row._count.applications}</span>,
              },
              {
                key: "anonymous",
                label: "Anonim",
                render: (row) => (
                  <Badge variant={row.isAnonymous ? "secondary" : "success"}>
                    {row.isAnonymous ? "Anonim" : "Publik"}
                  </Badge>
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
                key: "actions",
                label: "",
                align: "right",
                render: (row) => <AdminActionMenu items={getListingActions(row)} />,
              },
            ]}
            empty={<p className="text-sm text-muted-foreground">Nuk u gjet asnje shpallje vullnetare me keto filtra.</p>}
          />
        )}
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detaje dhe kontroll i shpalljes</DialogTitle>
            <DialogDescription>Veprimet kryesore ndryshojne sipas statusit te shpalljes.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <Card>
                <CardContent className="grid gap-4 p-4 text-sm md:grid-cols-2">
                  <Info label="Titulli" value={editing.title} />
                  <Info label="Kategoria" value={editing.category} />
                  <Info label="Lokacioni" value={editing.location} />
                  <Info label="Owner" value={`${editing.owner.name} — ${editing.owner.email}`} />
                  <Info label="Aplikime" value={`${editing._count.applications}`} />
                  <Info label="Anonim" value={editing.isAnonymous ? "Po" : "Jo"} />
                </CardContent>
              </Card>
              <Separator />
              <Textarea placeholder="Shenim i brendshem..." />
              <div className="flex flex-wrap gap-3">
                {editing._lifecycle === "review" && (
                  <Button onClick={() => { mutate(`/admin/volunteers/${editing.id}/approve`); setEditing(null) }}>
                    Aprovo shpalljen
                  </Button>
                )}
                {editing._lifecycle === "active" && (
                  <Button variant="outline" onClick={() => { setListingStatus(editing.id, "PAUSED", "Pauzuar nga admin."); setEditing(null) }}>
                    Pauzo shpalljen
                  </Button>
                )}
                {editing._lifecycle !== "rejected" && (
                  <Button variant="destructive" onClick={() => { mutate(`/admin/volunteers/${editing.id}/reject`); setEditing(null) }}>
                    Refuzo
                  </Button>
                )}
                <Button variant="outline" onClick={() => { router.push(`/vullnetare/${editing.id}`) }}>
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
