"use client"

// ============================================================
// BRANCH: feat/admin-moderation
// FIGMA:
//   Admin — Audit Log → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=39-2
// NOTION: https://www.notion.so/34874891227e8145ac16f2b024b58fc0
// ============================================================

import * as React from "react"
import { useAuth } from "@/app/_lib/useAuthLocal"
import { AuditLogTable, type AuditLogEntry } from "@/components/admin"
import { AdminLayout } from "@/components/layout"
import { Button, Skeleton } from "@/components/ui"
import { apiFetch } from "@/app/_lib/api"

export default function AdminAuditLogPage() {
  const { getToken } = useAuth()
  const [entries, setEntries] = React.useState<AuditLogEntry[]>([])
  const [loading, setLoading] = React.useState(true)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const res = await apiFetch<AuditLogEntry[] | { entries: AuditLogEntry[] }>(
        "/admin/audit-log",
        { token }
      )
      const data = Array.isArray(res) ? res : ((res as { entries?: AuditLogEntry[] }).entries ?? [])
      setEntries(data)
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => { load() }, [load])

  return (
    <AdminLayout
      sidebar={{ activeKey: "audit" }}
      header={{
        title: "Audit Log",
        description: "Gjurmim i veprimeve sensitive brenda admin-it.",
        user: { name: "Unify Admin", role: "Internal" },
        actions: <Button variant="outline" onClick={load}>Rifresko</Button>,
      }}
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <AuditLogTable entries={entries} />
      )}
    </AdminLayout>
  )
}

