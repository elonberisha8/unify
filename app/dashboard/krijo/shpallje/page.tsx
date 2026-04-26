"use client";

// ============================================================
// Wizard Shpallje Vullnetare — me dropdown HelpType
//   Hapi 1: Lloji
//   Hapi 2: Detajet (forma ndryshon sipas llojit)
//   Hapi 3: Preview + Publikim
// ============================================================

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MultiImageUpload } from "@/components/dashboard";
import {
  Button, Input, Textarea, Label, Badge, Switch,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import { CheckIcon, GiftIcon, HandHeartIcon, WalletIcon } from "@/components/icons";
import { apiFetch } from "@/app/_lib/api";

type HelpType = "PHYSICAL_ITEM" | "SERVICE" | "FUND";

const HELP_TYPES: Record<HelpType, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  PHYSICAL_ITEM: {
    label: "Send fizik",
    description: "Rroba, pajisje, mobilie, libra, ushqim, etj.",
    icon: <GiftIcon className="h-6 w-6" />,
    color: "from-emerald-500 to-teal-600",
  },
  SERVICE: {
    label: "Shërbim / Kohë",
    description: "Mësimdhënie, riparime, transport, ndihmë profesionale.",
    icon: <HandHeartIcon className="h-6 w-6" />,
    color: "from-blue-500 to-indigo-600",
  },
  FUND: {
    label: "Para / Fond monetar",
    description: "Mini-grant për qëllim specifik.",
    icon: <WalletIcon className="h-6 w-6" />,
    color: "from-amber-500 to-orange-600",
  },
};

const CATEGORIES_BY_TYPE: Record<HelpType, string[]> = {
  PHYSICAL_ITEM: ["Rroba", "Pajisje elektronike", "Mobilie", "Libra", "Ushqim", "Lojëra", "Tjera"],
  SERVICE: ["Mësimdhënie", "Riparim", "Transport", "Përkthim", "IT", "Ndihmë mjekësore", "Konsulencë", "Tjera"],
  FUND: ["Mjekësore", "Arsim", "Emergjencë", "Familje", "Biznes i vogël", "Tjera"],
};

const CONDITIONS = ["E re", "Si e re", "E mirë", "E përdorur — funksionale", "Për pjesë"];
const LOCATIONS = ["Prishtinë", "Prizren", "Mitrovicë", "Pejë", "Ferizaj", "Gjakovë", "Gjilan", "Tiranë", "Shkup", "Diasporë", "Online"];
const STEP_LABELS = ["Lloji", "Detajet", "Preview"];

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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition ${
                done ? "bg-green-600 text-white" : active ? "bg-unify-blue text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {done ? <CheckIcon className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${done ? "text-green-600" : active ? "text-unify-blue" : "text-gray-400"}`}>{label}</span>
            </div>
            {!isLast && <div className={`flex-1 h-0.5 mx-2 mb-4 transition ${i < current ? "bg-green-600" : "bg-gray-200"}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function KrijoShpalljePage() {
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const [step, setStep] = useState(0);
  const [helpType, setHelpType] = useState<HelpType | "">("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [conditions, setConditions] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // PHYSICAL_ITEM
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");

  // SERVICE
  const [serviceDuration, setServiceDuration] = useState("");
  const [serviceAvailability, setServiceAvailability] = useState("");

  // FUND
  const [maxAmount, setMaxAmount] = useState("");
  const [fundPurpose, setFundPurpose] = useState("");
  const [fundCriteria, setFundCriteria] = useState("");

  async function handleSubmit() {
    try {
      const token = isSignedIn ? await getToken() : null;
      const payload: Record<string, unknown> = {
        title, description,
        subtype: helpType, helpType,
        category, location, images,
        conditions: conditions || undefined,
        applicationDeadline: deadline ? new Date(deadline).toISOString() : undefined,
        isAnonymous,
      };
      if (helpType === "PHYSICAL_ITEM") {
        payload.itemDetails = { quantity: itemQuantity, condition: itemCondition, pickupAddress };
      } else if (helpType === "SERVICE") {
        payload.serviceDetails = { duration: serviceDuration, availability: serviceAvailability };
      } else if (helpType === "FUND") {
        payload.fundDetails = { maxAmount: Number(maxAmount), purpose: fundPurpose, criteria: fundCriteria };
      }
      await apiFetch("/volunteers", { method: "POST", token, body: JSON.stringify(payload) });
      router.push("/dashboard/shpalljet?created=1");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gabim gjatë publikimit");
    }
  }

  const canProceed = [
    Boolean(helpType),
    title.trim().length >= 5 && description.trim().length >= 20 && category && location &&
      (helpType === "PHYSICAL_ITEM" ? Boolean(itemCondition && itemQuantity)
       : helpType === "SERVICE" ? Boolean(serviceDuration)
       : helpType === "FUND" ? Boolean(maxAmount && fundPurpose) : false),
    true,
  ][step];

  return (
    <DashboardLayout activeKey="shpalljet">
      <div className="max-w-4xl space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Krijo Shpallje Vullnetare</p>
          <h1 className="text-2xl font-bold text-gray-900">Hapi {step + 1} nga {STEP_LABELS.length} — {STEP_LABELS[step]}</h1>
        </div>

        <WizardStepper current={step} />

        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">

          {step === 0 && (
            <>
              <h2 className="font-bold text-lg text-gray-900">Çfarë lloj ndihme po ofron?</h2>
              <p className="text-sm text-gray-500">Zgjidh një nga 3 llojet — formulari do të përshtatet automatikisht.</p>

              <div className="grid gap-3 md:grid-cols-3">
                {(Object.keys(HELP_TYPES) as HelpType[]).map((t) => {
                  const meta = HELP_TYPES[t];
                  const selected = helpType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setHelpType(t)}
                      className={`relative rounded-xl border-2 p-5 text-left transition ${
                        selected ? "border-unify-blue bg-blue-50/60 shadow-md" : "border-gray-200 bg-white hover:border-unify-blue/40"
                      }`}
                    >
                      <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${meta.color} text-white p-2.5 mb-3`}>
                        {meta.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 text-base">{meta.label}</h3>
                      <p className="mt-1 text-sm text-gray-500 leading-snug">{meta.description}</p>
                      {selected && (
                        <span className="absolute top-3 right-3 inline-flex items-center justify-center h-6 w-6 rounded-full bg-unify-blue text-white">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && helpType && (
            <>
              <div className="flex items-center gap-3">
                <Badge>{HELP_TYPES[helpType as HelpType].label}</Badge>
                <button type="button" onClick={() => setStep(0)} className="text-xs text-unify-blue hover:underline">← Ndrysho llojin</button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Titulli * (5-200 karaktere)</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={
                    helpType === "PHYSICAL_ITEM" ? "p.sh. Dhuroj 2 kompjuterë për familje në nevojë"
                      : helpType === "SERVICE" ? "p.sh. Dhuroj orë mësimi anglisht falas"
                      : "p.sh. Mini-grant €500 për biznes të vogël"
                  } />
                </div>
                <div className="space-y-1.5">
                  <Label>Përshkrimi * (min 20 karaktere)</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Kategoria *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue placeholder="Zgjidh" /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES_BY_TYPE[helpType as HelpType].map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Lokacioni *</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger><SelectValue placeholder="Zgjidh" /></SelectTrigger>
                      <SelectContent>{LOCATIONS.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>

                {helpType === "PHYSICAL_ITEM" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Sasia *</Label>
                        <Input value={itemQuantity} onChange={(e) => setItemQuantity(e.target.value)} placeholder="p.sh. 2 copë" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Gjendja *</Label>
                        <Select value={itemCondition} onValueChange={setItemCondition}>
                          <SelectTrigger><SelectValue placeholder="Zgjidh" /></SelectTrigger>
                          <SelectContent>{CONDITIONS.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Adresa e marrjes (do shihet vetëm pas pranimit)</Label>
                      <Input value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Foto e sendit * (max 10) — sa më shumë, aq më besueshme</Label>
                      <MultiImageUpload images={images} onChange={setImages} max={10} />
                    </div>
                  </>
                )}

                {helpType === "SERVICE" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Kohëzgjatja *</Label>
                        <Input value={serviceDuration} onChange={(e) => setServiceDuration(e.target.value)} placeholder="p.sh. 2 orë në javë për 3 muaj" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Disponueshmëria</Label>
                        <Input value={serviceAvailability} onChange={(e) => setServiceAvailability(e.target.value)} placeholder="p.sh. Mbrëmjeve" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Foto opsionale (max 10)</Label>
                      <MultiImageUpload images={images} onChange={setImages} max={10} />
                    </div>
                  </>
                )}

                {helpType === "FUND" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Shuma maksimale (€) *</Label>
                        <Input type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="500" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Deadline aplikimi</Label>
                        <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Qëllimi specifik *</Label>
                      <Textarea value={fundPurpose} onChange={(e) => setFundPurpose(e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Kriteret e aplikantit</Label>
                      <Textarea value={fundCriteria} onChange={(e) => setFundCriteria(e.target.value)} rows={2} />
                    </div>
                  </>
                )}

                {helpType !== "FUND" && (
                  <>
                    <div className="space-y-1.5">
                      <Label>Kushtet e aplikimit (opsionale)</Label>
                      <Textarea value={conditions} onChange={(e) => setConditions(e.target.value)} rows={2} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Deadline aplikimi (opsionale)</Label>
                      <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    </div>
                  </>
                )}

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Publiko anonimisht</p>
                    <p className="text-xs text-gray-500">Vetëm admini sheh identitetin tënd. Aplikantët shohin "Pronar Anonim".</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && helpType && (
            <>
              <h2 className="font-bold text-lg text-gray-900">Preview & Publikim</h2>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                {images[0] && <img src={images[0]} alt="" className="w-full h-56 object-cover" />}
                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{HELP_TYPES[helpType as HelpType].label}</Badge>
                    <Badge variant="outline">{category}</Badge>
                    <Badge variant="outline">{location}</Badge>
                    {isAnonymous && <Badge variant="secondary">ANONIM</Badge>}
                  </div>
                  <h3 className="text-2xl font-bold">{title || "—"}</h3>
                  <p className="text-sm text-gray-600">{description}</p>

                  {helpType === "PHYSICAL_ITEM" && (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>Sasia:</strong> {itemQuantity}</p>
                      <p><strong>Gjendja:</strong> {itemCondition}</p>
                      {pickupAddress && <p><strong>Adresa:</strong> {pickupAddress}</p>}
                    </div>
                  )}
                  {helpType === "SERVICE" && (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>Kohëzgjatja:</strong> {serviceDuration}</p>
                      {serviceAvailability && <p><strong>Disponueshmëria:</strong> {serviceAvailability}</p>}
                    </div>
                  )}
                  {helpType === "FUND" && (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>Shuma maksimale:</strong> €{maxAmount}</p>
                      <p><strong>Qëllimi:</strong> {fundPurpose}</p>
                      {fundCriteria && <p><strong>Kriteret:</strong> {fundCriteria}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-900">
                ⚠️ Pas publikimit, shpallja shkon në statusin <strong>PENDING</strong> dhe pret aprovim nga admini.
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>← Mbrapa</Button>
            <div className="text-xs text-gray-400">{step + 1} / {STEP_LABELS.length}</div>
            {step < STEP_LABELS.length - 1 ? (
              <Button disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>Vazhdo →</Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">Publiko Shpalljen</Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

