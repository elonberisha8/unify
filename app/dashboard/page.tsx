"use client";

// ============================================================
// BRANCH: feat/dashboard-home
// FIGMA: https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=50-2
// ============================================================

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { StatCard, CampaignGoalCard, ActivityLogItem, CreatorCTA } from "@/components/dashboard";
import { Card, CardContent, Skeleton } from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import { UsersIcon, TrendingUpIcon } from "@/components/icons";
import { apiFetch } from "@/app/_lib/api";

type DashboardOverview = {
  stats: { label: string; value: string | number; change?: { value: string; direction: "up" | "down" | "neutral" } }[];
  donationTrend: { muaji: string; shuma: number }[];
  applicationsPerListing: { shpallja: string; aplikime: number }[];
  topDonors: { name: string; amount: string; avatar: string }[];
  campaigns: {
    id: string;
    slug: string;
    title: string;
    status: "active" | "draft" | "completed" | "paused";
    raised: number;
    goal: number;
    currency: string;
    donorCount: number;
    daysLeft?: number;
  }[];
  activity: { id: string; actor: { name: string }; action: string; target: string; timestamp: string }[];
};

export default function DashboardHomePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [data, setData] = React.useState<DashboardOverview | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      if (!isLoaded) return;
      const hasLocalToken = typeof window !== "undefined" && Boolean(window.localStorage.getItem("authToken"));
      if (!isSignedIn && !hasLocalToken) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const token = isSignedIn ? await getToken() : null;
        const overview = await apiFetch<DashboardOverview>("/dashboard/overview", { token });
        setData(overview);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken, isLoaded, isSignedIn]);

  return (
    <DashboardLayout activeKey="home">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mire se erdhe</h1>
          <p className="text-sm text-gray-500 mt-1">Pamja e pergjithshme e aktivitetit tend, direkt nga databaza.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : data == null ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-gray-500">
              Nuk ka ende te dhena dinamike per kete llogari.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.stats.map((s) => (
                <StatCard key={s.label} label={s.label} value={s.value} change={s.change} />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardContent className="pt-5">
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4 text-unify-blue" />
                    <h2 className="text-sm font-semibold text-gray-900">Donacione mujore</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.donationTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0ede4" />
                      <XAxis dataKey="muaji" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v) => [`EUR ${v}`, "Donacione"]} />
                      <Line type="monotone" dataKey="shuma" stroke="#009eff" strokeWidth={2} dot={{ r: 4, fill: "#009eff" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-5">
                  <div className="mb-4 flex items-center gap-2">
                    <UsersIcon className="h-4 w-4 text-unify-blue" />
                    <h2 className="text-sm font-semibold text-gray-900">Aplikimet sipas shpalljes</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.applicationsPerListing} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0ede4" />
                      <XAxis dataKey="shpallja" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip formatter={(v) => [v, "Aplikime"]} />
                      <Bar dataKey="aplikime" fill="#009eff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-900">Kampanjat e mia</h2>
                <div className="space-y-3">
                  {data.campaigns.length === 0 ? (
                    <Card><CardContent className="p-5 text-sm text-gray-500">Nuk ke kampanja ne DB.</CardContent></Card>
                  ) : data.campaigns.map((c) => (
                    <CampaignGoalCard
                      key={c.id}
                      title={c.title}
                      status={c.status}
                      raised={c.raised}
                      goal={c.goal}
                      currency="EUR "
                      donorCount={c.donorCount}
                      daysLeft={c.daysLeft}
                      onMenuClick={() => router.push("/dashboard/kampanjat")}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-900">Aktiviteti i fundit</h2>
                <div className="space-y-2">
                  {data.activity.length === 0 ? (
                    <Card><CardContent className="p-5 text-sm text-gray-500">Ende nuk ka aktivitet.</CardContent></Card>
                  ) : data.activity.map((a) => (
                    <ActivityLogItem key={a.id} actor={a.actor} action={a.action} target={a.target} timestamp={a.timestamp} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-900">Donatoret kryesore</h2>
                <div className="space-y-3">
                  {data.topDonors.length === 0 ? (
                    <Card><CardContent className="p-5 text-sm text-gray-500">Ende nuk ka donatore.</CardContent></Card>
                  ) : data.topDonors.map((d, i) => (
                    <div key={`${d.name}-${i}`} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-unify-blue/10 text-xs font-bold text-unify-blue">{i + 1}</span>
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-unify-brown/10 text-xs font-bold text-unify-brown">{d.avatar}</div>
                      <span className="flex-1 truncate text-sm font-medium text-gray-800">{d.name}</span>
                      <span className="text-sm font-bold text-unify-blue">{d.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <CreatorCTA
          title="Behu krijues ne Unify"
          description="Krijo kampanja, shpallje vullnetare dhe mblidh donacione - te gjitha ne nje vend."
          ctaLabel="Fillo tani"
          onCta={() => router.push("/dashboard/behu-krijues")}
        />
      </div>
    </DashboardLayout>
  );
}
