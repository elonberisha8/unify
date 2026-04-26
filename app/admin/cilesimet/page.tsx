"use client"

// ============================================================
// BRANCH: feat/admin-core
// FIGMA:
//   Admin - Cilesimet -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=44-2
// NOTION: https://www.notion.so/34874891227e812cb190ea4b86cfa9bc
// ============================================================

import * as React from "react"
import { useAuth } from "@clerk/nextjs"
import { AdminSettingsCard, AdminTable, AdminToggleSwitch } from "@/components/admin"
import { AdminLayout } from "@/components/layout"
import { Badge, Button, Input, Skeleton } from "@/components/ui"
import { apiFetch } from "@/app/_lib/api"

interface NetworkRule {
  id: string
  type: "allow" | "block"
  value: string
  note: string
}

type AdminSettings = Record<
  "holdCampaignsForReview" |
  "autoBlockReportedAccounts" |
  "requireCreatorIdentity" |
  "allowAutoBlogPublishing" |
  "notifyLargeDonations",
  boolean
>

const SETTING_LABELS: { key: keyof AdminSettings; label: string }[] = [
  { key: "holdCampaignsForReview", label: "Mbaj kampanjat ne review para publikimit" },
  { key: "autoBlockReportedAccounts", label: "Blloko automatikisht llogari me 3+ raportime" },
  { key: "requireCreatorIdentity", label: "Kerko verifikim identiteti per krijues" },
  { key: "allowAutoBlogPublishing", label: "Lejo publikim automatik te blogut" },
  { key: "notifyLargeDonations", label: "Njofto adminin ne email per donacione te medha" },
]

const DEFAULT_SETTINGS: AdminSettings = {
  holdCampaignsForReview: true,
  autoBlockReportedAccounts: true,
  requireCreatorIdentity: true,
  allowAutoBlogPublishing: false,
  notifyLargeDonations: true,
}

export default function AdminCilesimetPage() {
  const { getToken } = useAuth()
  const [rules, setRules] = React.useState<NetworkRule[]>([])
  const [settings, setSettings] = React.useState<AdminSettings>(DEFAULT_SETTINGS)
  const [newRule, setNewRule] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const res = await apiFetch<{ rules: NetworkRule[]; settings: AdminSettings }>("/admin/settings", { token })
      setRules(res.rules)
      setSettings({ ...DEFAULT_SETTINGS, ...res.settings })
    } catch {
      setRules([])
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => { load() }, [load])

  const addRule = async (type: NetworkRule["type"]) => {
    const value = newRule.trim()
    if (!value) return
    try {
      const token = await getToken()
      await apiFetch("/admin/settings/network-rules", {
        method: "POST",
        token,
        body: JSON.stringify({
          type,
          value,
          note: type === "allow" ? "Allowed network" : "Blocked network",
        }),
      })
      setNewRule("")
      await load()
    } catch { /* keep current */ }
  }

  const removeRule = async (id: string) => {
    setRules((current) => current.filter((rule) => rule.id !== id))
    try {
      const token = await getToken()
      await apiFetch(`/admin/settings/network-rules/${id}`, { method: "DELETE", token })
    } catch { /* keep optimistic removal */ }
  }

  const toggleSetting = async (key: keyof AdminSettings, value: boolean) => {
    setSettings((current) => ({ ...current, [key]: value }))
    try {
      const token = await getToken()
      await apiFetch(`/admin/settings/toggles/${key}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ value }),
      })
    } catch { /* keep optimistic state */ }
  }

  return (
    <AdminLayout
      sidebar={{ activeKey: "settings" }}
      header={{
        title: "Cilesimet",
        description: "Kontroll i aksesit intern, moderimit dhe rregullave te platformes.",
        user: { name: "Unify Admin", role: "Internal" },
        actions: <Button variant="outline" onClick={load}>Rifresko</Button>,
      }}
    >
      <div className="space-y-5">
        <AdminSettingsCard
          title="Network access policy"
          description="Pa login per momentin. Admin duhet mbrojtur me VPN, IP allowlist ose reverse proxy para deploy publik."
          action={<Badge variant="warning">Critical before production</Badge>}
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <Input value={newRule} onChange={(event) => setNewRule(event.target.value)} placeholder="p.sh. 10.20.0.0/16 ose IP statike" />
            <Button onClick={() => addRule("allow")}>Shto allow</Button>
            <Button variant="outline" onClick={() => addRule("block")}>Shto block</Button>
          </div>
          {loading ? (
            <Skeleton className="mt-4 h-32 w-full rounded-2xl" />
          ) : (
            <AdminTable
              className="mt-4"
              rows={rules}
              getRowId={(row) => row.id}
              columns={[
                { key: "type", label: "Tipi", render: (row) => <Badge variant={row.type === "allow" ? "success" : "destructive"}>{row.type}</Badge> },
                { key: "value", label: "CIDR/IP", render: (row) => <span className="font-mono text-xs">{row.value}</span> },
                { key: "note", label: "Shenim", render: (row) => row.note || "-" },
                { key: "actions", label: "", align: "right", render: (row) => <Button size="sm" variant="ghost" onClick={() => removeRule(row.id)}>Fshi</Button> },
              ]}
              empty={<p className="text-sm text-muted-foreground">Nuk ka network rules ne DB.</p>}
            />
          )}
        </AdminSettingsCard>

        <AdminSettingsCard title="Moderim automatik" description="Rregulla qe admini mund t'i ndeze ose fik per kontroll.">
          <div className="space-y-4">
            {SETTING_LABELS.map((item) => (
              <AdminToggleSwitch
                key={item.key}
                label={item.label}
                checked={settings[item.key]}
                onCheckedChange={(value) => toggleSetting(item.key, value)}
              />
            ))}
          </div>
        </AdminSettingsCard>
      </div>
    </AdminLayout>
  )
}

