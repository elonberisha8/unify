"use client"

import { useState, useEffect } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe/client"
import { PaymentForm } from "./PaymentForm"
import { Spinner } from "@/components/ui"

interface DonationCheckoutProps {
  campaignId: string
  campaignTitle: string
  amount: number       // EUR
  tip?: number         // EUR
  anonymous?: boolean
  message?: string
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
  onSuccess,
  onError,
}: DonationCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const createIntent = async () => {
      try {
        const res = await fetch("/api/stripe/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, campaignId, tip, anonymous, message }),
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
  }, [amount, campaignId, tip, anonymous, message])

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
