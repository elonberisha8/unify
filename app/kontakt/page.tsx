"use client"

// ============================================================
// BRANCH: feat/static-pages
// FIGMA:
//   • Kontakt → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=73-2
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import * as React from "react"
import { ContactInfoCard, FAQAccordion } from "@/components/public"
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui"
import { PublicLayout } from "@/components/layout"
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  MessageCircleIcon,
  SendIcon,
  CheckCircleIcon,
} from "@/components/icons"
import { PUBLIC_NAVBAR, PUBLIC_FOOTER } from "../_lib/public-layout-config"

const CONTACT_INFO = [
  { icon: <MailIcon className="h-5 w-5" />, title: "Email", value: "info@unify.al", href: "mailto:info@unify.al" },
  { icon: <PhoneIcon className="h-5 w-5" />, title: "Telefon", value: "+383 49 000 000", href: "tel:+38349000000" },
  { icon: <MapPinIcon className="h-5 w-5" />, title: "Adresa", value: "Rr. Bill Klinton, Prishtinë 10000" },
  { icon: <MessageCircleIcon className="h-5 w-5" />, title: "Orari", value: "Hën-Pre, 09:00 – 17:00" },
]

const FAQS = [
  { question: "A merr Unify komision për donacionet?", answer: "Jo. Krijuesi mban 100% të donacioneve (minus tarifat Stripe ~1.4% + €0.25). Ne mbahemi vetëm nga bakshishe opsionale të donatorëve." },
  { question: "Sa kohë merr aprovimi i një kampanje?", answer: "Zakonisht 24-48 orë pune. Admini shqyrton çdo kampanjë manualisht për të siguruar autenticitetin." },
  { question: "Si mund t'i tërheq paratë?", answer: "Pasi të verifikohesh me Stripe Identity dhe të lidhësh IBAN-in, paratë arrijnë automatikisht në llogarinë bankare brenda 2-5 ditëve pune." },
  { question: "A mund të dhuroj anonim?", answer: "Po. Kur dhuron, mund të zgjedhësh 'Dhuro anonim' — emri yt nuk do të shfaqet publikisht." },
]

const SUBJECTS = [
  { value: "general", label: "Pyetje të përgjithshme" },
  { value: "campaign", label: "Ndihmë për kampanjën time" },
  { value: "donation", label: "Problem me donacion" },
  { value: "verification", label: "Verifikim i llogarisë" },
  { value: "abuse", label: "Raporto abuzim" },
  { value: "partnership", label: "Partneritet / Bashkëpunim" },
]

export default function KontaktPage() {
  const [form, setForm] = React.useState({ name: "", email: "", subject: "general", message: "" })
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setDone(true)
  }

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="bg-unify-cream border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
          <Badge variant="secondary" className="mb-4">Na kontakto</Badge>
          <h1 className="font-display text-4xl md:text-5xl text-unify-brown mb-4">
            Ke një pyetje? Ne jemi këtu.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ekipi ynë i mbështetjes përgjigjet brenda 24 orëve. Mos ngurro të na shkruash.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CONTACT_INFO.map((c) => (
          <ContactInfoCard key={c.title} {...c} />
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardContent className="p-8">
            <h2 className="font-display text-2xl text-unify-brown mb-2">Dërgo mesazh</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Plotëso formën më poshtë dhe do të kthehemi sa më shpejt të mundemi.
            </p>

            {done ? (
              <div className="rounded-2xl bg-unify-green/10 p-6 text-center">
                <CheckCircleIcon className="h-10 w-10 text-unify-green mx-auto mb-3" />
                <h3 className="font-display text-xl text-unify-brown mb-1">Mesazhi u dërgua!</h3>
                <p className="text-sm text-muted-foreground">
                  Do t&apos;i kthejmë përgjigje brenda 24 orëve.
                </p>
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => {
                    setDone(false)
                    setForm({ name: "", email: "", subject: "general", message: "" })
                  }}
                >
                  Dërgo një tjetër
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Emri i plotë</Label>
                    <Input id="name" required className="mt-2" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Elon Berisha" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required className="mt-2" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="ti@shembull.com" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subjekti</Label>
                  <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                    <SelectTrigger id="subject" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Mesazhi</Label>
                  <Textarea id="message" required rows={6} className="mt-2" value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Shkruaj mesazhin tënd këtu..." />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Duke dërguar..." : "Dërgo mesazhin"}
                  {!loading && <SendIcon className="h-4 w-4 ml-2" />}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Duke dërguar këtë formë, pranon{" "}
                  <a href="/privatesia" className="underline text-unify-blue">Politikën e Privatësisë</a>.
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="font-display text-2xl text-unify-brown mb-2">Pyetje të shpeshta</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Kontrollo këtu para se të na shkruash — mund të gjesh përgjigjen menjëherë.
          </p>
          <FAQAccordion items={FAQS} />
        </div>
      </section>
    </PublicLayout>
  )
}
