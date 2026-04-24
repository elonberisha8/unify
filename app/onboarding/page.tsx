"use client"

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Onboarding — Hapi 1 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=39-2
//   • Onboarding — Hapi 2 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=147-2
//   • Onboarding — Hapi 3 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=148-2
//   • Onboarding — Hapi 4 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=150-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import * as React from "react"
import { OnboardingSteps, InterestPicker, RoleSelectionCard } from "@/components/auth"
import { Button, Input, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui"
import { AuthLayout } from "@/components/layout"
import { HandHeartIcon, HeartIcon, GiftIcon, HomeIcon, BookmarkIcon, ShieldIcon } from "@/components/icons"

const INTERESTS = [
  { id: "medical", label: "Mjekësore", icon: <HeartIcon className="h-4 w-4" /> },
  { id: "education", label: "Arsim", icon: <BookmarkIcon className="h-4 w-4" /> },
  { id: "emergency", label: "Emergjencë", icon: <ShieldIcon className="h-4 w-4" /> },
  { id: "community", label: "Komunitet", icon: <HomeIcon className="h-4 w-4" /> },
  { id: "sports", label: "Sport", icon: <GiftIcon className="h-4 w-4" /> },
  { id: "animals", label: "Kafshë", icon: <HeartIcon className="h-4 w-4" /> },
  { id: "environment", label: "Mjedis", icon: <HandHeartIcon className="h-4 w-4" /> },
]

const CITIES = [
  "Prishtinë", "Tiranë", "Prizren", "Pejë", "Gjakovë", "Ferizaj", "Mitrovicë",
  "Gjilan", "Shkodër", "Durrës", "Elbasan", "Vlorë", "Shkup", "Tetovë",
  "Gostivar", "Ulqin", "Podgoricë", "Diaspora (SHBA)", "Diaspora (BE)", "Diaspora (Zvicër)",
]

export default function OnboardingPage() {
  const [step, setStep] = React.useState(0)
  const [city, setCity] = React.useState("")
  const [interests, setInterests] = React.useState<string[]>([])
  const [role, setRole] = React.useState<"donor" | "creator" | "both" | "">("")
  const [age, setAge] = React.useState("")

  const steps = [
    {
      title: "Nga je?",
      description: "Na trego lokacionin tënd që të sugjerojmë kampanja afër teje.",
      content: (
        <div>
          <Label htmlFor="city">Qyteti / Rajoni</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger id="city" className="mt-2">
              <SelectValue placeholder="Zgjidh qytetin tënd..." />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      title: "Çfarë të intereson?",
      description: "Zgjidh deri në 5 kategori për të personalizuar feed-in tënd.",
      content: (
        <InterestPicker
          interests={INTERESTS}
          value={interests}
          onChange={setInterests}
          max={5}
        />
      ),
    },
    {
      title: "Çfarë planifikon të bësh?",
      description: "Mund ta ndryshosh më vonë në profilin tënd.",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RoleSelectionCard
            icon={<HandHeartIcon className="h-6 w-6" />}
            title="Dhuroj ndihmë"
            description="Dua të ndihmoj nëpërmjet donacioneve ose vullnetarizmit."
            selected={role === "donor"}
            onClick={() => setRole("donor")}
          />
          <RoleSelectionCard
            icon={<HeartIcon className="h-6 w-6" />}
            title="Kërkoj ndihmë"
            description="Do të postoj kampanjë ose do aplikoj për ndihmë."
            selected={role === "creator"}
            onClick={() => setRole("creator")}
          />
          <RoleSelectionCard
            icon={<GiftIcon className="h-6 w-6" />}
            title="Të dyja"
            description="Dua të ndihmoj dhe të marr ndihmë kur kam nevojë."
            selected={role === "both"}
            onClick={() => setRole("both")}
          />
        </div>
      ),
    },
    {
      title: "Pak më shumë për ty",
      description: "Opsionale — na ndihmon për të sugjeruar kampanja më të përshtatshme.",
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="age">Mosha (opsionale)</Label>
            <Input
              id="age"
              type="number"
              min={13}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="P.sh. 28"
              className="mt-2"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Të dhënat e tua janë private dhe mbahen sipas GDPR.
          </p>
        </div>
      ),
    },
  ]

  const handleNext = () => setStep((s) => Math.min(steps.length - 1, s + 1))
  const handleBack = () => setStep((s) => Math.max(0, s - 1))
  const handleComplete = () => { window.location.href = "/dashboard" }
  const handleSkip = () => { window.location.href = "/dashboard" }

  return (
    <AuthLayout
      imageUrl="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600"
      title="Le të fillojmë"
      description="4 hapa të shpejtë për të personalizuar përvojën tënde në Unify."
    >
      <div className="w-full max-w-xl space-y-4">
        <OnboardingSteps
          steps={steps}
          currentStep={step}
          onNext={handleNext}
          onBack={handleBack}
          onComplete={handleComplete}
        />
        <div className="text-center">
          <Button variant="ghost" onClick={handleSkip}>
            Kalo për momentin
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}
