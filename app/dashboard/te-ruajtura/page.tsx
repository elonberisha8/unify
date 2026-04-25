"use client";

// ============================================================
// BRANCH: feat/dashboard-home
// FIGMA:
//   • Dashboard — Ruajtura → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=83-2
// NOTION: https://www.notion.so/34874891227e81f2a6e0ec234fd70570
// ============================================================

import * as React from "react";
import { useState } from "react";
import { CampaignCard, VolunteerCard } from "@/components/public";
import { EmptyState, DashboardLayout } from "@/components/layout";

const MOCK_SAVED_CAMPAIGNS = [
  { id: "1", title: "Ndihmo familjet në nevojë", description: "Mblidh donacione për familjet që kanë nevojë për strehim dhe ushqim.", raised: 3200, goal: 5000, currency: "€", donorCount: 48, daysLeft: 12, bookmarked: true },
  { id: "2", title: "Bursa studentore 2025", description: "Ndihmo studentët e talentuar të arrijnë potencialin e tyre.", raised: 1800, goal: 3000, currency: "€", donorCount: 22, daysLeft: 30, bookmarked: true },
];

const MOCK_SAVED_LISTINGS = [
  { title: "Mësues vullnetar i gjuhës angleze", organization: "OJQ Drita", location: "Prishtinë", hoursPerWeek: "4 orë/javë", startDate: "1 Maj 2026", applicantCount: 12, skills: ["Anglisht", "Mësimdhënie"] },
];

type Tab = "kampanja" | "shpallje";

export default function TeRuajturаPage() {
  const [tab, setTab] = useState<Tab>("kampanja");

  return (
    <DashboardLayout activeKey="te-ruajtura">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Të ruajtura</h1>
          <p className="text-sm text-gray-500 mt-1">Kampanjat dhe shpalljet që ke ruajtur.</p>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setTab("kampanja")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${tab === "kampanja" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Kampanja ({MOCK_SAVED_CAMPAIGNS.length})
          </button>
          <button
            onClick={() => setTab("shpallje")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${tab === "shpallje" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Shpallje ({MOCK_SAVED_LISTINGS.length})
          </button>
        </div>

        {tab === "kampanja" && (
          <>
            {MOCK_SAVED_CAMPAIGNS.length === 0 ? (
              <EmptyState
                title="Asnjë fushatë e ruajtur"
                description="Ruaj kampanjat që të interesojnë për t'i gjetur lehtë."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_SAVED_CAMPAIGNS.map((c) => (
                  <CampaignCard key={c.id} {...c} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "shpallje" && (
          <>
            {MOCK_SAVED_LISTINGS.length === 0 ? (
              <EmptyState
                title="Asnjë shpallje e ruajtur"
                description="Ruaj shpalljet e vullnetarizmit që të interesojnë."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_SAVED_LISTINGS.map((l, i) => (
                  <VolunteerCard key={i} {...l} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
