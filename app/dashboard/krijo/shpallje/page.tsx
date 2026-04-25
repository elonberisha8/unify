"use client";

// ============================================================
// BRANCH: feat/dashboard-campaigns
// Krijo Shpallje — choose contribution vs support request first
// NOTION: https://www.notion.so/34874891227e8166b6e1db98166ca406
// ============================================================

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ImageUploadZone } from "@/components/dashboard";
import {
  Button, Input, Textarea, Label, Switch,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
  Stepper,
} from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import { HandHeartIcon, MegaphoneIcon } from "@/components/icons";
import { apiFetch } from "@/app/_lib/api";

type ListingKind = "volunteer_contribution" | "support_request";

const CATEGORIES = ["Arsim", "Shëndetësi", "Mjedis", "Kulturë", "Sport", "Teknologji", "Humanitare", "Shërbime"];
const STEPS = ["Informacioni bazë", "Detajet", "Rishikimi"];

const KIND_COPY: Record<ListingKind, {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  heading: string;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  submitLabel: string;
}> = {
  volunteer_contribution: {
    title: "Kontribut Vullnetar",
    subtitle: "Po ofroj diçka: kohë, shërbim, objekt, transport, mësim ose ndihmë praktike.",
    icon: <HandHeartIcon className="h-6 w-6" />,
    heading: "Krijo kontribut vullnetar",
    titleLabel: "Çfarë ndihme po ofron? *",
    titlePlaceholder: "p.sh. Laptop për nxënës, transport falas, konsultim juridik",
    descriptionLabel: "Përshkrimi i kontributit *",
    descriptionPlaceholder: "Shpjego çfarë ofron, për kë është, kushtet dhe si do të dorëzohet ndihma...",
    submitLabel: "Publiko kontributin",
  },
  support_request: {
    title: "Kërkesë për Mbështetje",
    subtitle: "Po kërkoj ndihmë konkrete për vete, familje, komunitet ose një rast të verifikueshëm.",
    icon: <MegaphoneIcon className="h-6 w-6" />,
    heading: "Krijo kërkesë për mbështetje",
    titleLabel: "Çfarë mbështetjeje kërkon? *",
    titlePlaceholder: "p.sh. Pako ushqimore, libra shkollorë, transport për trajtim",
    descriptionLabel: "Përshkrimi i nevojës *",
    descriptionPlaceholder: "Shpjego situatën, pse kërkohet mbështetja dhe çfarë do të konsiderohet përmbushje...",
    submitLabel: "Publiko kërkesën",
  },
};

export default function KrijoShpalljePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [kind, setKind] = React.useState<ListingKind | null>(null);
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    organization: "",
    location: "",
    category: "",
    hoursPerWeek: "",
    startDate: "",
    remote: false,
    imageUrl: undefined as string | undefined,
    adminReviewRequired: true,
  });

  function update(field: string, value: string | boolean | undefined) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetKind(nextKind: ListingKind) {
    setKind(nextKind);
    setStep(0);
  }

  async function handleSubmit() {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent("/dashboard/krijo/shpallje")}`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      await apiFetch("/volunteers", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          kind: kind === "support_request" ? "SUPPORT_REQUEST" : "VOLUNTEER_CONTRIBUTION",
          category: form.category,
          location: form.remote ? "Online" : form.location,
          organization: form.organization || undefined,
          valueLabel: form.hoursPerWeek || undefined,
          remote: form.remote,
          images: form.imageUrl ? [form.imageUrl] : [],
          conditions: form.hoursPerWeek || undefined,
        }),
      });
      router.push("/dashboard/shpalljet");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Shpallja nuk u krijua.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!kind) {
    return (
      <DashboardLayout activeKey="shpalljet">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Krijo shpallje</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-950">Çfarë dëshiron të krijosh?</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Për ta shmangur konfuzionin, Unify i ndan shpalljet në dy kategori akademike:
              kontribute që ofrohen dhe kërkesa për mbështetje që kërkojnë ndihmë.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(["volunteer_contribution", "support_request"] as const).map((item) => (
              <button
                key={item}
                onClick={() => resetKind(item)}
                className="rounded-3xl border border-gray-200 bg-white p-6 text-left transition-all hover:border-unify-blue hover:shadow-lg"
              >
                <span className="inline-flex rounded-2xl bg-unify-blue/10 p-3 text-unify-blue">
                  {KIND_COPY[item].icon}
                </span>
                <h2 className="mt-5 font-display text-2xl text-gray-950">{KIND_COPY[item].title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{KIND_COPY[item].subtitle}</p>
                <p className="mt-5 text-sm font-bold text-unify-blue">Vazhdo →</p>
              </button>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const copy = KIND_COPY[kind];
  const canProceed = [
    form.title.trim() && form.category && form.description.trim(),
    form.location.trim() || form.remote,
    true,
  ][step];

  return (
    <DashboardLayout activeKey="shpalljet">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <button onClick={() => setKind(null)} className="text-xs font-bold text-unify-blue hover:underline">
              ← Ndrysho llojin
            </button>
            <h1 className="mt-2 text-2xl font-bold text-gray-950">{copy.heading}</h1>
            <p className="mt-1 text-sm text-gray-500">{copy.subtitle}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-unify-blue/10 px-3 py-1.5 text-xs font-bold text-unify-blue">
            {copy.icon}
            {copy.title}
          </span>
        </div>

        <Stepper steps={STEPS} current={step} />

        <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
          {step === 0 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="title">{copy.titleLabel}</Label>
                <Input
                  id="title"
                  placeholder={copy.titlePlaceholder}
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="organization">Emri i personit / organizatës</Label>
                <Input
                  id="organization"
                  placeholder="p.sh. Elon Berisha, OJQ Drita, Familja Krasniqi"
                  value={form.organization}
                  onChange={(event) => update("organization", event.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Kategoria *</Label>
                <Select value={form.category} onValueChange={(value) => update("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zgjidh kategorinë" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">{copy.descriptionLabel}</Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder={copy.descriptionPlaceholder}
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                <div>
                  <Label>Shpallje online / në distancë</Label>
                  <p className="text-xs text-gray-500">Nëse ndizet, lokacioni fizik nuk është i domosdoshëm.</p>
                </div>
                <Switch checked={form.remote} onCheckedChange={(value) => update("remote", value)} />
              </div>

              {!form.remote && (
                <div className="space-y-1.5">
                  <Label htmlFor="location">Vendndodhja *</Label>
                  <Input
                    id="location"
                    placeholder="p.sh. Prishtinë"
                    value={form.location}
                    onChange={(event) => update("location", event.target.value)}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="hours">Koha / vlera e ndihmës</Label>
                <Input
                  id="hours"
                  placeholder={kind === "volunteer_contribution" ? "p.sh. 1 laptop, 4 orë/javë, 1 seancë" : "p.sh. 1 pako ushqimore, 2 libra, transport"}
                  value={form.hoursPerWeek}
                  onChange={(event) => update("hoursPerWeek", event.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="startDate">Data e fillimit / dorëzimit</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(event) => update("startDate", event.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Foto (opsionale)</Label>
                <ImageUploadZone
                  value={form.imageUrl}
                  onChange={(file) => update("imageUrl", file ? URL.createObjectURL(file) : undefined)}
                  label="Ngarko foto"
                  hint="JPG, PNG deri 10 MB"
                  aspect="video"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Rishikimi final</h3>
              {error && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
              <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-900">
                Pas pranimit të një kërkese nga pronari, rasti shkon te admini për verifikim final.
                Nëse aprovohet, shpallja mbyllet si e përmbushur dhe shfaqet në historik.
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Lloji</dt>
                  <dd className="font-medium text-right">{copy.title}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Titulli</dt>
                  <dd className="font-medium text-right">{form.title || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Kategoria</dt>
                  <dd className="font-medium text-right">{form.category || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Vendndodhja</dt>
                  <dd className="font-medium text-right">{form.remote ? "Distancë" : form.location || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Koha / vlera</dt>
                  <dd className="font-medium text-right">{form.hoursPerWeek || "—"}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => (step === 0 ? router.push("/dashboard/shpalljet") : setStep((current) => current - 1))}
          >
            {step === 0 ? "Anulo" : "Kthehu"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((current) => current + 1)} disabled={!canProceed}>Vazhdo</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Duke ruajtur..." : copy.submitLabel}
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
