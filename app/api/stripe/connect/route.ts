import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/server"

// Krijon Stripe Connect account për krijuesin
export async function POST(req: NextRequest) {
  try {
    const { email, userId } = await req.json()

    // Krijo Connected Account
    // Nuk e vendosim country — Stripe e pyet krijuesin gjatë onboarding (mbështet AL, DE, GB, etj.)
    const account = await stripe.accounts.create({
      type: "express",
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: { userId },
    })

    // Krijo onboarding link (ku dërgohet krijuesi)
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/verifikimi?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/verifikimi?success=true`,
      type: "account_onboarding",
    })

    return NextResponse.json({
      accountId: account.id,
      onboardingUrl: accountLink.url,
    })
  } catch (error: any) {
    console.error("Stripe Connect error:", error)
    return NextResponse.json(
      { error: error.message || "Gabim gjatë lidhjes me Stripe" },
      { status: 500 }
    )
  }
}
