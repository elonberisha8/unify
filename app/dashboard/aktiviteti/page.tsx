"use client";

// ============================================================
// BRANCH: feat/dashboard-home
// FIGMA:
//   • Dashboard — Audit Log → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=34-2
// NOTION: https://www.notion.so/34874891227e81f2a6e0ec234fd70570
// ============================================================

import * as React from "react";
import { ActivityLogItem } from "@/components/dashboard";
import { DashboardLayout } from "@/components/layout";

const MOCK_ACTIVITY = [
  { id: "1", action: "dha donacion për", target: "Ndihmo familjet në nevojë", timestamp: "2 orë më parë", actor: { name: "Arta Krasniqi" } },
  { id: "2", action: "u regjistrua si vullnetar për", target: "Bursa studentore 2025", timestamp: "5 orë më parë", actor: { name: "Besnik Hoxha" } },
  { id: "3", action: "krijoi kampanjën", target: "Rindërtimi i bibliotekës", timestamp: "1 ditë më parë", actor: { name: "Ti" } },
  { id: "4", action: "dha donacion për", target: "Bursa studentore 2025", timestamp: "2 ditë më parë", actor: { name: "Lirije Gashi" } },
  { id: "5", action: "shtoi një foto në kampanjën", target: "Ndihmo familjet në nevojë", timestamp: "3 ditë më parë", actor: { name: "Ti" } },
  { id: "6", action: "dha donacion për", target: "Rindërtimi i bibliotekës", timestamp: "4 ditë më parë", actor: { name: "Mirlinda Berisha" } },
  { id: "7", action: "ndryshoi statusin e kampanjës", target: "Bursa studentore 2025", timestamp: "5 ditë më parë", actor: { name: "Ti" } },
  { id: "8", action: "u largua nga vullnetarizmi për", target: "Ndihmo familjet në nevojë", timestamp: "1 javë më parë", actor: { name: "Agron Bajrami" } },
];

export default function AktivitetiPage() {
  return (
    <DashboardLayout activeKey="aktiviteti">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aktiviteti</h1>
          <p className="text-sm text-gray-500 mt-1">Historia e plotë e veprimeve në llogarinë tënde.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {MOCK_ACTIVITY.map((item) => (
            <div key={item.id} className="px-4 py-3">
              <ActivityLogItem
                actor={item.actor}
                action={item.action}
                target={item.target}
                timestamp={item.timestamp}
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
