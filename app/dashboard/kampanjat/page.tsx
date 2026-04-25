"use client";

// ============================================================
// BRANCH: feat/dashboard-campaigns
// FIGMA:
//   • Dashboard — Kampanjat → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=80-2
// NOTION: https://www.notion.so/34874891227e8166b6e1db98166ca406
// ============================================================

import * as React from "react";
import { useRouter } from "next/navigation";
import { CampaignTable } from "@/components/dashboard";
import { Button } from "@/components/ui";
import { DashboardLayout } from "@/components/layout";

const MOCK_CAMPAIGNS = [
  { id: "1", title: "Ndihmo familjet në nevojë", status: "active" as const, raised: 3200, goal: 5000, currency: "€", donorCount: 48, createdAt: "10 Mar 2026" },
  { id: "2", title: "Bursa studentore 2025", status: "active" as const, raised: 1800, goal: 3000, currency: "€", donorCount: 22, createdAt: "1 Feb 2026" },
  { id: "3", title: "Rindërtimi i bibliotekës", status: "draft" as const, raised: 0, goal: 8000, currency: "€", donorCount: 0, createdAt: "20 Apr 2026" },
  { id: "4", title: "Ndihma dimërore", status: "completed" as const, raised: 5000, goal: 5000, currency: "€", donorCount: 130, createdAt: "1 Nov 2025" },
];

export default function DashKampanjaPage() {
  const router = useRouter();

  return (
    <DashboardLayout activeKey="kampanjat">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kampanjat e mia</h1>
            <p className="text-sm text-gray-500 mt-1">Menaxho të gjitha kampanjat që ke krijuar.</p>
          </div>
          <Button onClick={() => router.push("/dashboard/krijo/kampanje")}>
            + Krijo kampanjë
          </Button>
        </div>

        <CampaignTable
          campaigns={MOCK_CAMPAIGNS}
          onRowClick={(id) => router.push(`/kampanjat/${id}`)}
        />
      </div>
    </DashboardLayout>
  );
}
