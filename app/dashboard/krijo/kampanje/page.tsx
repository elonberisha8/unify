"use client";

// ============================================================
// BRANCH: feat/dashboard-campaigns
// FIGMA:
//   • Hapi 1 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=58-2
//   • Hapi 2 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=142-2
//   • Hapi 3 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=143-2
//   • Hapi 4 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=144-2
// ============================================================

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ImageUploadZone } from "@/components/dashboard";
import {
  Button, Input, Textarea, Label,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import { CheckIcon, TrashIcon, EditIcon, PlusIcon } from "@/components/icons";
import { apiFetch } from "@/app/_lib/api";

// ── Constants ────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Humanitare", value: "COMMUNITY" },
  { label: "Arsim", value: "EDUCATION" },
  { label: "Shendetesia", value: "MEDICAL" },
  { label: "Mjedis", value: "ENVIRONMENT" },
  { label: "Sport", value: "SPORTS" },
  { label: "Teknologji", value: "TECHNOLOGY" },
  { label: "Emergjence", value: "EMERGENCY" },
];
const LOCATIONS = ["Prishtinë", "Prizren", "Mitrovicë", "Pejë", "Ferizaj", "Gjakovë", "Gjilan", "Vushtrri", "Podujevë", "Online"];

const STEP_LABELS = ["Detajet", "Fotot", "Financiare", "Preview"];

interface Milestone {
  id: string;
  name: string;
  target: string;
}

// ── Custom Stepper ────────────────────────────────────────────

function WizardStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between w-full">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const isLast = i === STEP_LABELS.length - 1;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-display text-base transition-colors ${
                  done
                    ? "bg-green-600 text-white"
                    : active
                    ? "bg-unify-blue text-white"
                    : "bg-[#dbe0eb] text-gray-500"
                }`}
              >
                {done ? <CheckIcon className="w-5 h-5" /> : i + 1}
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  done ? "text-green-600" : active ? "text-unify-blue" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${
                  i < current ? "bg-green-600" : "bg-[#dbe0eb]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export default function KrijoKampanjePage() {
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    urgent: false,
    imageUrl: undefined as string | undefined,
    goal: "",
    endDate: "",
    tip: "5",
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({ name: "", target: "" });
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);

  function update(field: string, value: string | boolean | undefined) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addMilestone() {
    if (!newMilestone.name.trim() || !newMilestone.target.trim()) return;
    setMilestones((prev) => [
      ...prev,
      { id: `m${Date.now()}`, name: newMilestone.name, target: newMilestone.target },
    ]);
    setNewMilestone({ name: "", target: "" });
  }

  function removeMilestone(id: string) {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleSubmit() {
    try {
      const token = isSignedIn ? await getToken() : null;
      await apiFetch("/campaigns", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          shortDescription: form.description.slice(0, 180),
          images: form.imageUrl && !form.imageUrl.startsWith("blob:") ? [form.imageUrl] : [],
          targetAmount: Number(form.goal),
          category: form.category,
          location: form.location,
          isUrgent: Boolean(form.urgent),
          endsAt: form.endDate ? new Date(form.endDate).toISOString() : undefined,
          milestones: milestones.map((milestone) => ({
            title: milestone.name,
            amount: Number(milestone.target),
          })),
        }),
      });
    } catch {}
    router.push("/dashboard/kampanjat");
  }

  const canProceed = [
    form.title.trim() && form.category && form.location && form.description.trim(),
    true,
    form.goal.trim(),
    true,
  ][step];

  return (
    <DashboardLayout activeKey="kampanjat">
      <div className="max-w-4xl space-y-6">

        {/* Page heading */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Krijo Kampanjë</p>
          <h1 className="text-xl font-display font-light text-gray-900">
            Hapi {step + 1} nga {STEP_LABELS.length}
          </h1>
        </div>

        {/* Stepper */}
        <WizardStepper current={step} />

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 space-y-6">

          {/* ── STEP 0: Detajet ─────────────────────────────── */}
          {step === 0 && (
            <>
              <div>
                <h2 className="font-display font-light text-lg text-gray-900">Informacioni Bazë</h2>
                <div className="border-t border-gray-200 mt-3" />
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Titulli i Kampanjës *
                  </Label>
                  <Input
                    className="bg-[#f7f7f7] border-gray-200 rounded-[14px] h-11"
                    placeholder="Titull i qartë dhe tërheqës — p.sh. 'Ujë i Pastër për Lipjan'"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                  />
                </div>

                {/* Category + Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Kategoria *
                    </Label>
                    <Select value={form.category} onValueChange={(v) => update("category", v)}>
                      <SelectTrigger className="bg-[#f7f7f7] border-gray-200 rounded-[14px] h-11">
                        <SelectValue placeholder="Zgjidh kategorinë" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Lokacioni *
                    </Label>
                    <Select value={form.location} onValueChange={(v) => update("location", v)}>
                      <SelectTrigger className="bg-[#f7f7f7] border-gray-200 rounded-[14px] h-11">
                        <SelectValue placeholder="Zgjidh lokacionin" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Përshkrimi i Shkurtër *
                  </Label>
                  <Textarea
                    className="bg-[#f7f7f7] border-gray-200 rounded-[14px]"
                    rows={4}
                    placeholder="Shkruaj përshkrim të shkurtër që shpjegon qëllimin e kampanjës..."
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
                </div>

                {/* Urgent checkbox */}
                <label className="flex items-center gap-3 bg-amber-50 rounded-[14px] px-4 py-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.urgent}
                    onChange={(e) => update("urgent", e.target.checked)}
                    className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-amber-600">🔴 Kampanja është URGJENTE</span>
                </label>
              </div>
            </>
          )}

          {/* ── STEP 1: Fotot ───────────────────────────────── */}
          {step === 1 && (
            <>
              <div>
                <h2 className="font-display font-light text-lg text-gray-900">Ngarko Fotot e Fushatës</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fotoja e parë do të jetë imazhi kryesor. Tërhiq dhe lësho skedarët ose kliko për të zgjedhur.
                </p>
                <div className="border-t border-gray-200 mt-3" />
              </div>

              <div className="space-y-4">
                <ImageUploadZone
                  value={form.imageUrl}
                  onChange={(file) => update("imageUrl", file ? URL.createObjectURL(file) : undefined)}
                  label="Tërhiq skedarët këtu ose klikoni për të zgjedhur"
                  hint="PNG, JPG, WEBP · Max 5MB për foto · Max 5 foto"
                  aspect="wide"
                />

                <div className="bg-amber-50 rounded-[14px] px-4 py-3">
                  <p className="text-sm text-amber-600">
                    💡 Këshillë: Fotot me dritë të mirë dhe të qarta marrin 40% më shumë donacione. Shmangi fotot e turbullta.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: Financiare ──────────────────────────── */}
          {step === 2 && (
            <>
              <div>
                <h2 className="font-display font-light text-lg text-gray-900">Informacioni Financiar</h2>
                <div className="border-t border-gray-200 mt-3" />
              </div>

              <div className="space-y-6">
                {/* Goal + End date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Shuma Target (EUR) *
                    </Label>
                    <Input
                      className="bg-[#f7f7f7] border-gray-200 rounded-[10px] h-12 text-2xl font-bold text-unify-blue"
                      type="number"
                      placeholder="10000"
                      value={form.goal}
                      onChange={(e) => update("goal", e.target.value)}
                    />
                    <p className="text-xs text-gray-400">Min: €50 · Nuk ka maksimum</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Data e Përfundimit
                    </Label>
                    <Input
                      className="bg-[#f7f7f7] border-gray-200 rounded-[10px] h-12"
                      type="date"
                      value={form.endDate}
                      onChange={(e) => update("endDate", e.target.value)}
                    />
                    <p className="text-xs text-gray-400">Lër bosh nëse nuk ka afat (Pa Afat)</p>
                  </div>
                </div>

                {/* Tip selector */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Tip opsional për Unify (% nga çdo donacion):
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "0", label: "0%", sub: "Asgjë" },
                      { value: "5", label: "5%", sub: "Rekomanduar" },
                      { value: "10", label: "10%", sub: "Shumë falë!" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update("tip", opt.value)}
                        className={`rounded-[14px] border-2 py-3 flex flex-col items-center transition-colors ${
                          form.tip === opt.value
                            ? "border-unify-blue bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <span className={`font-display text-xl ${form.tip === opt.value ? "text-unify-blue" : "text-gray-900"}`}>
                          {opt.label}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Milestones */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-gray-900">Milestones (opsionale)</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Ndaj kampanjën në faza me qëllime të ndërmjetme.</p>
                  </div>

                  <div className="space-y-2">
                    {milestones.map((m, i) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between bg-gray-50 border-l-4 border-green-600 rounded-[10px] pl-5 pr-4 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Faza {i + 1} — {m.name}</p>
                          <p className="text-xs text-gray-500">Target: €{m.target}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => removeMilestone(m.id)}
                            className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded px-2 py-1 transition-colors"
                          >
                            Hiq Fazën
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add milestone inline */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-gray-500">Emri i fazës</Label>
                      <Input
                        className="bg-gray-50 border-gray-200 rounded-[10px] h-9 text-sm"
                        placeholder="p.sh. Materiale filtrimi"
                        value={newMilestone.name}
                        onChange={(e) => setNewMilestone((p) => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="w-36 space-y-1">
                      <Label className="text-xs text-gray-500">Target (€)</Label>
                      <Input
                        className="bg-gray-50 border-gray-200 rounded-[10px] h-9 text-sm"
                        type="number"
                        placeholder="3000"
                        value={newMilestone.target}
                        onChange={(e) => setNewMilestone((p) => ({ ...p, target: e.target.value }))}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 text-unify-blue border-unify-blue/30 hover:bg-blue-50 text-xs font-semibold"
                      onClick={addMilestone}
                      disabled={!newMilestone.name.trim() || !newMilestone.target.trim()}
                    >
                      <PlusIcon className="h-3.5 w-3.5 mr-1" />
                      Shto
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 3: Preview ─────────────────────────────── */}
          {step === 3 && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 rounded px-2 py-0.5">DRAFT</span>
                  <h2 className="font-display font-bold text-xl text-unify-blue">Preview — Kampanja Jote</h2>
                </div>
                <div className="border-t border-gray-200 mt-3" />
              </div>

              <div className="space-y-6">
                {/* Campaign preview card */}
                <div className="flex gap-6">
                  {/* Image placeholder */}
                  <div
                    className="w-72 h-48 rounded-[14px] flex-shrink-0 flex items-end p-3 overflow-hidden"
                    style={{ background: form.imageUrl ? `url(${form.imageUrl}) center/cover` : "linear-gradient(152deg, #1e408b 0%, #009eff 100%)" }}
                  >
                    <span className="text-xs text-blue-200">
                      {form.imageUrl ? "Foto kryesore" : "Foto 1 / 0"}
                    </span>
                  </div>

                  {/* Campaign info */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-display text-xl text-gray-900">
                      {form.title || "Titulli i kampanjës..."}
                    </h3>
                    <div className="flex gap-2">
                      {form.category && (
                        <span className="text-xs bg-blue-50 text-unify-blue rounded-full px-2 py-0.5">{form.category}</span>
                      )}
                      {form.location && (
                        <span className="text-xs bg-gray-50 text-gray-500 rounded-full px-2 py-0.5">{form.location}</span>
                      )}
                      {form.urgent && (
                        <span className="text-xs bg-red-50 text-red-600 rounded-full px-2 py-0.5">🔴 Urgjente</span>
                      )}
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-unify-blue rounded-full" style={{ width: "0%" }} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>€0 / €{form.goal || "10,000"}</span>
                      <span>{form.endDate || "Pa afat"}</span>
                    </div>
                    <button
                      disabled
                      className="w-full bg-unify-blue text-white rounded-[14px] py-2.5 text-sm font-bold opacity-70 cursor-not-allowed"
                    >
                      DONO TANI (i bllokuar deri në aprovim)
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Pre-publish checklist */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-sm text-gray-900">Lista kontrollit përpara publikimit:</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {[
                      { label: "Titulli i kompletuar", done: !!form.title.trim() },
                      { label: `Foto e ngarkuar (${form.imageUrl ? "1" : "0"} foto)`, done: !!form.imageUrl },
                      { label: `Shuma target: €${form.goal || "—"}`, done: !!form.goal.trim() },
                      { label: `Milestone ${milestones.length} ${milestones.length === 1 ? "fazë" : "faza"}`, done: true },
                      { label: "Identiteti i verifikuar", done: true },
                      { label: "Llogaria bankare e lidhur (Stripe)", done: true },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div
                          className={`w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0 ${
                            item.done ? "bg-green-600" : "bg-gray-200"
                          }`}
                        >
                          {item.done && <CheckIcon className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-800">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-[14px] px-4 py-3">
                  <p className="text-sm text-amber-600">
                    ⚠️ Pasi të klikoni "Publiko", kampanja shkon PENDING dhe ekipi i Unify e shqyrton brenda 24 orësh.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
            onClick={() => step === 0 ? router.push("/dashboard/kampanjat") : setStep((s) => s - 1)}
          >
            {step === 0 ? "← Anullo" : "← Kthehu"}
          </Button>

          {step < 3 ? (
            <Button
              className="bg-unify-blue hover:bg-unify-blue/90 text-white"
              onClick={() => setStep((s) => s + 1)}
            >
              Vazhdo: {STEP_LABELS[step + 1]} →
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6"
              onClick={handleSubmit}
            >
              ✓ Publiko Kampanjën — Dërgo për Aprovim
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
