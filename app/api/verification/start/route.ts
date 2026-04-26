import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Jo i autentikuar" }, { status: 401 })
    }

    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY mungon në .env.local. Shto çelësin secret të Stripe dhe ristarto frontend-in." },
        { status: 500 }
      )
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-03-25.dahlia" as any,
      typescript: true,
    })
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

    const session = await stripe.identity.verificationSessions.create({
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

    if (!session.url) {
      return NextResponse.json({ error: "Stripe nuk ktheu URL për verifikim. Provo përsëri." }, { status: 502 })
    }

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error: any) {
    console.error("Stripe Identity error:", error)
    return NextResponse.json({ error: error.message || "Gabim gjatë hapjes së Stripe Identity" }, { status: 500 })
  }
}
