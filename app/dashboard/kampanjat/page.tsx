"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Textarea,
} from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import { apiFetch, type Campaign } from "@/app/_lib/api";
import { formatCurrency } from "@/lib/format";
import { CalendarIcon, EditIcon, MapPinIcon, TrashIcon, UsersIcon } from "@/components/icons";

const CATEGORIES = [
  "MEDICAL",
  "EDUCATION",
  "EMERGENCY",
  "COMMUNITY",
  "SPORTS",
  "ENVIRONMENT",
  "ANIMALS",
  "TECHNOLOGY",
  "CREATIVE",
  "OTHER",
] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Në rishikim",
  ACTIVE: "Aktive",
  COMPLETED: "E përfunduar",
  PAUSED: "Pauzuar",
  SUSPENDED: "E pezulluar",
  REJECTED: "Refuzuar",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  PAUSED: "bg-gray-100 text-gray-700",
  SUSPENDED: "bg-orange-100 text-orange-800",
  REJECTED: "bg-red-100 text-red-700",
};

type CampaignForm = {
  title: string;
  shortDescription: string;
  description: string;
  targetAmount: string;
  category: string;
  location: string;
};

function formatEuro(value: number) {
  return formatCurrency(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("sq-AL");
}

function campaignToForm(campaign: Campaign): CampaignForm {
  return {
    title: campaign.title,
    shortDescription: campaign.shortDescription ?? "",
    description: campaign.description,
    targetAmount: String(campaign.targetAmount),
    category: campaign.category,
    location: campaign.location,
  };
}

export default function DashKampanjaPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<Campaign | null>(null);
  const [form, setForm] = React.useState<CampaignForm | null>(null);

  const stats = React.useMemo(() => {
    return {
      total: campaigns.length,
      active: campaigns.filter((campaign) => campaign.status === "ACTIVE").length,
      pending: campaigns.filter((campaign) => campaign.status === "PENDING").length,
      raised: campaigns.reduce((sum, campaign) => sum + campaign.currentAmount, 0),
    };
  }, [campaigns]);

  const load = React.useCallback(async () => {
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
      setCampaigns(res.campaigns);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  React.useEffect(() => { load(); }, [load]);

  function openEdit(campaign: Campaign) {
    setError(null);
    setEditing(campaign);
    setForm(campaignToForm(campaign));
  }

  async function saveCampaign() {
    if (!editing || !form) return;
    setSaving(true);
    setError(null);
    try {
      const token = isSignedIn ? await getToken() : null;
      const updated = await apiFetch<Campaign>(`/campaigns/${editing.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({
          title: form.title.trim(),
          shortDescription: form.shortDescription.trim() || undefined,
          description: form.description.trim(),
          targetAmount: Number(form.targetAmount),
          category: form.category,
          location: form.location.trim(),
        }),
      });
      setCampaigns((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      setEditing(null);
      setForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ruajtja dështoi.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCampaign(campaign: Campaign) {
    const confirmed = window.confirm(`A je i sigurt që do ta fshish kampanjën "${campaign.title}"?`);
    if (!confirmed) return;
    try {
      const token = isSignedIn ? await getToken() : null;
      await apiFetch(`/campaigns/${campaign.id}`, { method: "DELETE", token });
      setCampaigns((items) => items.filter((item) => item.id !== campaign.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fshirja dështoi.");
    }
  }

  return (
    <DashboardLayout activeKey="campaigns">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-unify-blue">Kampanjat</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-950">Kampanjat e mia</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Menaxho kampanjat që janë krijuar nga dashboard-i. Ndryshimet në kampanjat aktive kthehen në rishikim për aprovim.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/krijo/kampanje")}>Krijo kampanjë</Button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Gjithsej", stats.total],
            ["Aktive", stats.active],
            ["Në rishikim", stats.pending],
            ["Mbledhur", formatEuro(stats.raised)],
          ].map(([label, value]) => (
            <Card key={label} className="border-gray-200 bg-white">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase text-gray-400">{label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-950">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <h2 className="text-lg font-bold text-gray-950">Ende nuk ka kampanja</h2>
              <p className="mt-2 text-sm text-gray-500">Krijo kampanjën e parë dhe ajo do të shfaqet këtu.</p>
              <Button className="mt-5" onClick={() => router.push("/dashboard/krijo/kampanje")}>Krijo kampanjë</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {campaigns.map((campaign) => {
              const percent = Math.min(100, Math.round((campaign.currentAmount / Math.max(campaign.targetAmount, 1)) * 100));
              return (
                <Card key={campaign.id} className="overflow-hidden border-gray-200 bg-white transition-shadow hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="grid min-h-52 md:grid-cols-[160px_1fr]">
                      <div className="bg-unify-cream">
                        {campaign.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={campaign.images[0]} alt={campaign.title} className="h-full min-h-40 w-full object-cover" />
                        ) : (
                          <div className="flex h-full min-h-40 items-center justify-center px-5 text-center text-sm font-bold text-unify-brown/60">
                            Unify
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Badge className={STATUS_STYLES[campaign.status] ?? "bg-gray-100 text-gray-700"}>
                            {STATUS_LABELS[campaign.status] ?? campaign.status}
                          </Badge>
                          <span className="text-xs font-semibold text-gray-400">{campaign.category}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => router.push(`/kampanjat/${campaign.slug}`)}
                          className="mt-3 text-left text-lg font-bold leading-snug text-gray-950 hover:text-unify-blue"
                        >
                          {campaign.title}
                        </button>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                          {campaign.shortDescription || campaign.description}
                        </p>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-gray-950">{formatEuro(campaign.currentAmount)}</span>
                            <span className="text-gray-500">{formatEuro(campaign.targetAmount)}</span>
                          </div>
                          <Progress value={percent} />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1"><MapPinIcon className="h-3.5 w-3.5" />{campaign.location}</span>
                          <span className="inline-flex items-center gap-1"><UsersIcon className="h-3.5 w-3.5" />{campaign._count.donations} donatorë</span>
                          <span className="inline-flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" />{formatDate(campaign.createdAt)}</span>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(campaign)}>
                            <EditIcon className="h-3.5 w-3.5" /> Ndrysho
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => deleteCampaign(campaign)}>
                            <TrashIcon className="h-3.5 w-3.5" /> Fshi
                          </Button>
                        </div>
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
            <DialogTitle>Ndrysho kampanjën</DialogTitle>
            <DialogDescription>Kampanjat aktive kalojnë përsëri në rishikim pas ruajtjes.</DialogDescription>
          </DialogHeader>
          {form && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="campaign-title">Titulli</Label>
                <Input id="campaign-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="campaign-short">Përshkrimi i shkurtër</Label>
                <Input id="campaign-short" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="campaign-description">Përshkrimi</Label>
                <Textarea id="campaign-description" rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="campaign-target">Shuma target</Label>
                  <Input id="campaign-target" type="number" min={50} value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Kategoria</Label>
                  <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="campaign-location">Lokacioni</Label>
                  <Input id="campaign-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => (setEditing(null), setForm(null))}>Anulo</Button>
            <Button onClick={saveCampaign} disabled={saving}>{saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
