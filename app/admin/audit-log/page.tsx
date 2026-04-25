"use client"

// ============================================================
// BRANCH: feat/admin-moderation
// FIGMA:
//   Admin — Audit Log → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=39-2
// NOTION: https://www.notion.so/34874891227e8145ac16f2b024b58fc0
// ============================================================

import * as React from "react"
import { useAuth } from "@clerk/nextjs"
import { AuditLogTable, type AuditLogEntry } from "@/components/admin"
import { AdminLayout } from "@/components/layout"
import { Button, Skeleton } from "@/components/ui"
import { apiFetch } from "@/app/_lib/api"

const FALLBACK_ENTRIES: AuditLogEntry[] = [
  { id: "a1", timestamp: "2026-04-25 10:42", actor: "admin@unify.local", action: "approved_campaign", target: "K-102", ip: "10.0.0.12", severity: "info" },
  { id: "a2", timestamp: "2026-04-25 10:35", actor: "system", action: "webhook_received", target: "stripe", ip: "10.0.0.5", severity: "info" },
  { id: "a3", timestamp: "2026-04-25 09:58", actor: "moderator", action: "flagged_user", target: "u-102", ip: "10.0.0.14", severity: "warning" },
]

export default function AdminAuditLogPage() {
  const { getToken } = useAuth()
  const [entries, setEntries] = React.useState<AuditLogEntry[]>(FALLBACK_ENTRIES)
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
      if (data.length > 0) setEntries(data)
    } catch {
      // keep fallback entries
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
