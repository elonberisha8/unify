import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/server"

// Krijon Identity Verification Session për verifikimin e krijuesit
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

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
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/verifikimi?identity=complete`,
    })

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
