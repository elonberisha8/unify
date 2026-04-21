"use client"

// ============================================================
// BRANCH: feat/campaign-detail
// FIGMA:
//   • Kampanja — Detail → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=55-2
//   • Kampanja — Modal Donacioni → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=199-2
// NOTION: https://www.notion.so/34874891227e8164afc4f7f6568c7a81
// ============================================================
// RREGULLI: importo VETËM nga libraria — kurrë nga skedarët direkt
//   ✅ import { ... } from "@/components/ui"
//   ✅ import { ... } from "@/components/public"
//   ✅ import { ... } from "@/components/stripe"
//   ✅ import { ... } from "@/components/layout"
//   ❌ import { Button } from "@/components/ui/Button"  ← GABIM
// ============================================================
//
// ═══════════════════════════════════════════════════════════
// STRIPE INTEGRATION — UDHËZIME PËR FRONTISTIN
// ═══════════════════════════════════════════════════════════
//
// DONACIONI — si e integron butonin "Dono Tani":
//
// HAPI 1: Importo komponentin
//   import { DonationCheckout } from "@/components/stripe"
//
// HAPI 2: Shto state për modal dhe shumën
//   const [showDonation, setShowDonation] = useState(false)
//   const [amount, setAmount] = useState(10)
//   const [tip, setTip] = useState(0)
//   const [anonymous, setAnonymous] = useState(false)
//   const [message, setMessage] = useState("")
//
// HAPI 3: Brenda Modal-it të Donacionit, vendos komponentin:
//   <DonationCheckout
//     campaignId={campaign.id}         ← nga API/params e faqes
//     campaignTitle={campaign.title}   ← nga API
//     amount={amount}                  ← nga state (5, 10, 25, 50, custom)
//     tip={tip}                        ← nga toggle 0%/5%/10%
//     anonymous={anonymous}            ← nga toggle "Dono anonim"
//     message={message}                ← nga textarea opsionale
//     onSuccess={(paymentIntentId) => {
//       setShowDonation(false)
//       router.push(`/sukses/donacion?pi=${paymentIntentId}&cid=${campaign.id}`)
//     }}
//     onError={(msg) => toast.error(msg)}
//   />
//
// ÇFARË NDODH AUTOMATIKISHT (nuk e bën frontisti):
//   ✅ Stripe proceseson pagesën
//   ✅ Webhook ruan donacionin në DB
//   ✅ currentAmount e kampanjës rritet
//   ✅ Email konfirmimi dërgohet te donatori dhe krijuesi
//
// ═══════════════════════════════════════════════════════════
// Make everything exactly as shown in the Figma design above.
// ═══════════════════════════════════════════════════════════

// import { DonationModal, DonorList, ShareButtons, DonationAmountPicker, BookmarkButton } from "@/components/public"
// import { DonationCheckout } from "@/components/stripe"
// import { ProgressBar, Tabs, TabsList, TabsTrigger, TabsContent, Badge, Card, CardContent } from "@/components/ui"
// import { PublicLayout } from "@/components/layout"

export default function CampaignDetailPage() {
  return null
}
