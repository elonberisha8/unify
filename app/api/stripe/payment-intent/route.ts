import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/server"

export async function POST(req: NextRequest) {
  try {
    const { amount, campaignId, tip, anonymous, message } = await req.json()

    // amount është në EUR (p.sh. 25.00)
    // Stripe punon me cent (2500 = €25.00)
    const amountInCents = Math.round(amount * 100)
    const tipInCents = Math.round((tip || 0) * 100)
    const totalInCents = amountInCents + tipInCents

    if (totalInCents < 50) {
      return NextResponse.json(
        { error: "Shuma minimale është €0.50" },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalInCents,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        campaignId: campaignId || "",
        donationAmount: amountInCents.toString(),
        tipAmount: tipInCents.toString(),
        anonymous: anonymous ? "true" : "false",
        message: message || "",
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error("Payment Intent error:", error)
    return NextResponse.json(
      { error: error.message || "Gabim gjatë krijimit të pagesës" },
      { status: 500 }
    )
  }
}
