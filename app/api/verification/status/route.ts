import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"

export async function GET(req: NextRequest) {
  try {
    const { userId, getToken } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Jo i autentikuar" }, { status: 401 })
    }

    const token = await getToken()
    const res = await fetch(`${BACKEND}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return NextResponse.json({ status: "UNVERIFIED" })

    const user = await res.json()
    const status = user.isVerified ? "FULLY_VERIFIED" : "UNVERIFIED"
    return NextResponse.json({ status, isVerified: user.isVerified })
  } catch (error: any) {
    return NextResponse.json({ status: "UNVERIFIED", error: error.message || "Statusi nuk u lexua" })
  }
}
