"use client"

// TEST: http://localhost:3000/test-stripe/identity
import { IdentityVerification } from "@/components/stripe"

export default function TestIdentityPage() {
  return (
    <div style={{ maxWidth: 400, margin: "60px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 8, padding: "10px 16px", marginBottom: 24, fontSize: 13 }}>
        ⚠️ <strong>Test Identity</strong> — Stripe do hap faqen e vet të verifikimit
      </div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>🪪 Test Stripe Identity</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
        Kliko butonin — Stripe të dërgon te faqja e verifikimit.<br />
        Aty do shohësh opsionin <strong>"Fill in test values"</strong> — kliko atë.
      </p>
      <IdentityVerification userId="test-user-123" onSuccess={() => alert("✅ Verifikimi u krye!")} />
    </div>
  )
}
