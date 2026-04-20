// ============================================================
// BRANCH: feat/dashboard-profile
// FIGMA:
//   • Stripe Identity — Verifikimi → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=214-2
// ============================================================
// RREGULLI: importo VETËM nga libraria — kurrë nga skedarët direkt
//   ✅ import { ... } from "@/components/ui"
//   ✅ import { ... } from "@/components/stripe"
//   ✅ import { ... } from "@/components/layout"
//   ❌ import { Button } from "@/components/ui/Button"  ← GABIM
// ============================================================
//
// ═══════════════════════════════════════════════════════════
// STRIPE INTEGRATION — UDHËZIME PËR FRONTISTIN
// ═══════════════════════════════════════════════════════════
//
// KJO FAQE MENAXHON 2 HAPA TË VERIFIKIMIT TË KRIJUESIT:
//
// ┌─────────────────────────────────────────────────────────┐
// │  HAPI 1: Identity Verification (verifikimi i dokumentit)│
// │  HAPI 2: Connect Onboarding (lidhja bankare)            │
// └─────────────────────────────────────────────────────────┘
//
// IMPORTET E NEVOJSHME:
//   import { IdentityVerification, ConnectOnboarding } from "@/components/stripe"
//   import { useUser } from "@clerk/nextjs"
//
// LOGJIKA E FAQES (bazuar në statusin e userit nga DB):
//
//   const { user } = useUser()
//
//   // Statuset e mundshme (vijnë nga backend API):
//   // status === "UNVERIFIED"      → Shfaq HAPI 1 (IdentityVerification)
//   // status === "IDENTITY_DONE"   → Shfaq HAPI 2 (ConnectOnboarding)
//   // status === "FULLY_VERIFIED"  → Shfaq "Je Verified Creator ✅"
//
//   {status === "UNVERIFIED" && (
//     <IdentityVerification
//       userId={user.id}
//       onSuccess={() => refetchStatus()}
//     />
//   )}
//
//   {status === "IDENTITY_DONE" && (
//     <ConnectOnboarding
//       userId={user.id}
//       email={user.primaryEmailAddress?.emailAddress ?? ""}
//       onSuccess={() => refetchStatus()}
//     />
//   )}
//
// URL PARAMS:
//   ?success=true  → Connect onboarding u krye → shfaq mesazh suksesi
//   ?refresh=true  → Link i skaduar → rihap onboarding automatikisht
//   ?identity=complete → Identity u krye → kontrollo statusin e ri
//
// ═══════════════════════════════════════════════════════════
// Make everything exactly as shown in the Figma design above.
// ═══════════════════════════════════════════════════════════

export default function VerifikimiPage() {
  return null
}
