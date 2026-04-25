"use client"

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Register → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=36-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import { FormEvent, useState } from "react"
import { AuthLayout } from "@/components/layout"
import { Button, Checkbox, Input } from "@/components/ui"
import { LockIcon, MailIcon, UserIcon } from "@/components/icons"
import { apiFetch } from "@/app/_lib/api"
import { normalizeUsername, validateUsername } from "@/app/_lib/username"

export default function RegisterPage() {
  const [accepted, setAccepted] = useState(false)
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setUsernameError(null)

    const cleanUsername = normalizeUsername(username)
    const validation = validateUsername(cleanUsername)
    if (!validation.ok) {
      setUsernameError(validation.reason)
      setSubmitting(false)
      return
    }

    try {
      const result = await apiFetch<{ available: boolean; error?: string }>(`/users/username/${cleanUsername}/available`)
      if (!result.available) {
        setUsernameError("Ky username eshte i zene. Provo nje tjeter.")
        setSubmitting(false)
        return
      }
    } catch (error) {
      setUsernameError(error instanceof Error ? error.message : "Nuk mund te kontrollohet username.")
      setSubmitting(false)
      return
    }

    window.localStorage.setItem("authToken", "demo-session")
    window.localStorage.setItem("unifyUsername", cleanUsername)
    window.location.href = "/onboarding"
  }

  return (
    <AuthLayout
      variant="register"
      title={"Bashkohu me\nmijëra shqiptarë\nqë ndihmojnë!"}
      description={"Krijo llogarinë tënde falas dhe\nfillo të bësh ndryshim sot."}
    >
      <section className="w-full max-w-[448px]">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gray-950">Krijo Llogarinë</h1>
          <p className="mt-3 text-base text-muted-foreground">Falas. Pa komision fillestar. Bashkohu tani.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Emri i Plotë</span>
            <span className="relative block">
              <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required placeholder="Elona Krasniqi" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Email Adresa</span>
            <span className="relative block">
              <MailIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required type="email" placeholder="emri@shembull.com" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Username unik</span>
            <span className="relative block">
              <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                required
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                  setUsernameError(null)
                }}
                placeholder="p.sh. elon_berisha"
                className="h-14 rounded-[14px] bg-gray-50 pl-12"
              />
            </span>
            {usernameError && <span className="mt-2 block text-sm text-red-600">{usernameError}</span>}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Fjalëkalimi</span>
            <span className="relative block">
              <LockIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required type="password" minLength={8} placeholder="Min. 8 karaktere" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Konfirmo Fjalëkalimin</span>
            <span className="relative block">
              <LockIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required type="password" minLength={8} placeholder="Rifut fjalëkalimin" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <Checkbox checked={accepted} onCheckedChange={(value) => setAccepted(Boolean(value))} />
            <span>
              Pranoj <a className="text-unify-blue hover:underline" href="/kushtet">Kushtet e Përdorimit</a> dhe{" "}
              <a className="text-unify-blue hover:underline" href="/privatesia">Politikën e Privatësisë</a>
            </span>
          </label>

          <Button
            type="submit"
            size="lg"
            disabled={!accepted || submitting}
            className="h-[60px] w-full rounded-[14px] bg-gradient-to-r from-unify-blue to-blue-800 shadow-lg shadow-blue-500/20"
          >
            {submitting ? "Duke kontrolluar..." : "Regjistrohu Falas"}
          </Button>

          <p className="text-center text-base text-muted-foreground">
            Keni llogari?{" "}
            <a href="/auth/login" className="font-bold text-unify-blue hover:underline">
              Kyçuni →
            </a>
          </p>
        </form>
      </section>
    </AuthLayout>
  )
}
