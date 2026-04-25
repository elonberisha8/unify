"use client";

// ============================================================
// BRANCH: feat/dashboard-campaigns
// FIGMA:
//   • Krijo Shpallje Vullnetare — Hapi 1 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=59-2
//   • Krijo Shpallje Vullnetare — Hapi 2 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=145-2
//   • Krijo Shpallje Vullnetare — Hapi 3 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=146-2
// NOTION: https://www.notion.so/34874891227e8166b6e1db98166ca406
// ============================================================

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadZone } from "@/components/dashboard";
import {
  Button, Input, Textarea, Label, Switch,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
  Stepper,
} from "@/components/ui";
import { DashboardLayout } from "@/components/layout";

const CATEGORIES = ["Arsim", "Shëndetësi", "Mjedis", "Kulturë", "Sport", "Teknologji", "Humanitare"];

const STEPS = ["Informacioni bazë", "Detajet e pozicionit", "Rishikimi"];

export default function KrijoShpalljeVullnefarePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    organization: "",
    location: "",
    category: "",
    hoursPerWeek: "",
    startDate: "",
    remote: false,
    imageUrl: undefined as string | undefined,
  });

  function update(field: string, value: string | boolean | undefined) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/dashboard/shpalljet");
  }

  return (
    <DashboardLayout activeKey="shpalljet">
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Krijo shpallje vullnetare</h1>
          <p className="text-sm text-gray-500 mt-1">Gjej vullnetarë për organizatën tënde.</p>
        </div>

        <Stepper steps={STEPS} current={step} />

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          {step === 0 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="title">Titulli i pozicionit *</Label>
                <Input
                  id="title"
                  placeholder="p.sh. Mësues vullnetar i gjuhës angleze"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="organization">Organizata *</Label>
                <Input
                  id="organization"
                  placeholder="Emri i organizatës suaj"
                  value={form.organization}
                  onChange={(e) => update("organization", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Kategoria *</Label>
                <Select value={form.category} onValueChange={(v) => update("category", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Zgjedh kategorinë" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Përshkrimi *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Përshkruaj rolin dhe përgjegjësitë..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="location">Vendndodhja</Label>
                <Input
                  id="location"
                  placeholder="p.sh. Prishtinë"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Punë në distancë</Label>
                <Switch
                  checked={form.remote}
                  onCheckedChange={(v) => update("remote", v)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hours">Orë në javë</Label>
                <Input
                  id="hours"
                  placeholder="p.sh. 4-6 orë/javë"
                  value={form.hoursPerWeek}
                  onChange={(e) => update("hoursPerWeek", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Data e fillimit</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
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
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Titulli</dt>
                  <dd className="font-medium">{form.title || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Organizata</dt>
                  <dd className="font-medium">{form.organization || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Kategoria</dt>
                  <dd className="font-medium">{form.category || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Vendndodhja</dt>
                  <dd className="font-medium">{form.remote ? "Distancë" : form.location || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Orë/javë</dt>
                  <dd className="font-medium">{form.hoursPerWeek || "—"}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => (step === 0 ? router.push("/dashboard/shpalljet") : setStep((s) => s - 1))}
          >
            {step === 0 ? "Anulo" : "Kthehu"}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Vazhdo</Button>
          ) : (
            <Button onClick={handleSubmit}>Publiko shpalljen</Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
