import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/server"

export async function POST(req: NextRequest) {
  try {
    const { campaignId, amount, tip, isAnonymous, message, guestName, donorId } = await req.json()

    if (!campaignId) {
      return NextResponse.json({ error: "campaignId mungon" }, { status: 400 })
    }

    const amountInCents = Math.round(Number(amount) * 100)
    const tipInCents    = Math.round((Number(tip) || 0) * 100)
    const totalInCents  = amountInCents + tipInCents

    if (totalInCents < 50) {
      return NextResponse.json({ error: "Shuma minimale është €0.50" }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalInCents,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        campaignId,
        donorId:     donorId   || "guest",
        isAnonymous: isAnonymous ? "true" : "false",
        message:     (message  || "").slice(0, 500),
        guestName:   guestName || "",
        tipAmount:   tipInCents.toString(),
      },
    })

    return NextResponse.json({
      clientSecret:    paymentIntent.client_secret,
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
