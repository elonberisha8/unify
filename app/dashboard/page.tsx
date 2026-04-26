"use client";

// ============================================================
// BRANCH: feat/dashboard-home
// FIGMA: https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=50-2
// ============================================================

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { StatCard, CampaignGoalCard, ActivityLogItem, CreatorCTA } from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import { UsersIcon, TrendingUpIcon } from "@/components/icons";
import { useAuth, useUser } from "@clerk/nextjs";
import { apiFetch } from "@/app/_lib/api";

// ── Types ────────────────────────────────────────────────────

interface DashboardOverview {
  stats: Array<{ label: string; value: string | number; change: { value: string; direction: "up" | "down" | "neutral" } }>;
  donationTrend: Array<{ muaji: string; shuma: number }>;
  applicationsPerListing: Array<{ shpallja: string; aplikime: number }>;
  topDonors: Array<{ name: string; amount: string; avatar: string }>;
  campaigns: Array<{
    id: string; slug: string; title: string; image?: string | null;
    status: "active" | "draft" | "completed" | "paused";
    raised: number; goal: number; currency: string;
    donorCount: number; daysLeft?: number;
  }>;
  activity: Array<{ id: string; actor: { name: string }; action: string; target: string; timestamp: string }>;
}

// ── Skeleton ─────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-100 ${className ?? ""}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-64 mt-2" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64" /><Skeleton className="h-64" />
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────

export default function DashboardHomePage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [data, setData] = React.useState<DashboardOverview | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        const overview = await apiFetch<DashboardOverview>("/dashboard/overview", { token });
        if (!cancelled) setData(overview);
      } catch {
        // nëse gabim, lë të dhënat null (shfaq empty state)
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [getToken]);

  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "Përdorues";

  return (
    <DashboardLayout activeKey="home">
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mirë se erdhe, {firstName}!</h1>
          <p className="text-sm text-gray-500 mt-1">Pamja e përgjithshme e aktivitetit tënd.</p>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(data?.stats ?? []).map((s) => (
                <StatCard key={s.label} label={s.label} value={s.value} change={s.change} />
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Line chart — donacione */}
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUpIcon className="h-4 w-4 text-unify-blue" />
                    <h2 className="text-sm font-semibold text-gray-900">Donacione mujore (€)</h2>
                  </div>
                  {data?.donationTrend && data.donationTrend.some((d) => d.shuma > 0) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={data.donationTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede4" />
                        <XAxis dataKey="muaji" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v) => [`€${v}`, "Donacione"]} />
                        <Line type="monotone" dataKey="shuma" stroke="#009eff" strokeWidth={2} dot={{ r: 4, fill: "#009eff" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
                      Nuk ka ende donacione të regjistruara.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bar chart — aplikimet */}
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <UsersIcon className="h-4 w-4 text-unify-blue" />
                    <h2 className="text-sm font-semibold text-gray-900">Aplikimet sipas shpalljes</h2>
                  </div>
                  {data?.applicationsPerListing && data.applicationsPerListing.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={data.applicationsPerListing} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede4" />
                        <XAxis dataKey="shpallja" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip formatter={(v) => [v, "Aplikime"]} />
                        <Bar dataKey="aplikime" fill="#009eff" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
                      Nuk ka ende shpallje vullnetare.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Campaigns + Activity + Top Donors */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Kampanjat */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-sm font-semibold text-gray-900">Kampanjat e mia</h2>
                {data?.campaigns && data.campaigns.length > 0 ? (
                  <div className="space-y-3">
                    {data.campaigns.map((c) => (
                      <CampaignGoalCard
                        key={c.id}
                        title={c.title}
                        image={c.image}
                        status={c.status}
                        raised={c.raised}
                        goal={c.goal}
                        currency={c.currency}
                        donorCount={c.donorCount}
                        daysLeft={c.daysLeft}
                        onMenuClick={() => router.push(`/dashboard/kampanjat`)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                    <p>Nuk ke ende kampanja.</p>
                    <button
                      onClick={() => router.push("/dashboard/kampanjat/krijo")}
                      className="mt-2 text-unify-blue font-medium hover:underline"
                    >
                      Krijo kampanjën e parë →
                    </button>
                  </div>
                )}
              </div>

              {/* Aktiviteti */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-sm font-semibold text-gray-900">Aktiviteti i fundit</h2>
                {data?.activity && data.activity.length > 0 ? (
                  <div className="space-y-2">
                    {data.activity.map((a) => (
                      <ActivityLogItem
                        key={a.id}
                        actor={a.actor}
                        action={a.action}
                        target={a.target}
                        timestamp={a.timestamp}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                    Nuk ka ende aktivitet.
                  </div>
                )}
              </div>

              {/* Top Donors */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-sm font-semibold text-gray-900">Donatorët kryesorë</h2>
                {data?.topDonors && data.topDonors.length > 0 ? (
                  <div className="space-y-3">
                    {data.topDonors.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
                        <span className="w-6 h-6 rounded-full bg-unify-blue/10 text-unify-blue text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-unify-brown/10 text-unify-brown text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {d.avatar}
                        </div>
                        <span className="flex-1 text-sm font-medium text-gray-800 truncate">{d.name}</span>
                        <span className="text-sm font-bold text-unify-blue">{d.amount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                    Nuk ka ende donatorë.
                  </div>
                )}
              </div>
            </div>

            <CreatorCTA
              title="Bëhu krijues në Unify"
              description="Krijo kampanja, shpallje vullnetare dhe mblidh donacione — të gjitha në një vend."
              ctaLabel="Fillo tani"
              onCta={() => router.push("/dashboard/behu-krijues")}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
