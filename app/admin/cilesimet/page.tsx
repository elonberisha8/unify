"use client"

// ============================================================
// BRANCH: feat/admin-core
// FIGMA:
//   Admin — Cilesimet → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=44-2
// NOTION: https://www.notion.so/34874891227e812cb190ea4b86cfa9bc
// ============================================================

import * as React from "react"
import { AdminSettingsCard, AdminTable, AdminToggleSwitch } from "@/components/admin"
import { AdminLayout } from "@/components/layout"
import { Badge, Button, Input } from "@/components/ui"

interface NetworkRule {
  id: string
  type: "allow" | "block"
  value: string
  note: string
}

const INITIAL_RULES: NetworkRule[] = [
  { id: "n-1", type: "allow", value: "10.0.0.0/24", note: "Zyra / VPN private" },
  { id: "n-2", type: "allow", value: "192.168.1.0/24", note: "Lab lokal" },
  { id: "n-3", type: "block", value: "0.0.0.0/0", note: "Publiku bllokohet ne proxy" },
]

export default function AdminCilesimetPage() {
  const [rules, setRules] = React.useState(INITIAL_RULES)
  const [newRule, setNewRule] = React.useState("")

  const addRule = (type: NetworkRule["type"]) => {
    if (!newRule.trim()) return
    setRules((current) => [
      ...current,
      { id: `n-${Date.now()}`, type, value: newRule.trim(), note: type === "allow" ? "Allowed network" : "Blocked network" },
    ])
    setNewRule("")
  }

  return (
    <AdminLayout
      sidebar={{ activeKey: "settings" }}
      header={{
        title: "Cilesimet",
        description: "Kontroll i aksesit intern, moderimit dhe rregullave te platformes.",
        user: { name: "Unify Admin", role: "Internal" },
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
          <AdminTable
            className="mt-4"
            rows={rules}
            getRowId={(row) => row.id}
            columns={[
              { key: "type", label: "Tipi", render: (row) => <Badge variant={row.type === "allow" ? "success" : "destructive"}>{row.type}</Badge> },
              { key: "value", label: "CIDR/IP", render: (row) => <span className="font-mono text-xs">{row.value}</span> },
              { key: "note", label: "Shenim", render: (row) => row.note },
              { key: "actions", label: "", align: "right", render: (row) => <Button size="sm" variant="ghost" onClick={() => {
                if (!window.confirm("A je i sigurt qe do ta heqesh kete network rule?")) return
                setRules((current) => current.filter((rule) => rule.id !== row.id))
              }}>Fshi</Button> },
            ]}
          />
        </AdminSettingsCard>

        <AdminSettingsCard title="Moderim automatik" description="Rregulla qe admini mund t'i ndeze ose fik per kontroll.">
          <div className="space-y-4">
            <AdminToggleSwitch label="Mbaj kampanjat ne review para publikimit" defaultChecked />
            <AdminToggleSwitch label="Blloko automatikisht llogari me 3+ raportime" defaultChecked />
            <AdminToggleSwitch label="Kerko verifikim identiteti per krijues" defaultChecked />
            <AdminToggleSwitch label="Lejo publikim automatik te blogut" />
            <AdminToggleSwitch label="Njofto adminin ne email per donacione te medha" defaultChecked />
          </div>
        </AdminSettingsCard>
      </div>
    </AdminLayout>
  )
}
