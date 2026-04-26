"use client";

// ============================================================
// BRANCH: feat/dashboard-campaigns
// FIGMA:
//   Dashboard - Kampanjat -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=80-2
// NOTION: https://www.notion.so/34874891227e8166b6e1db98166ca406
// ============================================================

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { CampaignTable, type CampaignRow } from "@/components/dashboard";
import { Button, Card, CardContent, Skeleton } from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import { apiFetch, type Campaign } from "@/app/_lib/api";

function toUiStatus(status: string): CampaignRow["status"] {
  const map: Record<string, CampaignRow["status"]> = {
    ACTIVE: "active",
    PENDING: "draft",
    COMPLETED: "completed",
    PAUSED: "paused",
    SUSPENDED: "paused",
    REJECTED: "paused",
  };
  return map[status] ?? "draft";
}

function mapCampaign(c: Campaign): CampaignRow & { slug: string } {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    status: toUiStatus(c.status),
    raised: c.currentAmount,
    goal: c.targetAmount,
    currency: "EUR ",
    donorCount: c._count.donations,
    createdAt: new Date(c.createdAt).toLocaleDateString("sq-AL"),
  };
}

export default function DashKampanjaPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [campaigns, setCampaigns] = React.useState<(CampaignRow & { slug: string })[]>([]);
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
        const res = await apiFetch<{ campaigns: Campaign[] }>("/campaigns/my", { token });
        setCampaigns(res.campaigns.map(mapCampaign));
      } catch {
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken, isLoaded, isSignedIn]);

  return (
    <DashboardLayout activeKey="kampanjat">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kampanjat e mia</h1>
            <p className="mt-1 text-sm text-gray-500">Menaxho kampanjat qe ekzistojne realisht ne databaze.</p>
          </div>
          <Button onClick={() => router.push("/dashboard/krijo/kampanje")}>+ Krijo kampanje</Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-gray-500">
              Nuk ka kampanja ne DB per kete user.
            </CardContent>
          </Card>
        ) : (
          <CampaignTable
            campaigns={campaigns}
            onRowClick={(campaign) => router.push(`/kampanjat/${(campaign as CampaignRow & { slug: string }).slug}`)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

