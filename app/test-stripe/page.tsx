"use client"

// ============================================================
// FAQE TESTIMI — STRIPE (fshije pas testimit)
// Hap: http://localhost:3000/test-stripe
// ============================================================

import { useState } from "react"
import { DonationCheckout } from "@/components/stripe"

export default function TestStripePage() {
  const [step, setStep] = useState<"select" | "pay" | "done">("select")
  const [amount, setAmount] = useState(10)
  const [paymentId, setPaymentId] = useState("")
  const [error, setError] = useState("")

  const handleSuccess = (id: string) => {
    setPaymentId(id)
    setStep("done")
  }

  const handleError = (msg: string) => {
    setError(msg)
  }

  return (
    <div style={{ maxWidth: 500, margin: "60px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 8, padding: "10px 16px", marginBottom: 24, fontSize: 13 }}>
        ⚠️ <strong>Faqe testimi</strong> — përdor kartë test Stripe, jo kartë reale
      </div>

      <h1 style={{ fontSize: 24, marginBottom: 8 }}>🧪 Test Stripe — Unify</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Testo donacionin me kartë test Stripe</p>

      {step === "select" && (
        <div>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>Zgjidh shumën:</h2>
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            {[5, 10, 25, 50].map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                style={{
                  padding: "10px 20px",
                  border: amount === a ? "2px solid #009eff" : "2px solid #ddd",
                  background: amount === a ? "#e8f7ff" : "#fff",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: amount === a ? 700 : 400,
                  fontSize: 15,
                }}
              >
                €{a}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep("pay")}
            style={{
              width: "100%",
              padding: "14px",
              background: "#009eff",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Vazhdo me Pagesën →
          </button>

          <div style={{ marginTop: 24, background: "#f8f9fa", borderRadius: 8, padding: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🃏 Kartë test:</p>
            <code style={{ fontSize: 13 }}>4242 4242 4242 4242</code><br />
            <code style={{ fontSize: 13 }}>Data: 12/28 · CVC: 123 · ZIP: 12345</code>
          </div>
        </div>
      )}

      {step === "pay" && (
        <div>
          <button
            onClick={() => setStep("select")}
            style={{ background: "none", border: "none", color: "#009eff", cursor: "pointer", marginBottom: 16, fontSize: 14 }}
          >
            ← Kthehu
          </button>
          <h2 style={{ fontSize: 16, marginBottom: 16 }}>💳 Dono €{amount} për kampanjën test</h2>

          <DonationCheckout
            campaignId="test-campaign-123"
            campaignTitle="Kampanja Test"
            amount={amount}
            tip={0}
            anonymous={false}
            message="Donacion test"
            onSuccess={handleSuccess}
            onError={handleError}
          />

          {error && (
            <div style={{ marginTop: 16, color: "#dc3545", fontSize: 14 }}>
              ❌ {error}
            </div>
          )}
        </div>
      )}

      {step === "done" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: "#28a745", marginBottom: 8 }}>Pagesa u krye me sukses!</h2>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>Payment Intent ID:</p>
          <code style={{ background: "#f8f9fa", padding: "8px 12px", borderRadius: 6, fontSize: 12, wordBreak: "break-all" }}>
            {paymentId}
          </code>
          <div style={{ marginTop: 24 }}>
            <button
              onClick={() => { setStep("select"); setPaymentId(""); setError(""); }}
              style={{ padding: "10px 24px", background: "#009eff", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
            >
              Testo Sërish
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
