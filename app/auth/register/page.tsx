"use client"

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Register → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=36-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { AuthLayout } from "@/components/layout"
import { Button, Checkbox, Input } from "@/components/ui"
import { LockIcon, MailIcon, UserIcon } from "@/components/icons"

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, setActive, isLoaded } = useSignUp()
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendingCode, setResendingCode] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [emailForVerification, setEmailForVerification] = useState("")

  const finishSignUp = async (sessionId: string | null | undefined) => {
    if (!sessionId || !setActive) return false
    await setActive({ session: sessionId })
    router.replace("/onboarding")
    router.refresh()
    return true
  }

  const completeMissingRequirements = async () => {
    if (!signUp) return false
    const result = await signUp.update({})
    if (result.status === "complete" && await finishSignUp(result.createdSessionId)) {
      return true
    }
    setError(
      result.missingFields.length
        ? `Clerk kërkon ende këto fusha: ${result.missingFields.join(", ")}. Hiqi si required në Clerk Dashboard që regjistrimi të bëhet vetëm me email/password.`
        : "Regjistrimi u verifikua, por session-i nuk u krijua. Provoni të kyçeni."
    )
    return false
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isLoaded) return
    setError("")
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const fullName = formData.get("name") as string
    const email = (formData.get("email") as string).trim()
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    if (password !== confirmPassword) {
      setError("Fjalëkalimet nuk përputhen.")
      setLoading(false)
      return
    }
    const username = (formData.get("username") as string).trim()
    const firstName = fullName.split(" ")[0]
    const lastName = fullName.split(" ").slice(1).join(" ") || ""
    try {
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        username,
      })
      if (result.status === "complete" && await finishSignUp(result.createdSessionId)) {
        return
      }

      const verification = await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      if (verification.status === "complete" && await finishSignUp(verification.createdSessionId)) {
        return
      }
      if (verification.status === "missing_requirements" && await completeMissingRequirements()) {
        return
      }

      setEmailForVerification(email)
      setPendingVerification(true)
      setError("")
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] }
      setError(clerkErr.errors?.[0]?.message ?? "Gabim gjatë regjistrimit.")
    } finally {
      setLoading(false)
    }
  }

  const onVerifyEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isLoaded) return
    setError("")
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const code = (formData.get("code") as string).trim()
    try {
      const result = await signUp.attemptEmailAddressVerification({ code })
      if (result.status === "complete" && await finishSignUp(result.createdSessionId)) {
        return
      }
      if (result.status === "complete") {
        router.replace("/auth/login")
        router.refresh()
        return
      }
      if (result.status === "missing_requirements" && await completeMissingRequirements()) {
        return
      }
      setError("Verifikimi nuk u kompletua. Kontrolloni kodin dhe provoni përsëri.")
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] }
      const message = clerkErr.errors?.[0]?.message ?? "Kodi i verifikimit është i pavlefshëm."
      if (message.toLowerCase().includes("already verified")) {
        await completeMissingRequirements()
        return
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const resendVerificationCode = async () => {
    if (!isLoaded) return
    setError("")
    setResendingCode(true)
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setError("Dërguam një kod të ri. Përdorni kodin më të fundit nga email-i.")
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] }
      setError(clerkErr.errors?.[0]?.message ?? "Kodi nuk u ridërgua. Provoni përsëri.")
    } finally {
      setResendingCode(false)
    }
  }

  return (
    <AuthLayout
      variant="register"
      title={"Bashkohu me\nmijëra shqiptarë\nqë ndihmojnë!"}
      description={"Krijo llogarinë tënde falas dhe\nfillo të bësh ndryshim sot."}
    >
      <section className="w-full max-w-[448px]">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gray-950">
            {pendingVerification ? "Verifiko email-in" : "Krijo Llogarinë"}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            {pendingVerification
              ? `Shkruani kodin që dërguam te ${emailForVerification}.`
              : "Falas. Pa komision fillestar. Bashkohu tani."}
          </p>
        </div>

        {pendingVerification ? (
          <form onSubmit={onVerifyEmail} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-gray-700">Kodi i verifikimit</span>
              <Input
                required
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                className="h-14 rounded-[14px] bg-gray-50"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="h-[60px] w-full rounded-[14px] bg-gradient-to-r from-unify-blue to-blue-800 shadow-lg shadow-blue-500/20"
            >
              {loading ? "Duke verifikuar..." : "Verifiko dhe vazhdo"}
            </Button>

            <button
              type="button"
              onClick={resendVerificationCode}
              disabled={resendingCode}
              className="block w-full text-center text-sm font-bold text-unify-blue hover:underline disabled:opacity-60"
            >
              {resendingCode ? "Duke dërguar..." : "Dërgo kod të ri"}
            </button>
          </form>
        ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Emri i Plotë</span>
            <span className="relative block">
              <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required name="name" placeholder="Elona Krasniqi" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Username</span>
            <span className="relative block">
              <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required name="username" placeholder="p.sh. elona_krasniqi" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Email Adresa</span>
            <span className="relative block">
              <MailIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required name="email" type="email" placeholder="emri@shembull.com" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Fjalëkalimi</span>
            <span className="relative block">
              <LockIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required name="password" type="password" minLength={8} placeholder="Min. 8 karaktere" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Konfirmo Fjalëkalimin</span>
            <span className="relative block">
              <LockIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required name="confirmPassword" type="password" minLength={8} placeholder="Rifut fjalëkalimin" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <Checkbox checked={accepted} onCheckedChange={(value) => setAccepted(Boolean(value))} />
            <span>
              Pranoj <a className="text-unify-blue hover:underline" href="/kushtet">Kushtet e Përdorimit</a> dhe{" "}
              <a className="text-unify-blue hover:underline" href="/privatesia">Politikën e Privatësisë</a>
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div id="clerk-captcha" data-cl-theme="light" data-cl-size="flexible" />

          <Button
            type="submit"
            size="lg"
            disabled={!accepted || loading}
            className="h-[60px] w-full rounded-[14px] bg-gradient-to-r from-unify-blue to-blue-800 shadow-lg shadow-blue-500/20"
          >
            {loading ? "Duke u regjistruar..." : "Regjistrohu Falas"}
          </Button>

          <p className="text-center text-base text-muted-foreground">
            Keni llogari?{" "}
            <a href="/auth/login" className="font-bold text-unify-blue hover:underline">
              Kyçuni →
            </a>
          </p>
        </form>
        )}
      </section>
    </AuthLayout>
  )
}
