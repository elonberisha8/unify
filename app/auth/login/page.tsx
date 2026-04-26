"use client"

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Login → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=35-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "@clerk/nextjs"
import { AuthLayout } from "@/components/layout"
import { Button, Input, SocialButton } from "@/components/ui"
import { LockIcon, MailIcon } from "@/components/icons"

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { signIn, setActive, isLoaded } = useSignIn()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    if (!isLoaded) return
    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: `${window.location.origin}/sso-callback`,
      redirectUrlComplete: "/dashboard",
    })
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isLoaded) return
    setError("")
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    try {
      const result = await signIn.create({ identifier: email, password })
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[] }
      setError(clerkErr.errors?.[0]?.message ?? "Email ose fjalëkalim i gabuar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <section className="w-full max-w-[448px]">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-gray-950">Mirë se vini sërish!</h1>
          <p className="mt-3 text-base text-muted-foreground">Kyçuni në llogarinë tuaj të Unify.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <SocialButton
            provider="google"
            type="button"
            icon={<GoogleIcon />}
            onClick={handleGoogle}
            className="h-14 rounded-[14px] shadow-sm"
          />

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">ose</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-gray-700">Email Adresa</span>
            <span className="relative block">
              <MailIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required name="email" type="email" placeholder="emri@shembull.com" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center justify-between text-sm font-bold text-gray-700">
              Fjalëkalimi
              <a href="/auth/forgot-password" className="font-medium text-unify-blue hover:underline">
                Harruat fjalëkalimin?
              </a>
            </span>
            <span className="relative block">
              <LockIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input required name="password" type="password" placeholder="••••••••" className="h-14 rounded-[14px] bg-gray-50 pl-12" />
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" size="lg" disabled={loading} className="h-[60px] w-full rounded-[14px] bg-gradient-to-r from-unify-blue to-blue-800 shadow-lg shadow-blue-500/20">
            {loading ? "Duke u kyçur..." : "Kyçu"}
          </Button>

          <p className="text-center text-base text-muted-foreground">
            Nuk keni llogari?{" "}
            <a href="/auth/register" className="font-bold text-unify-blue hover:underline">
              Regjistrohu falas →
            </a>
          </p>
        </form>
      </section>
    </AuthLayout>
  )
}
