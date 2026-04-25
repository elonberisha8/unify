"use client";

// ============================================================
// BRANCH: feat/dashboard-home
// FIGMA:
//   • Dashboard — Transaksionet → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=79-2
// NOTION: https://www.notion.so/34874891227e81f2a6e0ec234fd70570
// ============================================================

import * as React from "react";
import { TransactionTable } from "@/components/dashboard";
import { DashboardLayout } from "@/components/layout";

const MOCK_TRANSACTIONS = [
  { id: "tx1", date: "24 Apr 2026", donor: "Arta Krasniqi", campaign: "Ndihmo familjet në nevojë", amount: 50, currency: "€", status: "completed" as const },
  { id: "tx2", date: "23 Apr 2026", donor: "Besnik Hoxha", campaign: "Bursa studentore 2025", amount: 100, currency: "€", status: "completed" as const },
  { id: "tx3", date: "22 Apr 2026", donor: "Lirije Gashi", campaign: "Bursa studentore 2025", amount: 25, currency: "€", status: "pending" as const },
  { id: "tx4", date: "20 Apr 2026", donor: "Mirlinda Berisha", campaign: "Rindërtimi i bibliotekës", amount: 200, currency: "€", status: "completed" as const },
  { id: "tx5", date: "18 Apr 2026", donor: "Agron Bajrami", campaign: "Ndihmo familjet në nevojë", amount: 75, currency: "€", status: "refunded" as const },
  { id: "tx6", date: "15 Apr 2026", donor: "Drita Morina", campaign: "Bursa studentore 2025", amount: 30, currency: "€", status: "failed" as const },
  { id: "tx7", date: "10 Apr 2026", donor: "Kujtim Fazliu", campaign: "Ndihmo familjet në nevojë", amount: 150, currency: "€", status: "completed" as const },
];

export default function TransaksionetPage() {
  return (
    <DashboardLayout activeKey="transaksionet">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaksionet</h1>
          <p className="text-sm text-gray-500 mt-1">Lista e të gjitha donacioneve dhe pagesave.</p>
        </div>

        <TransactionTable transactions={MOCK_TRANSACTIONS} />
      </div>
    </DashboardLayout>
  );
}
