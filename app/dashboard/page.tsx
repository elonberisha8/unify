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

// ── Mock data ────────────────────────────────────────────────

const MOCK_STATS = [
  { label: "Donacione totale",  value: "€4,200",  change: { value: "+12%", direction: "up" as const } },
  { label: "Kampanja aktive",   value: "3",        change: { value: "+1",   direction: "up" as const } },
  { label: "Donatorë",          value: "148",      change: { value: "+8",   direction: "up" as const } },
  { label: "Vullnetarë aktivë", value: "32",       change: { value: "+2",   direction: "neutral" as const } },
];

const DONATION_TREND = [
  { muaji: "Nov", shuma: 420 },
  { muaji: "Dhj", shuma: 680 },
  { muaji: "Jan", shuma: 520 },
  { muaji: "Shk", shuma: 940 },
  { muaji: "Mar", shuma: 750 },
  { muaji: "Pri", shuma: 890 },
];

const APPLICATIONS_PER_LISTING = [
  { shpallja: "Mësues anglisht",   aplikime: 12 },
  { shpallja: "Koordinator",       aplikime: 7  },
  { shpallja: "Ndihmës social",    aplikime: 19 },
  { shpallja: "Organizator sport", aplikime: 5  },
];

const TOP_DONORS = [
  { name: "Arta Krasniqi",    amount: "€250", avatar: "AK" },
  { name: "Besnik Hoxha",     amount: "€180", avatar: "BH" },
  { name: "Mirlinda Berisha", amount: "€150", avatar: "MB" },
];

const MOCK_CAMPAIGNS = [
  { id: "1", title: "Ndihmo familjet në nevojë", status: "active" as const, raised: 3200, goal: 5000, currency: "€", donorCount: 48, daysLeft: 12 },
  { id: "2", title: "Bursa studentore 2025",     status: "active" as const, raised: 1800, goal: 3000, currency: "€", donorCount: 22, daysLeft: 30 },
  { id: "3", title: "Rindërtimi i bibliotekës",  status: "draft"  as const, raised: 0,    goal: 8000, currency: "€", donorCount: 0,  daysLeft: 60 },
];

const MOCK_ACTIVITY = [
  { id: "1", action: "dha donacion për",             target: "Ndihmo familjet", timestamp: "2 orë",   actor: { name: "Arta Krasniqi"   } },
  { id: "2", action: "aplikoi për shpalljen",        target: "Mësues anglisht", timestamp: "4 orë",   actor: { name: "Besnik Hoxha"    } },
  { id: "3", action: "aplikoi për shpalljen",        target: "Ndihmës social",  timestamp: "6 orë",   actor: { name: "Drita Morina"    } },
  { id: "4", action: "dha donacion për",             target: "Bursa studentore", timestamp: "1 ditë", actor: { name: "Lirije Gashi"    } },
];

// ── Component ────────────────────────────────────────────────

export default function DashboardHomePage() {
  const router = useRouter();

  return (
    <DashboardLayout activeKey="home">
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mirë se erdhe</h1>
          <p className="text-sm text-gray-500 mt-1">Pamja e përgjithshme e aktivitetit tënd.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_STATS.map((s) => (
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
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={DONATION_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede4" />
                  <XAxis dataKey="muaji" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [`€${v}`, "Donacione"]} />
                  <Line type="monotone" dataKey="shuma" stroke="#009eff" strokeWidth={2} dot={{ r: 4, fill: "#009eff" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar chart — aplikimet */}
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-4">
                <UsersIcon className="h-4 w-4 text-unify-blue" />
                <h2 className="text-sm font-semibold text-gray-900">Aplikimet sipas shpalljes</h2>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={APPLICATIONS_PER_LISTING} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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

        {/* Campaigns + Activity + Top Donors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Kampanjat */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Kampanjat e mia</h2>
            <div className="space-y-3">
              {MOCK_CAMPAIGNS.map((c) => (
                <CampaignGoalCard
                  key={c.id}
                  title={c.title}
                  status={c.status}
                  raised={c.raised}
                  goal={c.goal}
                  currency={c.currency}
                  donorCount={c.donorCount}
                  daysLeft={c.daysLeft}
                  onMenuClick={() => router.push("/dashboard/kampanjat")}
                />
              ))}
            </div>
          </div>

          {/* Aktiviteti */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Aktiviteti i fundit</h2>
            <div className="space-y-2">
              {MOCK_ACTIVITY.map((a) => (
                <ActivityLogItem
                  key={a.id}
                  actor={a.actor}
                  action={a.action}
                  target={a.target}
                  timestamp={a.timestamp}
                />
              ))}
            </div>
          </div>

          {/* Top Donors */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Donatorët kryesorë</h2>
            <div className="space-y-3">
              {TOP_DONORS.map((d, i) => (
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
          </div>
        </div>

        <CreatorCTA
          title="Bëhu krijues në Unify"
          description="Krijo kampanja, shpallje vullnetare dhe mblidh donacione — të gjitha në një vend."
          ctaLabel="Fillo tani"
          onCta={() => router.push("/dashboard/behu-krijues")}
        />
      </div>
    </DashboardLayout>
  );
}
