"use client";

// ============================================================
// Wizard 6-hapësh — Kampanjë Donacionesh (e avancuar)
//   Hapi 1: Problemi
//   Hapi 2: Storyja + Multimedia
//   Hapi 3: Plani i Zgjidhjes
//   Hapi 4: Buxheti
//   Hapi 5: FAQ + Transparency
//   Hapi 6: Preview + Publikim
// ============================================================

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MultiImageUpload } from "@/components/dashboard";
import {
  Button, Input, Textarea, Label, Badge,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import { CheckIcon, TrashIcon, PlusIcon } from "@/components/icons";
import { apiFetch } from "@/app/_lib/api";

const CATEGORIES = [
  { label: "Mjekësore", value: "MEDICAL" },
  { label: "Arsim", value: "EDUCATION" },
  { label: "Emergjencë", value: "EMERGENCY" },
  { label: "Komunitare", value: "COMMUNITY" },
  { label: "Sport", value: "SPORTS" },
  { label: "Mjedis", value: "ENVIRONMENT" },
  { label: "Kafshët", value: "ANIMALS" },
  { label: "Teknologji", value: "TECHNOLOGY" },
  { label: "Kreative", value: "CREATIVE" },
  { label: "Tjera", value: "OTHER" },
];

const LOCATIONS = ["Prishtinë", "Prizren", "Mitrovicë", "Pejë", "Ferizaj", "Gjakovë", "Gjilan", "Tiranë", "Tetovë", "Shkup", "Diasporë", "Online"];

const STEP_LABELS = ["Problemi", "Storyja", "Plani", "Buxheti", "FAQ", "Preview"];

interface Milestone { id: string; name: string; target: string; deadline: string }
interface BudgetItem { id: string; label: string; amount: string }
interface FaqItem { id: string; q: string; a: string }
interface BudgetBreakdown { id: string; label: string; pct: string }

function WizardStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between w-full overflow-x-auto pb-2">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const isLast = i === STEP_LABELS.length - 1;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition ${
                  done ? "bg-green-600 text-white" : active ? "bg-unify-blue text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {done ? <CheckIcon className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${
                done ? "text-green-600" : active ? "text-unify-blue" : "text-gray-400"
              }`}>{label}</span>
            </div>
            {!isLast && <div className={`flex-1 h-0.5 mx-2 mb-4 transition ${i < current ? "bg-green-600" : "bg-gray-200"}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function KrijoKampanjePage() {
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const [step, setStep] = useState(0);

  // Hapi 1
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [targetGroup, setTargetGroup] = useState("");
  const [urgency, setUrgency] = useState(5);

  // Hapi 2
  const [background, setBackground] = useState("");
  const [timeline, setTimeline] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");

  // Hapi 3
  const [solutionPlan, setSolutionPlan] = useState("");
  const [breakdown, setBreakdown] = useState<BudgetBreakdown[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [verificationPlan, setVerificationPlan] = useState("");

  // Hapi 4
  const [targetAmount, setTargetAmount] = useState("");
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [tip, setTip] = useState("5");
  const [endDate, setEndDate] = useState("");

  // Hapi 5
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [supportingDocs, setSupportingDocs] = useState<string[]>([]);
  const [partners, setPartners] = useState("");

  function addBreakdown() {
    setBreakdown((p) => [...p, { id: `b${Date.now()}`, label: "", pct: "" }]);
  }
  function addMilestone() {
    setMilestones((p) => [...p, { id: `m${Date.now()}`, name: "", target: "", deadline: "" }]);
  }
  function addBudgetItem() {
    setBudgetItems((p) => [...p, { id: `bi${Date.now()}`, label: "", amount: "" }]);
  }
  function addFaq() {
    setFaqs((p) => [...p, { id: `f${Date.now()}`, q: "", a: "" }]);
  }

  async function handleSubmit() {
    try {
      const token = isSignedIn ? await getToken() : null;
      await apiFetch("/campaigns", {
        method: "POST",
        token,
        body: JSON.stringify({
          title, shortDescription,
          description: `${problemStatement}\n\n## Storyja\n${background}\n\n## Timeline\n${timeline}\n\n## Plani\n${solutionPlan}\n\n## Rezultati i pritur\n${expectedOutcome}`,
          category, location,
          problemStatement, targetGroup, urgency,
          images, videoUrl,
          breakdown, milestones, budgetItems,
          targetAmount: Number(targetAmount),
          endsAt: endDate ? new Date(endDate).toISOString() : undefined,
          tipPercent: Number(tip),
          faqs, supportingDocs, partners,
          isUrgent: urgency >= 8,
          verificationPlan, expectedOutcome,
        }),
      });
      router.push("/dashboard/kampanjat?created=1");
    } catch (e) {
      const msg = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e)
      alert(msg || "Gabim gjatë krijimit të kampanjës")
    }
  }

  const canProceed = [
    title.trim() && category && location && problemStatement.trim().length >= 50 && targetGroup.trim(),
    background.trim().length >= 50 && images.length > 0,
    solutionPlan.trim().length >= 50 && milestones.length > 0,
    Number(targetAmount) >= 50 && budgetItems.length > 0 && endDate,
    true,
    true,
  ][step];

  return (
    <DashboardLayout activeKey="kampanjat">
      <div className="max-w-4xl space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Krijo Kampanjë</p>
          <h1 className="text-2xl font-bold text-gray-900">Hapi {step + 1} nga {STEP_LABELS.length} — {STEP_LABELS[step]}</h1>
          <p className="text-sm text-gray-500 mt-1">Kampanja është një projekt serioz që zgjidh problem të madh — kushtoji kohë çdo hapi.</p>
        </div>

        <WizardStepper current={step} />

        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">

          {/* ── HAPI 1: Problemi ─────────────────────────── */}
          {step === 0 && (
            <>
              <h2 className="font-bold text-lg text-gray-900">Identifikimi i Problemit</h2>
              <p className="text-sm text-gray-500">Çfarë problem po zgjidhin? Kush preken? Sa urgjente?</p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Titulli i Kampanjës *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="p.sh. Operacion urgjent për Arianitin (5 vjeç)" />
                </div>

                <div className="space-y-1.5">
                  <Label>Përshkrim i shkurtër (max 200 karaktere) *</Label>
                  <Textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} maxLength={200} rows={2} placeholder="Një fjali që përmbledh kampanjën — për kartat e listimit dhe SEO." />
                  <span className="text-xs text-gray-400">{shortDescription.length}/200</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Kategoria *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue placeholder="Zgjidh" /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Lokacioni *</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger><SelectValue placeholder="Zgjidh qytetin" /></SelectTrigger>
                      <SelectContent>{LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Cila është problema? * (min 50 karaktere)</Label>
                  <Textarea value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} rows={5} placeholder="Përshkruaj qartë problemin që duhet zgjidhur. Çfarë pasoja ka? Sa kohë ka që ekziston?" />
                  <span className="text-xs text-gray-400">{problemStatement.length} karaktere</span>
                </div>

                <div className="space-y-1.5">
                  <Label>Kush preken? *</Label>
                  <Input value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)} placeholder="p.sh. Familjet me të ardhura të ulëta në komunën e Lipjanit" />
                </div>

                <div className="space-y-1.5">
                  <Label>Urgjenca: <span className="font-bold text-unify-blue">{urgency}/10</span></Label>
                  <input type="range" min={1} max={10} value={urgency} onChange={(e) => setUrgency(Number(e.target.value))} className="w-full accent-unify-blue" />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>1 — Mund të presë</span>
                    <span>10 — Emergjencë absolute</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── HAPI 2: Storyja ─────────────────────────── */}
          {step === 1 && (
            <>
              <h2 className="font-bold text-lg text-gray-900">Storyja & Multimedia</h2>
              <p className="text-sm text-gray-500">Trego sfondin, çfarë ka ndodhur, dhe sill provat. Foto/video ndihmojnë shumë.</p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Sfondi i situatës * (min 50 karaktere)</Label>
                  <Textarea value={background} onChange={(e) => setBackground(e.target.value)} rows={6} placeholder="Trego storyn — kush janë njerëzit, çfarë i ka çuar në këtë situatë, çfarë kanë provuar deri tani..." />
                </div>

                <div className="space-y-1.5">
                  <Label>Timeline i ngjarjeve (opsionale)</Label>
                  <Textarea value={timeline} onChange={(e) => setTimeline(e.target.value)} rows={4} placeholder="Janar 2025: Diagnostikim&#10;Mars 2025: Operacioni i parë&#10;Qershor 2025: Komplikime..." />
                </div>

                <div className="space-y-1.5">
                  <Label>Foto * (min 1, max 10) — sa më shumë, aq më besueshme</Label>
                  <MultiImageUpload
                    images={images}
                    onChange={setImages}
                    max={10}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Video URL (YouTube/Vimeo, opsionale)</Label>
                  <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
                </div>
              </div>
            </>
          )}

          {/* ── HAPI 3: Plani ─────────────────────────── */}
          {step === 2 && (
            <>
              <h2 className="font-bold text-lg text-gray-900">Plani i Zgjidhjes</h2>
              <p className="text-sm text-gray-500">Si do të përdoren paratë? Çfarë rezultati pritet?</p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Si do të zgjidhet problemi? * (min 50 karaktere)</Label>
                  <Textarea value={solutionPlan} onChange={(e) => setSolutionPlan(e.target.value)} rows={5} placeholder="Trego planin konkret — hapat, kush do ta bëjë, kur..." />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Si shpërndahen paratë (% breakdown)</Label>
                    <Button size="sm" variant="outline" onClick={addBreakdown}><PlusIcon className="h-3 w-3 mr-1" /> Shto rresht</Button>
                  </div>
                  {breakdown.map((b, i) => (
                    <div key={b.id} className="flex gap-2 items-center">
                      <Input className="flex-1" placeholder="Etiketa (p.sh. Materiale)" value={b.label} onChange={(e) => setBreakdown((p) => p.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                      <Input className="w-24" type="number" placeholder="%" value={b.pct} onChange={(e) => setBreakdown((p) => p.map((x, j) => j === i ? { ...x, pct: e.target.value } : x))} />
                      <Button size="sm" variant="outline" onClick={() => setBreakdown((p) => p.filter((_, j) => j !== i))}><TrashIcon className="h-3 w-3" /></Button>
                    </div>
                  ))}
                  {breakdown.length > 0 && (
                    <p className="text-xs text-gray-500">Total: {breakdown.reduce((s, x) => s + (Number(x.pct) || 0), 0)}% (duhet 100%)</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Milestones * (faza me shuma + deadline)</Label>
                    <Button size="sm" variant="outline" onClick={addMilestone}><PlusIcon className="h-3 w-3 mr-1" /> Shto milestone</Button>
                  </div>
                  {milestones.map((m, i) => (
                    <div key={m.id} className="grid grid-cols-12 gap-2 items-center">
                      <Input className="col-span-5" placeholder="Emri i fazës" value={m.name} onChange={(e) => setMilestones((p) => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                      <Input className="col-span-3" type="number" placeholder="€" value={m.target} onChange={(e) => setMilestones((p) => p.map((x, j) => j === i ? { ...x, target: e.target.value } : x))} />
                      <Input className="col-span-3" type="date" value={m.deadline} onChange={(e) => setMilestones((p) => p.map((x, j) => j === i ? { ...x, deadline: e.target.value } : x))} />
                      <Button size="sm" variant="outline" className="col-span-1" onClick={() => setMilestones((p) => p.filter((_, j) => j !== i))}><TrashIcon className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <Label>Çfarë rezultati pritet? *</Label>
                  <Textarea value={expectedOutcome} onChange={(e) => setExpectedOutcome(e.target.value)} rows={3} placeholder="Pas 6 muajsh, X persona do të kenë akses në..." />
                </div>

                <div className="space-y-1.5">
                  <Label>Plan verifikimi (si do të dëshmosh që paratë u përdorën mirë)</Label>
                  <Textarea value={verificationPlan} onChange={(e) => setVerificationPlan(e.target.value)} rows={3} placeholder="Foto/video çdo muaj, raporte progresi, faturat e shpenzimeve..." />
                </div>
              </div>
            </>
          )}

          {/* ── HAPI 4: Buxheti ─────────────────────────── */}
          {step === 3 && (
            <>
              <h2 className="font-bold text-lg text-gray-900">Buxheti i Plotë</h2>
              <p className="text-sm text-gray-500">Sa duhen gjithsej? Detajet me shumë.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Shuma totale (€) *</Label>
                    <Input type="number" min={50} value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="5000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Data e përfundimit *</Label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Items të buxhetit *</Label>
                    <Button size="sm" variant="outline" onClick={addBudgetItem}><PlusIcon className="h-3 w-3 mr-1" /> Shto item</Button>
                  </div>
                  {budgetItems.map((it, i) => (
                    <div key={it.id} className="flex gap-2 items-center">
                      <Input className="flex-1" placeholder="p.sh. Operacioni mjekësor" value={it.label} onChange={(e) => setBudgetItems((p) => p.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                      <Input className="w-32" type="number" placeholder="€" value={it.amount} onChange={(e) => setBudgetItems((p) => p.map((x, j) => j === i ? { ...x, amount: e.target.value } : x))} />
                      <Button size="sm" variant="outline" onClick={() => setBudgetItems((p) => p.filter((_, j) => j !== i))}><TrashIcon className="h-3 w-3" /></Button>
                    </div>
                  ))}
                  {budgetItems.length > 0 && (
                    <p className="text-xs text-gray-500">Total items: €{budgetItems.reduce((s, x) => s + (Number(x.amount) || 0), 0).toFixed(2)} / Target: €{Number(targetAmount).toFixed(2)}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Tip për Unify (opsionale)</Label>
                  <Select value={tip} onValueChange={setTip}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0% — Pa tip</SelectItem>
                      <SelectItem value="5">5% — Standardi</SelectItem>
                      <SelectItem value="10">10% — Mbështetës i Unify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* ── HAPI 5: FAQ + Transparency ─────────────────────────── */}
          {step === 4 && (
            <>
              <h2 className="font-bold text-lg text-gray-900">FAQ + Dokumente Mbështetëse</h2>
              <p className="text-sm text-gray-500">Pyetje të shpeshta + dokumente që rrisin besueshmërinë.</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Pyetjet e shpeshta</Label>
                    <Button size="sm" variant="outline" onClick={addFaq}><PlusIcon className="h-3 w-3 mr-1" /> Shto FAQ</Button>
                  </div>
                  {faqs.map((f, i) => (
                    <div key={f.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
                      <Input placeholder="Pyetja" value={f.q} onChange={(e) => setFaqs((p) => p.map((x, j) => j === i ? { ...x, q: e.target.value } : x))} />
                      <Textarea placeholder="Përgjigja" rows={2} value={f.a} onChange={(e) => setFaqs((p) => p.map((x, j) => j === i ? { ...x, a: e.target.value } : x))} />
                      <Button size="sm" variant="outline" onClick={() => setFaqs((p) => p.filter((_, j) => j !== i))}><TrashIcon className="h-3 w-3" /> Hiq</Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <Label>Dokumente mbështetëse (medical reports, ID, etj.)</Label>
                  <MultiImageUpload images={supportingDocs} onChange={setSupportingDocs} max={5} />
                </div>

                <div className="space-y-1.5">
                  <Label>Bashkëpunëtorë / Organizatë (opsionale)</Label>
                  <Input value={partners} onChange={(e) => setPartners(e.target.value)} placeholder="p.sh. Caritas Kosova, Spitali UCCK..." />
                </div>
              </div>
            </>
          )}

          {/* ── HAPI 6: Preview ─────────────────────────── */}
          {step === 5 && (
            <>
              <h2 className="font-bold text-lg text-gray-900">Preview & Publikim</h2>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                {images[0] && <img src={images[0]} alt="" className="w-full h-56 object-cover" />}
                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{CATEGORIES.find((c) => c.value === category)?.label ?? "—"}</Badge>
                    <Badge variant="outline">{location}</Badge>
                    {urgency >= 8 && <Badge variant="destructive">URGJENTE ({urgency}/10)</Badge>}
                  </div>
                  <h3 className="text-2xl font-bold">{title || "—"}</h3>
                  <p className="text-sm text-gray-600">{shortDescription}</p>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div><span className="text-gray-500">Target:</span> <strong>€{Number(targetAmount).toFixed(2)}</strong></div>
                    <div><span className="text-gray-500">Items:</span> <strong>{budgetItems.length}</strong></div>
                    <div><span className="text-gray-500">Milestones:</span> <strong>{milestones.length}</strong></div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-900">
                ⚠️ Pas publikimit, kampanja shkon në statusin <strong>PENDING</strong> dhe pret aprovim nga admini.
              </div>
            </>
          )}

          {/* Footer nav */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              ← Mbrapa
            </Button>
            <div className="text-xs text-gray-400">{step + 1} / {STEP_LABELS.length}</div>
            {step < STEP_LABELS.length - 1 ? (
              <Button disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>
                Vazhdo →
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Publiko Kampanjën
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

