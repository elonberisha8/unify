"use client";

// ============================================================
// BRANCH: feat/dashboard-profile
// FIGMA:
//   • Dashboard — Profili → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=85-2
// NOTION: https://www.notion.so/34874891227e8188a4d5e1c80adc017a
// ============================================================

import * as React from "react";
import { ProfileForm, ImageUploadZone } from "@/components/dashboard";
import { DashboardLayout } from "@/components/layout";

export default function ProfilPage() {
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>();

  return (
    <DashboardLayout activeKey="profili">
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profili im</h1>
          <p className="text-sm text-gray-500 mt-1">Menaxho informacionin e llogarisë tënde.</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Foto e profilit</p>
          <ImageUploadZone
            value={avatarUrl}
            onChange={(file) => setAvatarUrl(file ? URL.createObjectURL(file) : undefined)}
            label="Ngarko foto"
            hint="JPG, PNG deri 5 MB"
            aspect="square"
            className="max-w-xs"
          />
        </div>

        <ProfileForm
          initial={{ avatarUrl }}
          onSave={async (data) => {
            await fetch("/api/profile", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
          }}
        />
      </div>
    </DashboardLayout>
  );
}
