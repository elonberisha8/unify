"use client"

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Reset Konfirmim → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=38-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import { Button, Card, CardContent } from "@/components/ui"
import { AuthLayout } from "@/components/layout"
import { CheckCircleIcon, MailIcon } from "@/components/icons"

export default function ResetKonfirmimPage() {
  return (
    <AuthLayout
      imageUrl="https://images.unsplash.com/photo-1423784346385-c1d4dac9893a?w=1600"
      title="Kontrollo email-in tënd"
      description="Linku i rivendosjes skadon pas 15 minutash. Kontrolloni edhe folderin Spam nëse nuk e gjeni."
    >
      <Card className="w-full max-w-md">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-unify-green/10 flex items-center justify-center">
            <CheckCircleIcon className="h-10 w-10 text-unify-green" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl text-unify-brown">Email-i u dërgua</h1>
            <p className="text-sm text-muted-foreground">
              Ne të dërguam një link për të rivendosur fjalëkalimin. Ndiq udhëzimet në email.
            </p>
          </div>

          <div className="rounded-2xl bg-unify-cream p-4 flex items-start gap-3 text-left">
            <MailIcon className="h-5 w-5 text-unify-brown flex-shrink-0 mt-0.5" />
            <p className="text-xs text-unify-brown">
              Nëse nuk e merr email-in brenda 5 minutash, kontrollo folderin Spam ose provo përsëri
              me një adresë tjetër email.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              size="lg"
              onClick={() => { window.location.href = "/auth/login" }}
            >
              Kthehu te Hyrja
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => { window.location.href = "/auth/forgot-password" }}
            >
              Dërgo përsëri
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
