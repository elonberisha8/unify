"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { Elements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe/client"
import { PaymentForm } from "./PaymentForm"
import { Spinner } from "@/components/ui"

interface DonationCheckoutProps {
  campaignId: string
  campaignTitle: string
  amount: number
  tip?: number
  anonymous?: boolean
  message?: string
  guestName?: string
  onSuccess: (paymentIntentId: string) => void
  onError: (message: string) => void
}

export function DonationCheckout({
  campaignId,
  campaignTitle,
  amount,
  tip = 0,
  anonymous = false,
  message = "",
  guestName = "",
  onSuccess,
  onError,
}: DonationCheckoutProps) {
  const { getToken, userId } = useAuth()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const createIntent = async () => {
      try {
        const token = await getToken()
        const res = await fetch("/api/stripe/payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            campaignId,
            amount,
            tip,
            isAnonymous: anonymous,
            message,
            guestName,
            donorId: userId ?? "guest",
          }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setClientSecret(data.clientSecret)
      } catch (err: any) {
        onError(err.message || "Gabim gjatë inicializimit të pagesës")
      } finally {
        setLoading(false)
      }
    }

    createIntent()
  }, [campaignId, amount, tip, anonymous, message, guestName])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (!clientSecret) return null

  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#009eff",
            colorBackground: "#ffffff",
            colorText: "#3a1700",
            borderRadius: "12px",
            fontFamily: "Arimo, system-ui, sans-serif",
          },
        },
      }}
    >
      <PaymentForm
        amount={amount + tip}
        campaignTitle={campaignTitle}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
