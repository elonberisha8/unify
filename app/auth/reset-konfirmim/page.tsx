"use client"

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Reset Konfirmim → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=38-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button, Card, CardContent } from "@/components/ui"
import { ArrowLeftIcon, CheckCircleIcon, MailIcon } from "@/components/icons"

export default function ResetKonfirmimPage() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get("email") || "ana.kelmendi@gmail.com"

  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <header className="flex h-16 items-center px-6 md:px-20">
        <Link href="/" className="font-display text-2xl text-unify-brown hover:text-unify-blue">Unify</Link>
      </header>

      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-10">
        <Card className="w-full max-w-[512px] rounded-[28px] border-none bg-white shadow-sm">
          <CardContent className="p-10 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-unify-blue/10 text-unify-blue">
              <MailIcon className="h-12 w-12" />
            </div>
            <h1 className="mt-8 font-display text-3xl text-unify-brown">Kontrollo Email-in Tënd!</h1>
            <p className="mt-4 text-muted-foreground">Dërguam instruksionet e rivendosjes tek:</p>
            <div className="mt-4 rounded-[14px] bg-unify-cream px-4 py-3 font-bold text-unify-brown">{email}</div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Hap email-in dhe kliko linkun brenda 15 minutave. Nëse nuk e sheh, kontrollo edhe spam-in.
            </p>

            <Button className="mt-8 w-full" onClick={() => { window.open("mailto:", "_blank") }}>
              <CheckCircleIcon className="h-4 w-4" />
              Hap Gmail / Email App
            </Button>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => router.push("/auth/forgot-password")}>
                <ArrowLeftIcon className="h-4 w-4" />
                Kthehu
              </Button>
              <Button variant="outline" onClick={() => router.push(`/auth/reset-konfirmim?email=${encodeURIComponent(email)}`)}>
                Ridërgoje Email-in
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
