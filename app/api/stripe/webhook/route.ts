import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/server"
import Stripe from "stripe"

export const dynamic = "force-dynamic"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("Webhook signature error:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {

    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent
      const { campaignId, donorId, isAnonymous, message, guestName, tipAmount } = pi.metadata

      const amountEur = pi.amount / 100
      const tipEur    = tipAmount ? parseInt(tipAmount) / 100 : 0
      const donationAmountEur = amountEur - tipEur

      console.log(`✅ Donacion i suksesshëm: campaignId=${campaignId} amount=€${donationAmountEur} donor=${donorId}`)

      try {
        await fetch(`${BACKEND}/api/donations/record`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-webhook-secret": process.env.WEBHOOK_INTERNAL_SECRET ?? "unify-internal",
          },
          body: JSON.stringify({
            campaignId,
            donorClerkId:          donorId && donorId !== "guest" ? donorId : null,
            amount:                donationAmountEur,
            isAnonymous:           isAnonymous === "true",
            message:               message || null,
            guestName:             guestName || null,
            stripePaymentIntentId: pi.id,
          }),
        })
      } catch (e) {
        console.error("Gabim duke ruajtur donacionin:", e)
      }
      break
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent
      console.error(`❌ Pagesa dështoi: ${pi.id}`)
      break
    }

    case "identity.verification_session.verified": {
      const session = event.data.object as Stripe.Identity.VerificationSession
      const clerkId = session.metadata?.userId
      if (clerkId) {
        console.log(`✅ Identiteti u verifikua: clerkId=${clerkId}`)
        try {
          await fetch(`${BACKEND}/api/users/set-verified`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-webhook-secret": process.env.WEBHOOK_INTERNAL_SECRET ?? "unify-internal",
            },
            body: JSON.stringify({ clerkId }),
          })
        } catch (e) {
          console.error("Gabim duke verifikuar userin:", e)
        }
      }
      break
    }

    case "identity.verification_session.requires_input": {
      const session = event.data.object as Stripe.Identity.VerificationSession
      console.log(`❌ Verifikimi dështoi: clerkId=${session.metadata?.userId}`)
      break
    }

    case "account.updated": {
      const account = event.data.object as Stripe.Account
      if (account.details_submitted) {
        console.log(`✅ Krijues i verifikuar: ${account.id}`)
        try {
          await fetch(`${BACKEND}/api/users/stripe-account`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stripeAccountId: account.id }),
          })
        } catch {}
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
