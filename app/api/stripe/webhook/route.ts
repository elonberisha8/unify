import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/server"
import Stripe from "stripe"

// Kjo route duhet të jetë dinamike — Stripe dërgon body raw
export const dynamic = "force-dynamic"

// Stripe dërgon events këtu pas çdo pagesë
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error("Webhook signature error:", error.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const { campaignId, donationAmount, tipAmount, anonymous, message } =
        paymentIntent.metadata

      console.log(`✅ Donacion i suksesshëm:`, {
        campaignId,
        amount: parseInt(donationAmount) / 100,
        tip: parseInt(tipAmount) / 100,
        anonymous: anonymous === "true",
        message,
      })

      // TODO: Ruaj donacionin në DB
      // await saveDonation({ campaignId, amount, ... })
      // TODO: Dërgo email konfirmimi (Resend)
      // await sendDonationEmail(...)
      break
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error(`❌ Pagesa dështoi:`, paymentIntent.id)
      break
    }

    case "account.updated": {
      // Stripe Connect — krijuesi përfundoi onboarding
      const account = event.data.object as Stripe.Account
      if (account.details_submitted) {
        console.log(`✅ Krijues i verifikuar: ${account.id}`)
        // TODO: Updato statusin e krijuesit në DB
      }
      break
    }

    case "identity.verification_session.verified": {
      // Stripe Identity — verifikimi kaloi
      const session = event.data.object as Stripe.Identity.VerificationSession
      console.log(`✅ Identiteti u verifikua: userId=${session.metadata.userId}`)
      // TODO: Updato rolin e userit → Verified Creator
      break
    }

    case "identity.verification_session.requires_input": {
      // Verifikimi dështoi — dokumenti i pavlefshëm
      const session = event.data.object as Stripe.Identity.VerificationSession
      console.log(`❌ Verifikimi dështoi: userId=${session.metadata.userId}`)
      break
    }

    default:
      console.log(`Event i patrajtuar: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
