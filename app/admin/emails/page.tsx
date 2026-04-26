"use client";

// ============================================================
// /admin/emails — Email Center (Resend)
//   • Templates: kampanja, donacioni, aplikimi, broadcast
//   • Dërgim manual me filter marrësish
//   • Email automatike (cron)
//   • Logs
// ============================================================

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { AdminLayout } from "@/components/layout";
import { Card, CardContent, Button, Input, Textarea, Label, Badge, Skeleton, Switch,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui";
import { PlusIcon, MailIcon, ClockIcon, CheckIcon, AlertTriangleIcon, EditIcon, TrashIcon, SendIcon } from "@/components/icons";
import { apiFetch, type EmailTemplate, type EmailLog, type ScheduledEmail } from "@/app/_lib/api";

const TAB_LABELS = ["Templates", "Dërgo Tani", "Automatike", "Logs"] as const;
type Tab = (typeof TAB_LABELS)[number];

const RECIPIENT_FILTERS = [
  { value: "all", label: "Të gjithë përdoruesit" },
  { value: "verified_creators", label: "Vetëm Krijuesit e Verifikuar" },
  { value: "donors", label: "Vetëm donatorët (kanë dhuruar)" },
  { value: "active_campaigns", label: "Pronarët e kampanjave aktive" },
  { value: "volunteers", label: "Vullnetarët (kanë postuar)" },
  { value: "specific", label: "Email specifik / Listë" },
];

const TEMPLATE_CATEGORIES = [
  { value: "CAMPAIGN", label: "Kampanja" },
  { value: "DONATION", label: "Donacion" },
  { value: "APPLICATION", label: "Aplikim" },
  { value: "BROADCAST", label: "Broadcast" },
  { value: "SYSTEM", label: "Sistemi" },
];

const TRIGGERS = [
  { value: "CAMPAIGN_DEADLINE", label: "Reminder kampanje (3 ditë para deadline)", default: 3 },
  { value: "WELCOME", label: "Welcome (1 ditë pas regjistrimit)", default: 1 },
  { value: "REENGAGEMENT", label: "Re-engagement (30 ditë inactive)", default: 30 },
  { value: "MONTHLY_STATS", label: "Stats mujore për krijuesit", default: 30 },
];

export default function AdminEmailsPage() {
  const { getToken } = useAuth();
  const [tab, setTab] = React.useState<Tab>("Templates");

  const [templates, setTemplates] = React.useState<EmailTemplate[]>([]);
  const [logs, setLogs] = React.useState<EmailLog[]>([]);
  const [scheduled, setScheduled] = React.useState<ScheduledEmail[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Send-now state
  const [sendSubject, setSendSubject] = React.useState("");
  const [sendBody, setSendBody] = React.useState("");
  const [recipientFilter, setRecipientFilter] = React.useState("all");
  const [specificEmails, setSpecificEmails] = React.useState("");
  const [scheduleAt, setScheduleAt] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sendOk, setSendOk] = React.useState<string | null>(null);

  // Template editor
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editTemplate, setEditTemplate] = React.useState<Partial<EmailTemplate>>({});

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const token = await getToken();
        const [t, l, s] = await Promise.all([
          apiFetch<EmailTemplate[] | { templates: EmailTemplate[] }>("/admin/emails/templates", { token }).catch(() => []),
          apiFetch<EmailLog[] | { logs: EmailLog[] }>("/admin/emails/logs", { token }).catch(() => []),
          apiFetch<ScheduledEmail[] | { scheduled: ScheduledEmail[] }>("/admin/emails/scheduled", { token }).catch(() => []),
        ]);
        setTemplates(Array.isArray(t) ? t : (t as { templates?: EmailTemplate[] }).templates ?? []);
        setLogs(Array.isArray(l) ? l : (l as { logs?: EmailLog[] }).logs ?? []);
        setScheduled(Array.isArray(s) ? s : (s as { scheduled?: ScheduledEmail[] }).scheduled ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  async function handleSendNow() {
    setSending(true);
    setSendOk(null);
    try {
      const token = await getToken();
      const res = await apiFetch<{ recipients: number; status: string }>("/admin/emails/send", {
        method: "POST",
        token,
        body: JSON.stringify({
          subject: sendSubject,
          body: sendBody,
          recipientFilter,
          specificEmails: recipientFilter === "specific" ? specificEmails.split(",").map((e) => e.trim()).filter(Boolean) : undefined,
          scheduleAt: scheduleAt || undefined,
        }),
      });
      setSendOk(`✓ Dërguar te ${res.recipients} marrës. Status: ${res.status}`);
      setSendSubject(""); setSendBody(""); setSpecificEmails(""); setScheduleAt("");
    } catch (e) {
      setSendOk(`✗ Gabim: ${e instanceof Error ? e.message : "I panjohur"}`);
    } finally {
      setSending(false);
    }
  }

  async function saveTemplate() {
    try {
      const token = await getToken();
      const url = editTemplate.id ? `/admin/emails/templates/${editTemplate.id}` : "/admin/emails/templates";
      const method = editTemplate.id ? "PATCH" : "POST";
      await apiFetch(url, { method, token, body: JSON.stringify(editTemplate) });
      setEditorOpen(false);
      setEditTemplate({});
      // Reload
      const t = await apiFetch<EmailTemplate[] | { templates: EmailTemplate[] }>("/admin/emails/templates", { token });
      setTemplates(Array.isArray(t) ? t : (t as { templates?: EmailTemplate[] }).templates ?? []);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gabim");
    }
  }

  async function deleteTemplate(id: string) {
    if (!confirm("Fshi këtë template?")) return;
    try {
      const token = await getToken();
      await apiFetch(`/admin/emails/templates/${id}`, { method: "DELETE", token });
      setTemplates((p) => p.filter((t) => t.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gabim");
    }
  }

  async function toggleScheduled(id: string, active: boolean) {
    try {
      const token = await getToken();
      await apiFetch(`/admin/emails/scheduled/${id}`, { method: "PATCH", token, body: JSON.stringify({ active }) });
      setScheduled((p) => p.map((s) => s.id === id ? { ...s, active } : s));
    } catch {}
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MailIcon className="h-6 w-6" /> Email Center
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Templates · Dërgim manual · Email automatike (cron) · Logs · Resend integration
          </p>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {TAB_LABELS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${tab === t ? "bg-unify-blue text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* TEMPLATES */}
        {tab === "Templates" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">{templates.length} templates ekzistuese</p>
              <Button onClick={() => { setEditTemplate({ category: "BROADCAST" }); setEditorOpen(true); }} className="gap-2">
                <PlusIcon className="h-4 w-4" /> Krijo Template
              </Button>
            </div>

            {loading ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
            ) : templates.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-sm text-gray-500">
                Asnjë template. Krijo të parin për të nisur.
              </CardContent></Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {templates.map((t) => (
                  <Card key={t.id} className="border border-gray-200">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge>{t.category}</Badge>
                          <h3 className="mt-2 font-bold text-gray-900">{t.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{t.subject}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => { setEditTemplate(t); setEditorOpen(true); }}><EditIcon className="h-3 w-3" /></Button>
                          <Button size="sm" variant="outline" onClick={() => deleteTemplate(t.id)} className="text-red-600 hover:bg-red-50"><TrashIcon className="h-3 w-3" /></Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">Përditësuar: {new Date(t.updatedAt).toLocaleString("sq-AL")}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEND NOW */}
        {tab === "Dërgo Tani" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Marrësit *</Label>
                <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RECIPIENT_FILTERS.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {recipientFilter === "specific" && (
                <div className="space-y-1.5">
                  <Label>Email-et (të ndara me presje)</Label>
                  <Textarea value={specificEmails} onChange={(e) => setSpecificEmails(e.target.value)} rows={2} placeholder="user1@example.com, user2@example.com" />
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Subjekti *</Label>
                <Input value={sendSubject} onChange={(e) => setSendSubject(e.target.value)} placeholder="p.sh. Faleminderit për kontributin tuaj!" />
              </div>

              <div className="space-y-1.5">
                <Label>Përmbajtja * (HTML i lejuar)</Label>
                <Textarea value={sendBody} onChange={(e) => setSendBody(e.target.value)} rows={10} placeholder="<p>Përshëndetje &#123;&#123;name&#125;&#125;,</p>&#10;&#10;<p>Mesazhi yt këtu...</p>" className="font-mono text-sm" />
                <p className="text-xs text-gray-500">Variabla: <code>&#123;&#123;name&#125;&#125;</code>, <code>&#123;&#123;email&#125;&#125;</code>, <code>&#123;&#123;username&#125;&#125;</code></p>
              </div>

              <div className="space-y-1.5">
                <Label>Programo për (opsionale)</Label>
                <Input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} />
                <p className="text-xs text-gray-500">Lër bosh për të dërguar menjëherë.</p>
              </div>

              {sendOk && (
                <div className={`rounded-lg p-3 text-sm ${sendOk.startsWith("✓") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                  {sendOk}
                </div>
              )}

              <Button disabled={sending || !sendSubject || !sendBody} onClick={handleSendNow} className="gap-2 w-full md:w-auto">
                <SendIcon className="h-4 w-4" />
                {sending ? "Duke dërguar..." : scheduleAt ? "Programo Email-in" : "Dërgo Tani"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AUTO EMAILS */}
        {tab === "Automatike" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Email-e automatike që dërgohen sipas trigger-ave të caktuar (cron jobs).</p>

            {TRIGGERS.map((trigger) => {
              const existing = scheduled.find((s) => s.trigger === trigger.value);
              return (
                <Card key={trigger.value}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-purple-100 text-purple-800 p-2"><ClockIcon className="h-4 w-4" /></span>
                      <div>
                        <h3 className="font-bold text-gray-900">{trigger.label}</h3>
                        <p className="text-xs text-gray-500">
                          {existing ? `Template: ${templates.find((t) => t.id === existing.templateId)?.name ?? "—"} · Delay: ${existing.delayDays} ditë` : "I pakonfiguruar"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {existing && (
                        <Badge className={existing.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}>
                          {existing.active ? "Aktiv" : "Joaktiv"}
                        </Badge>
                      )}
                      {existing ? (
                        <Switch checked={existing.active} onCheckedChange={(v) => toggleScheduled(existing.id, v)} />
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => alert("Konfiguro template-in i pari, pastaj lidhe me trigger-in")}>
                          Konfiguro
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* LOGS */}
        {tab === "Logs" && (
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : logs.length === 0 ? (
                <div className="p-10 text-center text-sm text-gray-500">Asnjë email i dërguar ende.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-4 py-3">Data</th>
                        <th className="px-4 py-3">Subjekti</th>
                        <th className="px-4 py-3 text-right">Marrës</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Dërguar nga</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                            {new Date(log.sentAt).toLocaleString("sq-AL")}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">{log.subject}</td>
                          <td className="px-4 py-3 text-right">{log.recipients}</td>
                          <td className="px-4 py-3">
                            <Badge className={
                              log.status === "SENT" ? "bg-green-100 text-green-800"
                                : log.status === "QUEUED" ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }>
                              {log.status === "SENT" ? <span className="inline-flex items-center gap-1"><CheckIcon className="h-3 w-3" /> Dërguar</span>
                                : log.status === "QUEUED" ? "Në radhë"
                                : <span className="inline-flex items-center gap-1"><AlertTriangleIcon className="h-3 w-3" /> Dështoi</span>}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{log.sentBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Template editor modal */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editTemplate.id ? "Edito Template" : "Krijo Template të Ri"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Emri *</Label>
              <Input value={editTemplate.name ?? ""} onChange={(e) => setEditTemplate((p) => ({ ...p, name: e.target.value }))} placeholder="p.sh. Welcome Email" />
            </div>
            <div className="space-y-1.5">
              <Label>Kategoria *</Label>
              <Select value={editTemplate.category ?? "BROADCAST"} onValueChange={(v) => setEditTemplate((p) => ({ ...p, category: v as EmailTemplate["category"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEMPLATE_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Subjekti *</Label>
              <Input value={editTemplate.subject ?? ""} onChange={(e) => setEditTemplate((p) => ({ ...p, subject: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Body (HTML) *</Label>
              <Textarea value={editTemplate.body ?? ""} onChange={(e) => setEditTemplate((p) => ({ ...p, body: e.target.value }))} rows={10} className="font-mono text-sm" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditorOpen(false)}>Anulo</Button>
              <Button onClick={saveTemplate} disabled={!editTemplate.name || !editTemplate.subject || !editTemplate.body}>
                {editTemplate.id ? "Ruaj Ndryshimet" : "Krijo Template"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

