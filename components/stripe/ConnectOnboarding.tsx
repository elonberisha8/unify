"use client"

// ============================================================
// KOMPONENTI: ConnectOnboarding
// ============================================================
// ÇFARË BËN:
//   Krijon Stripe Express account për krijuesin dhe hap
//   onboarding-un (ku fut të dhënat bankare).
//   Pas onboarding-ut → krijuesi mund të marrë pagesa direkt.
//
// KU PËRDORET:
//   → app/dashboard/verifikimi/page.tsx
//   → Shfaqet VETËM pasi useri bëhet Verified Creator (pas Identity)
//   → Nëse useri nuk ka stripeAccountId ende
//
// RENDI I DUHUR:
//   1. IdentityVerification (verifikimi i dokumentit)
//   2. ConnectOnboarding (lidhja e llogarisë bankare) ← KY
//
// SI E PËRDOR FRONTISTI:
//   import { ConnectOnboarding } from "@/components/stripe"
//
//   // Merr të dhënat nga Clerk:
//   import { useUser } from "@clerk/nextjs"
//   const { user } = useUser()
//
//   <ConnectOnboarding
//     userId={user.id}          ← REQUIRED: ID e userit nga Clerk
//     email={user.primaryEmailAddress?.emailAddress ?? ""}  ← REQUIRED: Email nga Clerk
//     onSuccess={(accountId) => {
//       // Ruaj accountId në profil (backend do e ruajë nga webhook)
//       toast.success("Llogaria bankare u lidh me sukses!")
//     }}
//   />
//
// RRJEDHA E PLOTË:
//   1. Useri klikon "Lidh Llogarinë Bankare"
//   2. App dërgon POST /api/stripe/connect me { userId, email }
//   3. Stripe krijon Express account → kthen onboardingUrl
//   4. Useri ridrejtohet te Stripe → fut IBAN + të dhëna bankare
//   5. Pas përfundimit → ridrejtohet te /dashboard/verifikimi?success=true
//   6. Webhook → account.updated (details_submitted: true)
//   7. Backend → ruan stripeAccountId në DB
//   8. Krijuesi mund të marrë pagesa direkt nga Stripe ✅
//
// VENDET E RETURN:
//   Success → /dashboard/verifikimi?success=true
//   Refresh → /dashboard/verifikimi?refresh=true (nëse skadon link-u)
// ============================================================

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

