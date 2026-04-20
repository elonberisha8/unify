"use client"

import { useState } from "react"
import { Button } from "@/components/ui"

interface ConnectOnboardingProps {
  userId: string
  email: string
  onSuccess?: (accountId: string) => void
}

export function ConnectOnboarding({ userId, email, onSuccess }: ConnectOnboardingProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // Dërgo krijuesin te Stripe onboarding
      window.location.href = data.onboardingUrl
    } catch (err: any) {
      setError(err.message || "Gabim. Provo sërish.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button onClick={handleConnect} disabled={loading} className="w-full">
        {loading ? "Duke lidhur..." : "Lidh Llogarinë Bankare"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
