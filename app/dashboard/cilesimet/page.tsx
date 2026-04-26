"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout"
import { Button, Card, CardContent, Separator, Switch } from "@/components/ui"

const PRIVACY_SETTINGS = [
  {
    key: "publicProfile",
    title: "Profili publik",
    description: "Lejo që profili yt të shfaqet në faqen publike dhe në kartat e kampanjave.",
    defaultValue: true,
  },
  {
    key: "showDonationHistory",
    title: "Shfaq historinë e donacioneve",
    description: "Trego kontributet e tua publike në profil, përveç donacioneve anonime.",
    defaultValue: true,
  },
  {
    key: "showVolunteerActivity",
    title: "Shfaq aktivitetin vullnetar",
    description: "Lejo që aplikimet dhe ndihmat e pranuara të shfaqen si aktivitet publik.",
    defaultValue: false,
  },
  {
    key: "allowMessages",
    title: "Lejo mesazhe nga komuniteti",
    description: "Përdoruesit e verifikuar mund të të kontaktojnë për kampanja ose shpallje.",
    defaultValue: true,
  },
] as const

type PrivacyKey = (typeof PRIVACY_SETTINGS)[number]["key"]

export default function DashboardCilesimetPage() {
  const [settings, setSettings] = React.useState<Record<PrivacyKey, boolean>>(() =>
    PRIVACY_SETTINGS.reduce(
      (acc, item) => ({ ...acc, [item.key]: item.defaultValue }),
      {} as Record<PrivacyKey, boolean>
    )
  )
  const [saving, setSaving] = React.useState(false)

  const updateSetting = (key: PrivacyKey, value: boolean) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await Promise.resolve()
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout activeKey="settings">
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cilësimet</h1>
          <p className="mt-1 text-sm text-gray-500">
            Menaxho privatësinë dhe mënyrën si shfaqet profili yt në Unify.
          </p>
        </div>

        <Card>
          <CardContent className="space-y-6 p-6">
            <div>
              <h2 className="text-lg font-bold text-unify-brown">Privacy Settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Këto 4 cilësime kontrollojnë çfarë shihet publikisht nga komuniteti.
              </p>
            </div>

            <Separator />

            <div className="space-y-5">
              {PRIVACY_SETTINGS.map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-6 rounded-2xl border border-border bg-white p-4">
                  <div>
                    <p className="font-bold text-unify-brown">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={settings[item.key]}
                    onCheckedChange={(checked) => updateSetting(item.key, checked)}
                    aria-label={item.title}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={saveSettings} disabled={saving}>
                {saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
