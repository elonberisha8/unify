"use client";

// ============================================================
// BRANCH: feat/dashboard-home
// FIGMA:
//   • Dashboard — Transaksionet → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=79-2
// ============================================================

import * as React from "react";
import { DashboardLayout } from "@/components/layout";
import { Badge, Button, Input } from "@/components/ui";
import { CheckIcon, ClockIcon, WalletIcon, ChevronDownIcon, ChevronUpIcon, HandHeartIcon, DownloadIcon } from "@/components/icons";
import { apiFetch, type DashboardTransaction, type TransactionKind } from "@/app/_lib/api";
import { useAuthGuard } from "@/app/_lib/useAuthGuard";

const TAB_META: Record<TransactionKind, { label: string; description: string; color: string; icon: React.ReactNode }> = {
  DONATION_OUT: {
    label: "Donacionet e mia",
    description: "Paratë që ke dhuruar për kampanja të të tjerëve.",
    color: "bg-red-100 text-red-800",
    icon: <ChevronUpIcon className="h-4 w-4" />,
  },
  DONATION_IN: {
    label: "Donacionet e marra",
    description: "Paratë e mbledhura nga kampanjat e mia.",
    color: "bg-green-100 text-green-800",
    icon: <ChevronDownIcon className="h-4 w-4" />,
  },
  TIP: {
    label: "Tip për Unify",
    description: "Donacione opsionale të lëna për platformën.",
    color: "bg-purple-100 text-purple-800",
    icon: <HandHeartIcon className="h-4 w-4" />,
  },
  WITHDRAWAL: {
    label: "Tërheqje (withdrawals)",
    description: "Paratë e tërhequra nga llogaria jote bankare.",
    color: "bg-blue-100 text-blue-800",
    icon: <WalletIcon className="h-4 w-4" />,
  },
};

const TABS: TransactionKind[] = ["DONATION_OUT", "DONATION_IN", "TIP", "WITHDRAWAL"];

const STATUS_BADGE: Record<string, string> = {
  SUCCEEDED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  FAILED: "bg-red-100 text-red-800",
};

export default function TransaksionetPage() {
  const { ready, authenticated, getToken } = useAuthGuard({ currentPath: "/dashboard/transaksionet" });
  const [activeTab, setActiveTab] = React.useState<TransactionKind>("DONATION_OUT");
  const [transactions, setTransactions] = React.useState<DashboardTransaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  React.useEffect(() => {
    if (!ready || !authenticated) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const data = await apiFetch<DashboardTransaction[]>("/dashboard/transactions", { token });
        if (!cancelled) setTransactions(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setTransactions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ready, authenticated, getToken]);

  const filtered = React.useMemo(() => {
    return transactions.filter((t) => {
      if (t.kind !== activeTab) return false;
      if (search && !t.campaignTitle?.toLowerCase().includes(search.toLowerCase()) && !t.counterparty.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFrom && new Date(t.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(t.createdAt) > new Date(dateTo)) return false;
      return true;
    });
  }, [transactions, activeTab, search, dateFrom, dateTo]);

  const totalAmount = filtered.reduce((sum, t) => sum + (t.status === "SUCCEEDED" ? t.amount : 0), 0);
  const counts = TABS.reduce<Record<TransactionKind, number>>((acc, k) => {
    acc[k] = transactions.filter((t) => t.kind === k).length;
    return acc;
  }, { DONATION_OUT: 0, DONATION_IN: 0, TIP: 0, WITHDRAWAL: 0 });

  function handleExportCsv() {
    const rows = [
      ["Data", "Tipi", "Kampanja", "Pala tjetër", "Shuma", "Valuta", "Metoda", "Statusi"],
      ...filtered.map((t) => [
        new Date(t.createdAt).toLocaleString("sq-AL"),
        TAB_META[t.kind].label,
        t.campaignTitle ?? "—",
        t.counterparty,
        t.amount.toFixed(2),
        t.currency,
        t.method,
        t.status,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transaksionet-${activeTab.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout activeKey="transactions">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaksionet financiare</h1>
          <p className="mt-1 text-sm text-gray-500">
            Të gjitha transaksionet e ndara në tabela të pastra: dhuruar, marrë, tip, tërheqje.
          </p>
        </div>

        {/* Tabs */}
        <div className="grid gap-2 md:grid-cols-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl border p-4 text-left transition ${
                activeTab === tab
                  ? "border-unify-blue bg-white shadow-md shadow-blue-100"
                  : "border-gray-200 bg-white hover:border-unify-blue/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`rounded-md p-1.5 ${TAB_META[tab].color}`}>{TAB_META[tab].icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{counts[tab]} entries</span>
              </div>
              <p className="mt-2 text-sm font-bold text-gray-900">{TAB_META[tab].label}</p>
              <p className="mt-1 text-xs text-gray-500">{TAB_META[tab].description}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
          <Input
            placeholder="Kërko sipas kampanjës ose palës..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Nga:</span>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Deri:</span>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={handleExportCsv} className="gap-2">
              <DownloadIcon className="h-4 w-4" /> Eksporto CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <WalletIcon className="h-5 w-5 text-unify-blue" />
              <div>
                <h2 className="font-bold text-gray-900">{TAB_META[activeTab].label}</h2>
                <p className="text-xs text-gray-500">{filtered.length} transaksione · €{totalAmount.toFixed(2)} total</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">Duke ngarkuar nga databaza...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">Asnjë transaksion në këtë tab.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Kampanja</th>
                    <th className="px-4 py-3">Pala tjetër</th>
                    <th className="px-4 py-3">Metoda</th>
                    <th className="px-4 py-3 text-right">Shuma</th>
                    <th className="px-4 py-3">Statusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(t.createdAt).toLocaleDateString("sq-AL")}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(t.createdAt).toLocaleTimeString("sq-AL", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {t.campaignSlug ? (
                          <a href={`/kampanjat/${t.campaignSlug}`} className="font-medium text-unify-blue hover:underline">
                            {t.campaignTitle ?? "—"}
                          </a>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{t.counterparty}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{t.method}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {activeTab === "DONATION_OUT" || activeTab === "TIP" || activeTab === "WITHDRAWAL" ? "−" : "+"}
                        €{t.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_BADGE[t.status] ?? "bg-gray-100 text-gray-700"}`}>
                          {t.status === "SUCCEEDED" ? (
                            <span className="inline-flex items-center gap-1"><CheckIcon className="h-3 w-3" /> Sukses</span>
                          ) : t.status === "PENDING" ? (
                            <span className="inline-flex items-center gap-1"><ClockIcon className="h-3 w-3" /> Në pritje</span>
                          ) : t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
