"use client"

import { useState } from "react"
import { Button } from "@/components/ui"

interface IdentityVerificationProps {
  userId: string
  onSuccess?: () => void
}

export function IdentityVerification({ userId, onSuccess }: IdentityVerificationProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/stripe/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // Dërgo te Stripe Identity flow
      window.location.href = data.url
    } catch (err: any) {
      setError(err.message || "Gabim gjatë verifikimit.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button onClick={handleVerify} disabled={loading} className="w-full">
        {loading ? "Duke hapur..." : "Verifiko Identitetin"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
