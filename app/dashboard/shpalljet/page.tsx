"use client";

// ============================================================
// BRANCH: feat/dashboard-campaigns
// Shpalljet e mia — dynamic DB workflow
// ============================================================

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
  Button, Badge, Skeleton,
} from "@/components/ui";
import { EmptyState, DashboardLayout } from "@/components/layout";
import {
  MapPinIcon, CalendarIcon, ClockIcon, UsersIcon,
  EditIcon, CheckIcon, CloseIcon, HandHeartIcon, MegaphoneIcon,
} from "@/components/icons";
import { apiFetch } from "@/app/_lib/api";
import { useAuthGuard } from "@/app/_lib/useAuthGuard";

type ListingKind = "VOLUNTEER_CONTRIBUTION" | "SUPPORT_REQUEST";
type ListingStatus = "PENDING" | "ACTIVE" | "IN_REVIEW" | "CLAIMED" | "CLOSED";
type RequestStatus = "PENDING" | "ADMIN_REVIEW" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

interface ListingRequest {
  id: string;
  reason: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  applicant: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    username: string | null;
    location: string | null;
  };
}

interface DashboardListing {
  id: string;
  kind: ListingKind;
  title: string;
  description: string;
  organization: string | null;
  status: ListingStatus;
  location: string;
  valueLabel: string | null;
  applicationDeadline: string | null;
  category: string;
  remote: boolean;
  fulfilledAt: string | null;
  createdAt: string;
  updatedAt: string;
  applications: ListingRequest[];
  _count: { applications: number };
}

const KIND_META: Record<ListingKind, { label: string; icon: React.ReactNode; tone: string }> = {
  VOLUNTEER_CONTRIBUTION: {
    label: "Kontribut Vullnetar",
    icon: <HandHeartIcon className="h-4 w-4" />,
    tone: "bg-blue-50 text-blue-700",
  },
  SUPPORT_REQUEST: {
    label: "Kërkesë për Mbështetje",
    icon: <MegaphoneIcon className="h-4 w-4" />,
    tone: "bg-amber-50 text-amber-700",
  },
};

const STATUS_LABELS: Record<ListingStatus, string> = {
  PENDING: "Në review",
  ACTIVE: "Aktive",
  IN_REVIEW: "Te admini",
  CLAIMED: "E rezervuar",
  CLOSED: "Përmbushur",
};

const STATUS_STYLES: Record<ListingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  CLAIMED: "bg-purple-100 text-purple-800",
  CLOSED: "bg-emerald-100 text-emerald-800",
};

const REQUEST_LABELS: Record<RequestStatus, string> = {
  PENDING: "Në pritje",
  ADMIN_REVIEW: "Dërguar te admini",
  ACCEPTED: "Aprovuar nga admini",
  REJECTED: "Refuzuar",
  WITHDRAWN: "Tërhequr",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("sq-AL");
}

export default function DashShpalljetPage() {
  const router = useRouter();
  const { ready, authenticated, getToken } = useAuthGuard({ currentPath: "/dashboard/shpalljet" });
  const [listings, setListings] = React.useState<DashboardListing[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<ListingKind | "all">("all");
  const [loading, setLoading] = React.useState(true);

  const selected = listings.find((listing) => listing.id === selectedId) ?? null;
  const filtered = listings.filter((listing) => filter === "all" || listing.kind === filter);
  const pendingRequests = listings.reduce((sum, listing) => sum + listing.applications.filter((request) => request.status === "PENDING").length, 0);

  const load = React.useCallback(async () => {
    if (!ready || !authenticated) return;
    setLoading(true);
    try {
      const token = await getToken();
      const data = await apiFetch<{ listings: DashboardListing[] }>("/volunteers/my", { token });
      setListings(data.listings);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [ready, authenticated, getToken]);

  React.useEffect(() => { load(); }, [load]);

  async function updateRequest(applicationId: string, status: "ADMIN_REVIEW" | "REJECTED") {
    const token = await getToken();
    await apiFetch(`/applications/${applicationId}/status`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status }),
    });
    await load();
  }

  return (
    <DashboardLayout activeKey="shpalljet">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shpalljet e mia</h1>
            <p className="mt-1 text-sm text-gray-500">
              {listings.filter((listing) => listing.status === "ACTIVE").length} aktive · {pendingRequests} kërkesa në pritje ·{" "}
              {listings.filter((listing) => listing.status === "IN_REVIEW").length} raste te admini
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/krijo/shpallje")}>
            + Krijo shpallje
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant={filter === "all" ? "primary" : "outline"} onClick={() => setFilter("all")}>
            Të gjitha
          </Button>
          <Button
            variant={filter === "VOLUNTEER_CONTRIBUTION" ? "primary" : "outline"}
            onClick={() => setFilter("VOLUNTEER_CONTRIBUTION")}
          >
            Kontribute Vullnetare
          </Button>
          <Button
            variant={filter === "SUPPORT_REQUEST" ? "primary" : "outline"}
            onClick={() => setFilter("SUPPORT_REQUEST")}
          >
            Kërkesa për Mbështetje
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Asnjë shpallje në databazë"
            description="Krijo shpalljen tënde të parë."
            action={{ label: "Krijo shpallje", onClick: () => router.push("/dashboard/krijo/shpallje") }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((listing) => {
              const meta = KIND_META[listing.kind];
              const pending = listing.applications.filter((request) => request.status === "PENDING").length;
              return (
                <button
                  key={listing.id}
                  onClick={() => setSelectedId(listing.id)}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-unify-blue/30 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${meta.tone}`}>
                      {meta.icon}
                      {meta.label}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[listing.status]}`}>
                      {STATUS_LABELS[listing.status]}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-unify-blue">
                    {listing.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{listing.organization || listing.category}</p>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      {listing.remote ? "Online" : listing.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {listing.valueLabel || "Pa vlerë"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-unify-blue">
                      <UsersIcon className="h-3.5 w-3.5" />
                      {listing._count.applications} kërkesa
                    </span>
                    <span className="text-xs font-semibold text-yellow-700">{pending} në pritje</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${KIND_META[selected.kind].tone}`}>
                    {KIND_META[selected.kind].icon}
                    {KIND_META[selected.kind].label}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[selected.status]}`}>
                    {STATUS_LABELS[selected.status]}
                  </span>
                </div>
                <SheetTitle className="mt-2 text-xl leading-snug">{selected.title}</SheetTitle>
                <p className="text-sm text-gray-500">{selected.organization || selected.category}</p>
              </SheetHeader>

              <div className="space-y-6">
                <section className="rounded-2xl bg-gray-50 p-4">
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <span className="flex items-center gap-2 text-gray-600">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      {selected.remote ? "Online / Distancë" : selected.location}
                    </span>
                    <span className="flex items-center gap-2 text-gray-600">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      {selected.valueLabel || selected.category}
                    </span>
                    <span className="flex items-center gap-2 text-gray-600">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      Krijuar: {formatDate(selected.createdAt)}
                    </span>
                    <span className="flex items-center gap-2 text-gray-600">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      Përmbushur: {formatDate(selected.fulfilledAt)}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-gray-600">{selected.description}</p>
                </section>

                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Kërkesat për këtë shpallje</h3>
                    <Badge variant="secondary">{selected.applications.length} gjithsej</Badge>
                  </div>

                  {selected.applications.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                      Nuk ka ende kërkesa në databazë për këtë shpallje.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selected.applications.map((request) => (
                        <article key={request.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-bold text-gray-950">{request.applicant.name}</p>
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                                  {REQUEST_LABELS[request.status]}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-400">{request.applicant.email} · {request.applicant.location || "—"} · {formatDate(request.createdAt)}</p>
                              <p className="mt-2 text-sm text-gray-600">"{request.reason}"</p>
                            </div>

                            {request.status === "PENDING" && (
                              <div className="flex shrink-0 gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-500 text-green-700 hover:bg-green-50"
                                  onClick={() => updateRequest(request.id, "ADMIN_REVIEW")}
                                >
                                  <CheckIcon className="h-3 w-3" /> Prano
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-400 text-red-600 hover:bg-red-50"
                                  onClick={() => updateRequest(request.id, "REJECTED")}
                                >
                                  <CloseIcon className="h-3 w-3" /> Refuzo
                                </Button>
                              </div>
                            )}
                          </div>

                          {request.status === "ADMIN_REVIEW" && (
                            <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">
                              Kjo kërkesë u pranua nga ti dhe tani është dërguar te admini për verifikim final.
                            </p>
                          )}
                          {request.status === "ACCEPTED" && (
                            <p className="mt-3 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-800">
                              Admini e aprovoi. Shpallja është mbyllur si e përmbushur.
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => router.push("/dashboard/krijo/shpallje")}
                  >
                    <EditIcon className="h-4 w-4" />
                    Krijo shpallje tjetër
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
