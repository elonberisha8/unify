"use client"

// TEST: http://localhost:3000/test-stripe/connect
import { ConnectOnboarding } from "@/components/stripe"

export default function TestConnectPage() {
  return (
    <div style={{ maxWidth: 400, margin: "60px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 8, padding: "10px 16px", marginBottom: 24, fontSize: 13 }}>
        ⚠️ <strong>Test Connect</strong> — Stripe krijon Express account dhe hap onboarding
      </div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>🏦 Test Stripe Connect</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
        Kliko butonin — Stripe hap onboarding për llogarinë bankare.<br />
        Në test mode, kliko <strong>"Skip this form"</strong> ose <strong>"Use test account"</strong>.
      </p>
      <ConnectOnboarding
        userId="test-user-123"
        email="test@unify.ks"
        onSuccess={(id) => alert(`✅ Connect Account: ${id}`)}
      />
    </div>
  )
}
