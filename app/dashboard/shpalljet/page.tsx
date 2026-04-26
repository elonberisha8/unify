"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton, Switch, Textarea } from "@/components/ui";
import { EmptyState, DashboardLayout } from "@/components/layout";
import { ClockIcon, EditIcon, HandHeartIcon, MapPinIcon, MegaphoneIcon, TrashIcon, UsersIcon } from "@/components/icons";
import { apiFetch } from "@/app/_lib/api";
import { useAuthGuard } from "@/app/_lib/useAuthGuard";

type ListingKind = "VOLUNTEER_CONTRIBUTION" | "SUPPORT_REQUEST";
type ListingStatus = "PENDING" | "ACTIVE" | "IN_REVIEW" | "CLAIMED" | "CLOSED" | "PAUSED" | "REJECTED";

interface DashboardListing {
  id: string;
  kind: ListingKind;
  title: string;
  description: string;
  organization: string | null;
  status: ListingStatus;
  location: string;
  valueLabel: string | null;
  category: string;
  remote: boolean;
  applications: Array<{ id: string; status: string }>;
  _count: { applications: number };
}

type ListingForm = {
  kind: ListingKind;
  title: string;
  description: string;
  organization: string;
  category: string;
  location: string;
  valueLabel: string;
  remote: boolean;
};

const KIND_META: Record<ListingKind, { label: string; icon: React.ReactNode; tone: string }> = {
  VOLUNTEER_CONTRIBUTION: { label: "Kontribut vullnetar", icon: <HandHeartIcon className="h-4 w-4" />, tone: "bg-blue-50 text-blue-700" },
  SUPPORT_REQUEST: { label: "Kerkese per mbeshtetje", icon: <MegaphoneIcon className="h-4 w-4" />, tone: "bg-amber-50 text-amber-700" },
};

const STATUS_LABELS: Record<ListingStatus, string> = {
  PENDING: "Ne rishikim",
  ACTIVE: "Aktive",
  IN_REVIEW: "Te admini",
  CLAIMED: "E rezervuar",
  CLOSED: "E permbushur",
  PAUSED: "Pauzuar",
  REJECTED: "Refuzuar",
};

const STATUS_STYLES: Record<ListingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  CLAIMED: "bg-purple-100 text-purple-800",
  CLOSED: "bg-emerald-100 text-emerald-800",
  PAUSED: "bg-gray-100 text-gray-700",
  REJECTED: "bg-red-100 text-red-700",
};

function listingToForm(listing: DashboardListing): ListingForm {
  return {
    kind: listing.kind,
    title: listing.title,
    description: listing.description,
    organization: listing.organization ?? "",
    category: listing.category,
    location: listing.remote ? "" : listing.location,
    valueLabel: listing.valueLabel ?? "",
    remote: listing.remote,
  };
}

export default function DashShpalljetPage() {
  const router = useRouter();
  const { ready, authenticated, getToken } = useAuthGuard({ currentPath: "/dashboard/shpalljet" });
  const [listings, setListings] = React.useState<DashboardListing[]>([]);
  const [filter, setFilter] = React.useState<ListingKind | "all">("all");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<DashboardListing | null>(null);
  const [form, setForm] = React.useState<ListingForm | null>(null);

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

  function openEdit(listing: DashboardListing) {
    setError(null);
    setEditing(listing);
    setForm(listingToForm(listing));
  }

  async function saveListing() {
    if (!editing || !form) return;
    setSaving(true);
    setError(null);
    try {
      const token = await getToken();
      const updated = await apiFetch<DashboardListing>(`/volunteers/${editing.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({
          kind: form.kind,
          title: form.title.trim(),
          description: form.description.trim(),
          organization: form.organization.trim() || undefined,
          category: form.category.trim(),
          location: form.remote ? "Online" : form.location.trim(),
          valueLabel: form.valueLabel.trim() || undefined,
          remote: form.remote,
        }),
      });
      setListings((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      setEditing(null);
      setForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ruajtja deshtoi.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteListing(listing: DashboardListing) {
    if (!window.confirm(`A je i sigurt qe do ta fshish shpalljen "${listing.title}"?`)) return;
    try {
      const token = await getToken();
      await apiFetch(`/volunteers/${listing.id}`, { method: "DELETE", token });
      setListings((items) => items.filter((item) => item.id !== listing.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fshirja deshtoi.");
    }
  }

  return (
    <DashboardLayout activeKey="volunteer">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-unify-blue">Shpalljet</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-950">Shpalljet e mia</h1>
            <p className="mt-2 text-sm text-gray-500">
              {listings.filter((listing) => listing.status === "ACTIVE").length} aktive · {pendingRequests} kerkesa ne pritje · {listings.filter((listing) => listing.status === "IN_REVIEW").length} raste te admini
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/krijo/shpallje")}>Krijo shpallje</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant={filter === "all" ? "primary" : "outline"} onClick={() => setFilter("all")}>Te gjitha</Button>
          <Button variant={filter === "VOLUNTEER_CONTRIBUTION" ? "primary" : "outline"} onClick={() => setFilter("VOLUNTEER_CONTRIBUTION")}>Kontribute</Button>
          <Button variant={filter === "SUPPORT_REQUEST" ? "primary" : "outline"} onClick={() => setFilter("SUPPORT_REQUEST")}>Kerkesa</Button>
        </div>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-56 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="Asnje shpallje ne databaze" description="Krijo shpalljen tende te pare." action={{ label: "Krijo shpallje", onClick: () => router.push("/dashboard/krijo/shpallje") }} />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filtered.map((listing) => {
              const meta = KIND_META[listing.kind];
              const pending = listing.applications.filter((request) => request.status === "PENDING").length;
              return (
                <Card key={listing.id} className="border-gray-200 bg-white transition-shadow hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${meta.tone}`}>{meta.icon}{meta.label}</span>
                      <Badge className={STATUS_STYLES[listing.status]}>{STATUS_LABELS[listing.status]}</Badge>
                    </div>
                    <h3 className="text-lg font-bold leading-snug text-gray-950">{listing.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{listing.organization || listing.category}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{listing.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPinIcon className="h-3.5 w-3.5" />{listing.remote ? "Online" : listing.location}</span>
                      <span className="flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" />{listing.valueLabel || "Pa vlere"}</span>
                      <span className="flex items-center gap-1"><UsersIcon className="h-3.5 w-3.5" />{listing._count.applications} kerkesa</span>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
                      <span className="text-xs font-semibold text-yellow-700">{pending} ne pritje</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(listing)}><EditIcon className="h-3.5 w-3.5" /> Ndrysho</Button>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => deleteListing(listing)}><TrashIcon className="h-3.5 w-3.5" /> Fshi</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={Boolean(editing && form)} onOpenChange={(open) => !open && (setEditing(null), setForm(null))}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ndrysho shpalljen</DialogTitle>
            <DialogDescription>Shpalljet aktive kalojne perseri ne rishikim pas ruajtjes.</DialogDescription>
          </DialogHeader>
          {form && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Lloji</Label>
                <Select value={form.kind} onValueChange={(value: ListingKind) => setForm({ ...form, kind: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VOLUNTEER_CONTRIBUTION">Kontribut vullnetar</SelectItem>
                    <SelectItem value="SUPPORT_REQUEST">Kerkese per mbeshtetje</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label htmlFor="listing-title">Titulli</Label><Input id="listing-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="grid gap-2"><Label htmlFor="listing-description">Pershkrimi</Label><Textarea id="listing-description" rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2"><Label htmlFor="listing-organization">Organizata</Label><Input id="listing-organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></div>
                <div className="grid gap-2"><Label htmlFor="listing-category">Kategoria</Label><Input id="listing-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                <div className="grid gap-2"><Label htmlFor="listing-value">Vlera / koha</Label><Input id="listing-value" value={form.valueLabel} onChange={(e) => setForm({ ...form, valueLabel: e.target.value })} /></div>
                <div className="grid gap-2"><Label htmlFor="listing-location">Lokacioni</Label><Input id="listing-location" disabled={form.remote} value={form.remote ? "Online" : form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              </div>
              <label className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
                <span><span className="block text-sm font-bold text-gray-950">Pune online</span><span className="block text-xs text-gray-500">Shpallja nuk kerkon lokacion fizik.</span></span>
                <Switch checked={form.remote} onCheckedChange={(checked) => setForm({ ...form, remote: checked })} />
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => (setEditing(null), setForm(null))}>Anulo</Button>
            <Button onClick={saveListing} disabled={saving}>{saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
