"use client";

// ============================================================
// BRANCH: feat/dashboard-profile
// FIGMA:
//   • Bëhu Krijues → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=48-2
// NOTION: https://www.notion.so/34874891227e8188a4d5e1c80adc017a
// ============================================================

import * as React from "react";
import { useRouter } from "next/navigation";
import { StripeVerificationCard, CreatorCTA } from "@/components/dashboard";
import { DashboardLayout } from "@/components/layout";

const STEPS = [
  { title: "Verifiko identitetin", description: "Konfirmo identitetin tënd me Stripe Identity", icon: "🪪" },
  { title: "Lidh llogarinë bankare", description: "Lidh llogarinë tënde bankare me Stripe Connect", icon: "🏦" },
  { title: "Fillo krijimin", description: "Krijo kampanjen tënde të parë", icon: "🚀" },
];

export default function BehuKrijuesPage() {
  const router = useRouter();

  return (
    <DashboardLayout activeKey="behu-krijues">
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bëhu Krijues</h1>
          <p className="text-sm text-gray-500 mt-1">Plotëso hapat për të filluar mbledhjen e donacioneve.</p>
        </div>

        <ol className="space-y-4">
          {STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl">
              <span className="text-2xl">{step.icon}</span>
              <div>
                <p className="font-semibold text-gray-900">
                  {i + 1}. {step.title}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <StripeVerificationCard
          status="not-started"
          onStart={() => router.push("/dashboard/verifikimi")}
        />

        <CreatorCTA
          title="Ke pyetje?"
          description="Lexo guidën tonë për krijuesit ose kontakto ekipin tonë."
          ctaLabel="Lexo guidën"
          onCta={() => window.open("https://unify.al/guide", "_blank")}
        />
      </div>
    </DashboardLayout>
  );
}
