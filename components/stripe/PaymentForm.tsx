"use client"

import { useState } from "react"
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui"

interface PaymentFormProps {
  amount: number
  campaignTitle: string
  onSuccess: (paymentIntentId: string) => void
  onError: (message: string) => void
}

export function PaymentForm({
  amount,
  campaignTitle,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/sukses/donacion`,
      },
      redirect: "if_required",
    })

    if (error) {
      onError(error.message || "Pagesa dështoi. Provo sërish.")
      setLoading(false)
      return
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-border p-4">
        <PaymentElement />
      </div>

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? "Duke procesuar..." : `Dono €${amount}`}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        🔒 Pagesa e sigurt me Stripe
      </p>
    </form>
  )
}
