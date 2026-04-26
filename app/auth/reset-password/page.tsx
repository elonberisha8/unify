"use client"

// ============================================================
// /auth/reset-password?token=... — Vendos fjalëkalimin e ri
// Backend: POST /auth/reset-password { token, password }
// ============================================================

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { AuthLayout } from "@/components/layout"
import { Button, Input } from "@/components/ui"
import { LockIcon, CheckCircleIcon } from "@/components/icons"
import { apiFetch } from "@/app/_lib/api"

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!token) {
      setError("Linku është invalid ose i skaduar. Kërko linkun përsëri nga /auth/forgot-password.")
      return
    }
    if (password.length < 8) {
      setError("Fjalëkalimi duhet të jetë min 8 karaktere")
      return
    }
    if (password !== confirm) {
      setError("Fjalëkalimet nuk përputhen")
      return
    }

    setSubmitting(true)
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      })
      setSuccess(true)
      setTimeout(() => router.replace("/auth/login"), 1800)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Linku është invalid ose i skaduar.")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <AuthLayout
        variant="forgot"
        title={"Gati!"}
        description={"Fjalëkalimi u ndryshua me sukses."}
      >
        <section className="w-full max-w-[448px] text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700 mb-6">
            <CheckCircleIcon className="h-10 w-10" />
          </div>
          <h1 className="font-display text-3xl text-gray-950">Fjalëkalimi u ndryshua!</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Po ju kthejmë në faqen e login-it...
          </p>
          <Link href="/auth/login" className="mt-6 inline-block text-unify-blue font-bold hover:underline">
            Kyçu tani →
          </Link>
        </section>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      variant="forgot"
      title={"Vendos fjalëkalimin\ne ri"}
      description={"Sigurohu që fjalëkalimi i ri\nështë i sigurt dhe unik."}
    >
      <section className="w-full max-w-[448px]">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gray-950">Fjalëkalimi i Ri</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Vendose dy herë për të konfirmuar.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Fjalëkalimi i ri</span>
            <span className="relative block">
              <LockIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 karaktere"
                className="h-14 rounded-[14px] bg-gray-50 pl-12"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Konfirmo</span>
            <span className="relative block">
              <LockIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                required
                type="password"
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Rishkruaj fjalëkalimin"
                className="h-14 rounded-[14px] bg-gray-50 pl-12"
              />
            </span>
          </label>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <Button type="submit" size="lg" disabled={submitting} className="h-[60px] w-full rounded-[14px] bg-gradient-to-r from-unify-blue to-blue-800 shadow-lg shadow-blue-500/20">
            {submitting ? "Duke ruajtur..." : "Ndrysho Fjalëkalimin"}
          </Button>

          <Link href="/auth/login" className="block text-center text-sm text-muted-foreground hover:text-unify-blue">
            Kthehu te login
          </Link>
        </form>
      </section>
    </AuthLayout>
  )
}
