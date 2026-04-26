"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { StripeVerificationCard } from "@/components/dashboard"
import { DashboardLayout } from "@/components/layout"

type VerifyStatus = "not-started" | "pending" | "verified" | "failed"

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!text) return {} as T

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(text.slice(0, 160) || `HTTP ${res.status}`)
  }
}

export default function VerifikimiPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = React.useState<VerifyStatus>("not-started")
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/verification/status")
        const data = await readJson<{ isVerified?: boolean }>(res)
        if (data.isVerified) setStatus("verified")
        else if (searchParams.get("identity") === "complete") setStatus("pending")
        else setStatus("not-started")
      } catch {
        setStatus("not-started")
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [searchParams])

  async function handleStart() {
    setError("")

    try {
      const res = await fetch("/api/verification/start", { method: "POST" })
      const data = await readJson<{ url?: string; error?: string }>(res)

      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`)
      if (!data.url) throw new Error("Stripe nuk ktheu URL për verifikim. Provo përsëri.")

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gabim gjatë hapjes së verifikimit.")
    }
  }

  if (loading) {
    return (
      <DashboardLayout activeKey="verifikimi">
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-500">Duke ngarkuar...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeKey="verifikimi">
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verifikimi i identitetit</h1>
          <p className="mt-1 text-sm text-gray-500">
            Verifiko identitetin tënd me Stripe Identity për të krijuar kampanja.
          </p>
        </div>

        {searchParams.get("identity") === "complete" && status === "pending" && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            <strong>Dokumenti u dërgua.</strong> Stripe po e shqyrton. Kjo mund të marrë disa minuta.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <StripeVerificationCard status={status} onStart={handleStart} />

        {status === "pending" && (
          <button
            onClick={() => {
              setLoading(true)
              window.location.reload()
            }}
            className="text-sm text-unify-blue hover:underline"
          >
            Kontrollo statusin sërish →
          </button>
        )}

        {status === "verified" && (
          <button
            onClick={() => router.push("/dashboard/krijo/kampanje")}
            className="text-sm font-medium text-unify-blue hover:underline"
          >
            Krijo kampanjën tënde të parë →
          </button>
        )}
      </div>
    </DashboardLayout>
  )
}
