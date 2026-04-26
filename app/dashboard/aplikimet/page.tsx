"use client";

// ============================================================
// Aplikimet — VETËM aplikimet e MIA për shpalljet e të tjerëve
// ============================================================

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, MapPinIcon, FileTextIcon, EyeIcon, CloseIcon } from "@/components/icons";
import { Button, Skeleton, Badge } from "@/components/ui";
import { EmptyState, DashboardLayout } from "@/components/layout";
import { apiFetch, type MyApplication } from "@/app/_lib/api";
import { useAuthGuard } from "@/app/_lib/useAuthGuard";

type AppStatus = MyApplication["status"];

const STATUS_LABELS: Record<AppStatus, string> = {
  PENDING: "Në pritje",
  ACCEPTED: "Pranuar",
  REJECTED: "Refuzuar",
  WITHDRAWN: "Tërhequr",
};

const STATUS_COLORS: Record<AppStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  WITHDRAWN: "bg-gray-100 text-gray-700",
};

const TABS: { label: string; value: AppStatus | "all" }[] = [
  { label: "Të gjitha", value: "all" },
  { label: "Në pritje", value: "PENDING" },
  { label: "Pranuar", value: "ACCEPTED" },
  { label: "Refuzuar", value: "REJECTED" },
  { label: "Tërhequr", value: "WITHDRAWN" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("sq-AL", { year: "numeric", month: "short", day: "numeric" });
}

export default function AplikimetPage() {
  const router = useRouter();
  const { ready, authenticated, getToken } = useAuthGuard({ currentPath: "/dashboard/aplikimet" });
  const [applications, setApplications] = React.useState<MyApplication[]>([]);
  const [activeTab, setActiveTab] = React.useState<AppStatus | "all">("all");
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    if (!ready || !authenticated) return;
    setLoading(true);
    try {
      const token = await getToken();
      const data = await apiFetch<MyApplication[] | { applications: MyApplication[] }>("/applications/mine", { token });
      const list = Array.isArray(data) ? data : data.applications;
      setApplications(Array.isArray(list) ? list : []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [ready, authenticated, getToken]);

  React.useEffect(() => { load(); }, [load]);

  async function withdraw(id: string) {
    if (!confirm("A je i sigurt që do ta tërheqësh këtë aplikim?")) return;
    try {
      const token = await getToken();
      await apiFetch(`/applications/${id}/withdraw`, { method: "PATCH", token });
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gabim gjatë tërheqjes së aplikimit.");
    }
  }

  const filtered = applications.filter((a) => activeTab === "all" || a.status === activeTab);

  const counts = {
    all: applications.length,
    PENDING: applications.filter((a) => a.status === "PENDING").length,
    ACCEPTED: applications.filter((a) => a.status === "ACCEPTED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
    WITHDRAWN: applications.filter((a) => a.status === "WITHDRAWN").length,
  };

  return (
    <DashboardLayout activeKey="applications">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Aplikimet e mia</h1>
            <p className="mt-1 text-sm text-gray-500">
              Aplikimet që ti ke dërguar për shpalljet e të tjerëve. Aplikimet që marrin shpalljet e tua i gjen tek <a href="/dashboard/shpalljet" className="text-unify-blue hover:underline">Shpalljet e mia</a>.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-unify-blue/10 px-4 py-2 text-unify-blue">
            <FileTextIcon className="h-4 w-4" />
            <span className="text-sm font-bold">{counts.all} aplikime</span>
          </div>
        </div>

        <div className="flex gap-1 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 border-b-2 px-3 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "border-unify-blue text-unify-blue"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                activeTab === tab.value ? "bg-unify-blue text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {counts[tab.value]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Asnjë aplikim këtu"
            description={activeTab === "all" ? "Nuk ke aplikuar ende për asnjë shpallje." : `Nuk ke aplikime me statusin "${STATUS_LABELS[activeTab as AppStatus]}".`}
            action={{ label: "Shfleto shpalljet", onClick: () => router.push("/shpalljet") }}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <article key={app.id} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-unify-blue/40 transition">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4 min-w-0 flex-1">
                    {app.listing.image && (
                      <img src={app.listing.image} alt="" className="h-20 w-20 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLORS[app.status]}`}>
                          {STATUS_LABELS[app.status]}
                        </span>
                        <Badge variant="outline" className="text-xs">{app.listing.subtype}</Badge>
                        <Badge variant="outline" className="text-xs">{app.listing.category}</Badge>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        <a href={`/vullnetare/${app.listing.id}`} className="hover:text-unify-blue hover:underline">
                          {app.listing.title}
                        </a>
                      </h3>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                        <span className="inline-flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" /> {app.listing.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" /> Aplikuar {formatDate(app.createdAt)}
                        </span>
                        <span>
                          Pronari:{" "}
                          <a href={`/profili/${app.listing.owner.username}`} className="text-unify-blue hover:underline">
                            @{app.listing.owner.username}
                          </a>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 italic">
                        &ldquo;{app.reason}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:w-44 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/vullnetare/${app.listing.id}`)} className="gap-2">
                      <EyeIcon className="h-4 w-4" /> Shiko shpalljen
                    </Button>
                    {app.status === "PENDING" && (
                      <Button variant="outline" size="sm" onClick={() => withdraw(app.id)} className="gap-2 text-red-600 hover:bg-red-50 border-red-200">
                        <CloseIcon className="h-4 w-4" /> Tërhiq aplikimin
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
