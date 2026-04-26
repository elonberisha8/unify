"use client";

// ============================================================
// Aktiviteti — Audit log i sofistikuar i ndarë në kategori
// ============================================================

import * as React from "react";
import { DashboardLayout } from "@/components/layout";
import { Skeleton, Badge, Button, Input } from "@/components/ui";
import { ClockIcon, UserIcon, WalletIcon, MegaphoneIcon, ShareIcon, AlertTriangleIcon, DownloadIcon } from "@/components/icons";
import { apiFetch, type AuditEntry } from "@/app/_lib/api";
import { useAuthGuard } from "@/app/_lib/useAuthGuard";

type Category = "ACCOUNT" | "FINANCE" | "CAMPAIGN" | "SOCIAL" | "SYSTEM";

const CATEGORY_META: Record<Category, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  ACCOUNT: {
    label: "Llogaria",
    description: "Login, logout, ndryshim password, ndryshim email.",
    icon: <UserIcon className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800",
  },
  FINANCE: {
    label: "Financa",
    description: "Donacione (in/out), tërheqje, tip Unify.",
    icon: <WalletIcon className="h-4 w-4" />,
    color: "bg-green-100 text-green-800",
  },
  CAMPAIGN: {
    label: "Kampanjat",
    description: "Krijim, edit, milestones, mbyllje kampanje.",
    icon: <MegaphoneIcon className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800",
  },
  SOCIAL: {
    label: "Social",
    description: "Komente, mesazhe, aplikime, raportime.",
    icon: <ShareIcon className="h-4 w-4" />,
    color: "bg-pink-100 text-pink-800",
  },
  SYSTEM: {
    label: "Sistemi",
    description: "Veprime automatike, njoftime sistemi, alarme.",
    icon: <AlertTriangleIcon className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-700",
  },
};

const SEVERITY_BADGE: Record<string, string> = {
  info: "bg-blue-100 text-blue-800",
  warning: "bg-yellow-100 text-yellow-800",
  critical: "bg-red-100 text-red-800",
};

const CATEGORIES: Category[] = ["ACCOUNT", "FINANCE", "CAMPAIGN", "SOCIAL", "SYSTEM"];

function categorizeAction(action: string): Category {
  const a = action.toUpperCase();
  if (/(LOGIN|LOGOUT|PASSWORD|EMAIL|SIGNUP|REGISTER|VERIFY)/.test(a)) return "ACCOUNT";
  if (/(DONAT|PAY|TIP|WITHDRAW|REFUND)/.test(a)) return "FINANCE";
  if (/(CAMPAIGN|MILESTONE|LISTING|VOLUNTEER)/.test(a)) return "CAMPAIGN";
  if (/(MESSAGE|COMMENT|APPLY|REPORT|FOLLOW)/.test(a)) return "SOCIAL";
  return "SYSTEM";
}

export default function AktivitetiPage() {
  const { ready, authenticated, getToken } = useAuthGuard({ currentPath: "/dashboard/aktiviteti" });
  const [entries, setEntries] = React.useState<AuditEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState<Category>("ACCOUNT");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!ready || !authenticated) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const data = await apiFetch<AuditEntry[] | { entries: AuditEntry[] }>("/dashboard/audit-log", { token });
        const list = Array.isArray(data) ? data : data.entries;
        if (!cancelled) setEntries(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setEntries([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ready, authenticated, getToken]);

  const enriched = React.useMemo(() => entries.map((e) => ({
    ...e,
    category: e.category ?? categorizeAction(e.action),
  })), [entries]);

  const filtered = enriched.filter((e) => {
    if (e.category !== activeCategory) return false;
    if (search && !e.action.toLowerCase().includes(search.toLowerCase()) && !e.target.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = CATEGORIES.reduce<Record<Category, number>>((acc, c) => {
    acc[c] = enriched.filter((e) => e.category === c).length;
    return acc;
  }, { ACCOUNT: 0, FINANCE: 0, CAMPAIGN: 0, SOCIAL: 0, SYSTEM: 0 });

  function exportCsv() {
    const rows = [
      ["Data/Ora", "Kategoria", "Veprimi", "Objekti", "IP", "Pajisja", "Severity"],
      ...filtered.map((e) => [
        new Date(e.timestamp).toLocaleString("sq-AL"),
        CATEGORY_META[e.category as Category].label,
        e.action,
        e.target,
        e.ip,
        e.device ?? "—",
        e.severity,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-${activeCategory.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout activeKey="home">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log — Aktiviteti i llogarisë</h1>
          <p className="mt-1 text-sm text-gray-500">
            Çdo veprim i regjistruar me timestamp, IP dhe pajisje. Ndarë në 5 kategori për transparencë maksimale.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid gap-2 md:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl border p-3 text-left transition ${
                activeCategory === cat
                  ? "border-unify-blue bg-white shadow-md shadow-blue-100"
                  : "border-gray-200 bg-white hover:border-unify-blue/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`rounded-md p-1.5 ${CATEGORY_META[cat].color}`}>{CATEGORY_META[cat].icon}</span>
                <span className="text-xs font-bold text-gray-500">{counts[cat]}</span>
              </div>
              <p className="mt-1.5 text-sm font-bold text-gray-900">{CATEGORY_META[cat].label}</p>
              <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{CATEGORY_META[cat].description}</p>
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
          <Input
            placeholder="Kërko veprim ose objekt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={exportCsv} className="ml-auto gap-2">
            <DownloadIcon className="h-4 w-4" /> Eksporto CSV
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <span className={`rounded-md p-2 ${CATEGORY_META[activeCategory].color}`}>
                {CATEGORY_META[activeCategory].icon}
              </span>
              <div>
                <h2 className="font-bold text-gray-900">{CATEGORY_META[activeCategory].label}</h2>
                <p className="text-xs text-gray-500">{filtered.length} veprime</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              <ClockIcon className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              Asnjë veprim në këtë kategori.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Data/Ora</th>
                    <th className="px-4 py-3">Veprimi</th>
                    <th className="px-4 py-3">Objekti</th>
                    <th className="px-4 py-3">IP / Pajisja</th>
                    <th className="px-4 py-3">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(e.timestamp).toLocaleString("sq-AL", {
                          year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{e.action.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate" title={e.target}>{e.target || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {e.ip || "—"}{e.device ? <><br />{e.device}</> : null}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${SEVERITY_BADGE[e.severity] ?? "bg-gray-100 text-gray-700"}`}>
                          {e.severity}
                        </Badge>
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
