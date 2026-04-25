"use client";

// ============================================================
// BRANCH: feat/auth
// FIGMA:
//   • Onboarding — Hapi 1 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=39-2
//   • Onboarding — Hapi 2 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=147-2
//   • Onboarding — Hapi 3 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=148-2
//   • Onboarding — Hapi 4 → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=150-2
// NOTION: https://www.notion.so/34874891227e810bb074e9e50dab305f
// ============================================================

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingSteps, InterestPicker, RoleSelectionCard, ProfileSetupForm } from "@/components/auth";
import { AuthLayout } from "@/components/layout";

const INTERESTS = [
  { id: "arsim", label: "Arsim" },
  { id: "shendetesi", label: "Shëndetësi" },
  { id: "mjedis", label: "Mjedis" },
  { id: "kulture", label: "Kulturë" },
  { id: "sport", label: "Sport" },
  { id: "teknologji", label: "Teknologji" },
  { id: "art", label: "Art" },
  { id: "humanitare", label: "Humanitare" },
  { id: "rinore", label: "Rinore" },
  { id: "femijore", label: "Fëmijëri" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<"donor" | "creator" | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Çfarë do të bësh në Unify?",
      description: "Zgjedh rolin tënd kryesor",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <RoleSelectionCard
            icon="🤝"
            title="Donator / Vullnetar"
            description="Mbështes kampanja dhe merr pjesë si vullnetar"
            selected={role === "donor"}
            onClick={() => setRole("donor")}
          />
          <RoleSelectionCard
            icon="🚀"
            title="Krijues / OJQ"
            description="Krijo kampanja dhe shpallje për vullnetarë"
            selected={role === "creator"}
            onClick={() => setRole("creator")}
          />
        </div>
      ),
    },
    {
      title: "Cilat fusha të interesojnë?",
      description: "Zgjedh deri në 5 fusha",
      content: (
        <InterestPicker
          interests={INTERESTS}
          value={interests}
          onChange={setInterests}
          max={5}
          className="mt-4"
        />
      ),
    },
    {
      title: "Plotëso profilin tënd",
      description: "Na trego pak për veten",
      content: <ProfileSetupForm className="mt-4" />,
    },
    {
      title: "Je gati!",
      description: "Llogaria jote është konfiguruar",
      content: (
        <div className="mt-6 text-center space-y-3">
          <div className="text-5xl">🎉</div>
          <p className="text-gray-600">Mirë se erdhe në Unify! Mund të fillosh të eksplorosh kampanjat ose të krijosh të parën tënden.</p>
        </div>
      ),
    },
  ];

  async function handleComplete() {
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, interests }),
    });
    router.push("/dashboard");
  }

  return (
    <AuthLayout title="Konfiguro llogarinë">
      <OnboardingSteps
        steps={steps}
        currentStep={currentStep}
        onNext={() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1))}
        onBack={() => setCurrentStep((s) => Math.max(s - 1, 0))}
        onComplete={handleComplete}
        nextLabel="Vazhdo"
        backLabel="Kthehu"
        completeLabel="Fillo"
      />
    </AuthLayout>
  );
}
