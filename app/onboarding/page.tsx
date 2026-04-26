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

import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Card, CardContent, Input, Stepper, Textarea } from "@/components/ui"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  GlobeIcon,
  HandHeartIcon,
  HeartIcon,
  HomeIcon,
  MapPinIcon,
  ShieldIcon,
  TargetIcon,
  UploadIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons"

const steps = ["Qyteti", "Interesat", "Roli", "Profili"]
const interests = [
  { label: "Arsim", icon: <HomeIcon className="h-5 w-5" /> },
  { label: "Shëndetësi", icon: <ShieldIcon className="h-5 w-5" /> },
  { label: "Mjedis", icon: <GlobeIcon className="h-5 w-5" /> },
  { label: "Strehim", icon: <HomeIcon className="h-5 w-5" /> },
  { label: "Ushqim", icon: <HandHeartIcon className="h-5 w-5" /> },
  { label: "Të Moshuarit", icon: <UsersIcon className="h-5 w-5" /> },
  { label: "Fëmijët", icon: <HeartIcon className="h-5 w-5" /> },
  { label: "Kafshët", icon: <HeartIcon className="h-5 w-5" /> },
  { label: "Energji", icon: <TargetIcon className="h-5 w-5" /> },
]
const roles = [
  { label: "Donator", description: "Dëshiroj të dhurojë fonde për kampanja që më inspirojnë.", icon: <HeartIcon className="h-6 w-6" /> },
  { label: "Vullnetar", description: "Dëshiroj të ofroj kohën dhe shërbimet e mia për të ndihmuar.", icon: <HandHeartIcon className="h-6 w-6" /> },
  { label: "Krijues Kampanjash", description: "Dëshiroj të krijoj kampanja për të mbledhur fonde ose ndihmë.", icon: <TargetIcon className="h-6 w-6" /> },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [role, setRole] = useState("Donator")
  const [city, setCity] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [profilePhotoName, setProfilePhotoName] = useState("")

  useEffect(() => {
    return () => {
      if (profilePhoto) URL.revokeObjectURL(profilePhoto)
    }
  }, [profilePhoto])

  const next = () => {
    if (current === steps.length - 1) {
      router.push("/dashboard")
      return
    }
    setCurrent((value) => Math.min(value + 1, steps.length - 1))
  }
  const previous = () => setCurrent((value) => Math.max(value - 1, 0))
  const toggleInterest = (interest: string) => {
    setSelectedInterests((items) =>
      items.includes(interest) ? items.filter((item) => item !== interest) : [...items, interest]
    )
  }
  const onPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (profilePhoto) URL.revokeObjectURL(profilePhoto)
    setProfilePhoto(URL.createObjectURL(file))
    setProfilePhotoName(file.name)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf7f2]">
      <header className="flex h-20 items-center justify-between px-6 md:px-16">
        <a href="/" className="font-display text-2xl text-unify-brown hover:text-unify-blue">Unify</a>
        <a href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-unify-blue">Kalo për tani</a>
      </header>

      <section className="mx-auto max-w-[760px] px-5 pb-16 pt-4">
        <Stepper steps={steps} current={current} className="mb-10" />

        <Card className="relative overflow-hidden rounded-[32px] border-none bg-white shadow-sm">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-unify-blue/5" />
          <CardContent className="relative p-8 md:p-12">
            {current === 0 && (
              <div>
                <h1 className="font-display text-4xl text-unify-brown">Nga cili qytet jeni?</h1>
                <p className="mt-3 text-muted-foreground">
                  Kjo na ndihmon t'ju shfaqim kampanja dhe shpallje më afër komunitetit tuaj.
                </p>
                <label className="mt-10 block">
                  <span className="mb-2 block text-sm font-bold text-gray-700">Qyteti</span>
                  <span className="relative block">
                    <MapPinIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Prishtinë" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
                  </span>
                </label>
              </div>
            )}

            {current === 1 && (
              <div>
                <h1 className="font-display text-4xl text-unify-brown">Cilat kauza ju interesojnë?</h1>
                <p className="mt-3 text-muted-foreground">
                  Zgjidhni disa kategori. Mund t'i ndryshoni më vonë nga profili.
                </p>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {interests.map((interest) => {
                    const active = selectedInterests.includes(interest.label)
                    return (
                      <button
                        key={interest.label}
                        type="button"
                        onClick={() => toggleInterest(interest.label)}
                        className={`flex h-14 items-center justify-center gap-3 rounded-[14px] border font-bold transition-colors ${
                          active ? "border-unify-blue bg-unify-blue text-white" : "border-border bg-gray-50 text-unify-brown hover:border-unify-blue"
                        }`}
                      >
                        {interest.icon}
                        {interest.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {current === 2 && (
              <div>
                <h1 className="font-display text-4xl text-unify-brown">Si dëshironi të kontribuoni?</h1>
                <p className="mt-3 text-muted-foreground">
                  Zgjidhni rolin që më së shumti ju përshtatet. Mund ta ndryshoni edhe më vonë.
                </p>
                <div className="mt-10 space-y-4">
                  {roles.map((item) => {
                    const active = role === item.label
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setRole(item.label)}
                        className={`w-full rounded-[18px] border p-6 text-left transition-colors ${
                          active ? "border-unify-blue bg-unify-blue text-white" : "border-border bg-gray-50 text-unify-brown hover:border-unify-blue"
                        }`}
                      >
                        <span className="flex items-center gap-3 font-display text-xl">
                          {item.icon}
                          {item.label}
                        </span>
                        <span className={`mt-2 block text-sm ${active ? "text-white/85" : "text-muted-foreground"}`}>
                          {item.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {current === 3 && (
              <div>
                <h1 className="font-display text-4xl text-unify-brown">Kompletoni profilin tuaj</h1>
                <p className="mt-3 text-muted-foreground">
                  Këto informacione do të shfaqen në profilin tuaj publik.
                </p>
                <div className="mt-10 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-gray-700">Emri i plotë *</span>
                    <Input placeholder="Emri dhe mbiemri" className="h-12 rounded-[14px] bg-gray-50" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-gray-700">Numri i telefonit (opsional)</span>
                    <Input placeholder="+383 XX XXX XXX" className="h-12 rounded-[14px] bg-gray-50" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-gray-700">Bio (opsional)</span>
                    <Textarea placeholder="Shkruani diçka për veten..." rows={4} className="rounded-[14px] bg-gray-50" />
                  </label>
                  <label className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-border bg-unify-cream p-4 text-center text-muted-foreground transition-colors hover:border-unify-blue hover:text-unify-blue">
                    <input type="file" accept="image/*" className="sr-only" onChange={onPhotoChange} />
                    {profilePhoto ? (
                      <>
                        <img
                          src={profilePhoto}
                          alt="Foto profili"
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-white"
                        />
                        <span className="mt-3 text-sm font-bold text-unify-brown">{profilePhotoName}</span>
                        <span className="mt-1 text-xs text-muted-foreground">Kliko për ta ndërruar foton</span>
                      </>
                    ) : (
                      <>
                        <UploadIcon className="mb-2 h-8 w-8" />
                        <span>Kliko për të ngarkuar foto profili</span>
                        <span className="mt-1 text-xs">PNG, JPG ose WEBP</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}

            <div className="mt-12 grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" size="lg" onClick={previous} disabled={current === 0}>
                <ArrowLeftIcon className="h-4 w-4" />
                Kthehu
              </Button>
              <Button type="button" size="lg" onClick={next}>
                {current === steps.length - 1 ? "Përfundo" : "Vazhdo"}
                {current === steps.length - 1 ? <CheckIcon className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
              </Button>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">Hapi {current + 1} nga 4</p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
