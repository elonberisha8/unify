"use client"

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Forgot Password → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=37-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/layout"
import { Button, Input } from "@/components/ui"
import { ArrowLeftIcon, MailIcon } from "@/components/icons"
import { apiFetch } from "@/app/_lib/api"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const trimmed = email.trim()
    if (!trimmed) {
      setError("Email kërkohet")
      return
    }
    setSubmitting(true)
    // Best-effort: backend dërgon email; UI gjithmonë shkon te konfirmimi
    // (mos zbulon nëse useri ekziston — siguri)
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: trimmed }),
      })
    } catch {
      /* injoro — backend mund të mos ekzistojë ende */
    } finally {
      setSubmitting(false)
      router.replace(`/auth/reset-konfirmim?email=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <AuthLayout
      variant="forgot"
      title={"Mos u shqetëso,\nne jemi këtu!"}
      description={"Vendosni email adresën tuaj dhe do t'ju\ndërgojmë udhëzimet e rikthimit."}
    >
      <section className="w-full max-w-[448px]">
        <a href="/auth/login" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-unify-blue hover:underline">
          <ArrowLeftIcon className="h-5 w-5" />
          Kthehu tek Login
        </a>

        <div className="mb-8">
          <h1 className="font-display text-4xl text-gray-950">Harruat Fjalëkalimin?</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Asnjë problem! Vendosni email adresën tuaj më poshtë.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Email Adresa</span>
            <span className="relative block">
              <MailIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="emri@shembull.com"
                className="h-14 rounded-[14px] bg-gray-50 pl-12"
              />
            </span>
          </label>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <Button type="submit" size="lg" disabled={submitting} className="h-[60px] w-full rounded-[14px] bg-gradient-to-r from-unify-blue to-blue-800 shadow-lg shadow-blue-500/20">
            {submitting ? "Duke dërguar..." : "Dërgo Email-in"}
          </Button>

          <div className="rounded-[14px] bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            Këshillë: Kontrolloni edhe dosjen e spam-it nëse nuk e gjeni email-in brenda pak minutash.
          </div>
        </form>
      </section>
    </AuthLayout>
  )
}
