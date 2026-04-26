"use client";

// ============================================================
// BRANCH: feat/dashboard-home
// FIGMA:
//   Dashboard - Ruajtura -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=83-2
// NOTION: https://www.notion.so/34874891227e81f2a6e0ec234fd70570
// ============================================================

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { CampaignCard } from "@/components/public";
import { EmptyState, DashboardLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui";
import { apiFetch, type Campaign } from "@/app/_lib/api";

type SavedCampaign = {
  id: string;
  campaign: Campaign;
};

type Tab = "kampanja" | "shpallje";

function daysLeft(endsAt: string | null) {
  if (!endsAt) return 999;
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86400000));
}

export default function TeRuajturaPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [tab, setTab] = React.useState<Tab>("kampanja");
  const [bookmarks, setBookmarks] = React.useState<SavedCampaign[]>([]);
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
        const data = await apiFetch<SavedCampaign[]>("/users/me/bookmarks", { token });
        setBookmarks(data);
      } catch {
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken, isLoaded, isSignedIn]);

  return (
    <DashboardLayout activeKey="te-ruajtura">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Te ruajtura</h1>
          <p className="mt-1 text-sm text-gray-500">Kampanjat dhe shpalljet qe ke ruajtur ne DB.</p>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setTab("kampanja")}
            className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${tab === "kampanja" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Kampanja ({bookmarks.length})
          </button>
          <button
            onClick={() => setTab("shpallje")}
            className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${tab === "shpallje" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Shpallje (0)
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}
          </div>
        ) : tab === "kampanja" ? (
          bookmarks.length === 0 ? (
            <EmptyState
              title="Asnje kampanje e ruajtur"
              description="Ruaj kampanjat qe te interesojne per t'i gjetur lehte."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map(({ id, campaign }) => (
                <CampaignCard
                  key={id}
                  id={campaign.id}
                  title={campaign.title}
                  description={campaign.shortDescription ?? campaign.description.slice(0, 120)}
                  imageUrl={campaign.images[0] ?? ""}
                  category={campaign.category}
                  location={campaign.location}
                  raised={campaign.currentAmount}
                  goal={campaign.targetAmount}
                  donorCount={campaign._count.donations}
                  daysLeft={daysLeft(campaign.endsAt)}
                  creatorName={campaign.isAnonymous ? "Anonim" : campaign.creator.name}
                  verified={campaign.creator.isVerified}
                  onClick={() => router.push(`/kampanjat/${campaign.slug}`)}
                />
              ))}
            </div>
          )
        ) : (
          <EmptyState
            title="Asnje shpallje e ruajtur"
            description="Ruajtja e shpalljeve vullnetare kerkon model te vecante ne DB; nuk po shfaqim mock data."
          />
        )}
      </div>
    </DashboardLayout>
  );
}

