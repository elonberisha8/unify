"use client"

// ============================================================
// KOMPONENTI: IdentityVerification
// ============================================================
// ÇFARË BËN:
//   Klikon buton → thërret /api/stripe/identity → merr URL →
//   dërgon userin te Stripe Identity (selfie + dokument ID).
//   Pas verifikimit → Stripe dërgon webhook → backend e bën
//   userin "Verified Creator" automatikisht.
//
// KU PËRDORET:
//   → app/dashboard/verifikimi/page.tsx
//   → app/dashboard/behu-krijues/page.tsx
//   → Shfaqet kur useri nuk është ende Verified Creator
//
// SI E PËRDOR FRONTISTI:
//   import { IdentityVerification } from "@/components/stripe"
//
//   // Merr userId nga Clerk:
//   import { useUser } from "@/app/_lib/useAuthLocal"
//   const { user } = useUser()
//
//   <IdentityVerification
//     userId={user.id}        ← REQUIRED: ID e userit nga Clerk (useUser().user.id)
//     onSuccess={() => {
//       // Shfaq mesazh: "Verifikimi u dërgua! Do njoftohesh me email."
//       toast.success("Verifikimi u dërgua! Prisni konfirmimin.")
//     }}
//   />
//
// RRJEDHA E PLOTË:
//   1. Useri klikon butonin
//   2. App dërgon POST /api/stripe/identity me { userId }
//   3. Stripe kthen URL → useri ridrejtohet aty
//   4. Useri bën selfie + foto dokumenti
//   5. Stripe analizon (sekonda-minuta)
//   6. Webhook → identity.verification_session.verified
//   7. Backend → UPDATE users SET role='VERIFIED_CREATOR' WHERE id=userId
//   8. Useri mund të postojë kampanja ✅
//
// STATUSET E MUNDSHME:
//   verified         → U verifikua ✅ (webhook fired)
//   requires_input   → Dështoi ❌ (dokument i keq, selfie nuk përputhet)
//   processing       → Duke u shqyrtuar ⏳ (normal, disa sekonda)
// ============================================================

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

