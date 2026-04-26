"use client"

// ============================================================
// BRANCH: feat/admin-moderation
// FIGMA:
//   Admin — Perdoruesit → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=35-2
// NOTION: https://www.notion.so/34874891227e8145ac16f2b024b58fc0
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { AdminActionMenu, AdminFilterBar, AdminTable, type AdminActionMenuItem } from "@/components/admin"
import { AdminLayout } from "@/components/layout"
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/components/ui"
import { apiFetch, type AdminUser } from "@/app/_lib/api"

const statusVariant = {
  active: "success",
  pending: "warning",
  blocked: "destructive",
} as const

const verificationLabel: Record<string, string> = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
}

export default function AdminPerdoruesitPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [editing, setEditing] = React.useState<AdminUser | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const res = await apiFetch<{ users: AdminUser[]; total: number }>(
        "/admin/users",
        { token }
      )
      setUsers(res.users)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => { load() }, [load])

  const mutate = React.useCallback(
    async (path: string, body?: Record<string, unknown>) => {
      const token = await getToken()
      await apiFetch(path, { method: "PATCH", token, body: body ? JSON.stringify(body) : undefined })
      await load()
    },
    [getToken, load]
  )

  const filtered = users.filter((u) => {
    const matchesSearch = `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getUserActions = (user: AdminUser): AdminActionMenuItem[] => {
    const actions: AdminActionMenuItem[] = [
      { label: "Hap detajet", onClick: () => { router.push(`/admin/perdoruesit/${user.id}`) } },
      { label: "Edito user-in", onClick: () => setEditing(user) },
    ]

    if (!user.isVerified) {
      actions.push({
        label: "Verifiko manualisht",
        onClick: () => mutate(`/admin/users/${user.id}/verify`),
      })
    }

    if (user.isBanned) {
      actions.push({
        label: "Zhblloko user-in",
        onClick: () => mutate(`/admin/users/${user.id}/ban`),
      })
    } else {
      actions.push({
        label: "Blloko user-in",
        onClick: () => mutate(`/admin/users/${user.id}/ban`),
        destructive: true,
        confirmLabel: "A je i sigurt qe do ta bllokosh kete user?",
      })
    }

    return actions
  }

  return (
    <AdminLayout
      sidebar={{ activeKey: "users" }}
      header={{
        title: "Perdoruesit",
        description: "Vetem usera te regjistruar ne Unify. Admini nuk shfaqet si user normal.",
        user: { name: "Unify Admin", role: "Internal" },
        actions: <Button variant="outline" onClick={load}>Rifresko</Button>,
      }}
    >
      <div className="space-y-4">
        <AdminFilterBar
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Kerko emer ose email..."
          filters={[
            {
              key: "role",
              label: "Roli",
              value: roleFilter,
              onChange: setRoleFilter,
              options: [
                { label: "Te gjithe", value: "all" },
                { label: "User", value: "USER" },
                { label: "Moderator", value: "MODERATOR" },
                { label: "Admin", value: "ADMIN" },
              ],
            },
          ]}
        />

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <AdminTable
            rows={filtered}
            getRowId={(row) => row.id}
            columns={[
              {
                key: "user",
                label: "User",
                render: (row) => (
                  <button
                    className="text-left"
                    onClick={() => { router.push(`/admin/perdoruesit/${row.id}`) }}
                  >
                    <p className="font-bold text-unify-brown">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                  </button>
                ),
              },
              {
                key: "role",
                label: "Roli",
                render: (row) => (
                  <Badge variant={row.role === "ADMIN" ? "destructive" : row.role === "MODERATOR" ? "warning" : "secondary"}>
                    {verificationLabel[row.role] ?? row.role}
                  </Badge>
                ),
              },
              {
                key: "status",
                label: "Statusi",
                render: (row) => (
                  <Badge variant={row.isBanned ? statusVariant.blocked : statusVariant.active}>
                    {row.isBanned ? "blocked" : "active"}
                  </Badge>
                ),
              },
              {
                key: "verified",
                label: "Verifikuar",
                render: (row) => (
                  <Badge variant={row.isVerified ? "success" : "secondary"}>
                    {row.isVerified ? "verified" : "unverified"}
                  </Badge>
                ),
              },
              {
                key: "activity",
                label: "Aktiviteti",
                render: (row) => (
                  <span>{row._count.campaigns} kampanja · {row._count.donations} donacione</span>
                ),
              },
              {
                key: "joined",
                label: "Anëtarësuar",
                render: (row) => new Date(row.createdAt).toLocaleDateString("sq-AL"),
              },
              {
                key: "actions",
                label: "",
                align: "right",
                render: (row) => <AdminActionMenu items={getUserActions(row)} />,
              },
            ]}
            empty={<p className="text-sm text-muted-foreground">Nuk u gjet asnje user.</p>}
          />
        )}
      </div>

      {/* Edit role dialog */}
      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ndrysho rolin</DialogTitle>
            <DialogDescription>Ndrysho rolin e perdoruesit ne sistem.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-unify-brown">{editing.name} — {editing.email}</p>
              <Select
                value={editing.role}
                onValueChange={(role) => setEditing({ ...editing, role })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="MODERATOR">Moderator</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    await mutate(`/admin/users/${editing.id}/role`, { role: editing.role })
                    setEditing(null)
                  }}
                >
                  Ruaj
                </Button>
                <Button variant="ghost" onClick={() => setEditing(null)}>Anulo</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
