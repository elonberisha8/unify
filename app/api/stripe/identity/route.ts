import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Krijon Identity Verification Session për verifikimin e krijuesit
export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY mungon në .env.local. Shto çelësin secret të Stripe dhe ristarto frontend-in." },
        { status: 500 }
      )
    }

    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: "userId mungon" }, { status: 400 })
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-03-25.dahlia" as any,
      typescript: true,
    })
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

    const verificationSession = await stripe.identity.verificationSessions.create({
      type: "document",
      metadata: { userId },
      options: {
        document: {
          allowed_types: ["id_card", "passport", "driving_license"],
          require_id_number: false,
          require_live_capture: true,
          require_matching_selfie: true,
        },
      },
      return_url: `${appUrl}/dashboard/verifikimi?identity=complete`,
    })

    if (!verificationSession.url) {
      return NextResponse.json({ error: "Stripe nuk ktheu URL për verifikim. Provo përsëri." }, { status: 502 })
    }

    return NextResponse.json({
      sessionId: verificationSession.id,
      clientSecret: verificationSession.client_secret,
      url: verificationSession.url,
    })
  } catch (error: any) {
    console.error("Stripe Identity error:", error)
    return NextResponse.json(
      { error: error.message || "Gabim gjatë verifikimit" },
      { status: 500 }
    )
  }
}
