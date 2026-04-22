import * as React from "react";
import { ShieldIcon, CheckCircleIcon, AlertCircleIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export type VerifyStatus = "not-started" | "pending" | "verified" | "failed";

export interface StripeVerificationCardProps {
  status?: VerifyStatus;
  onStart?: () => void;
  className?: string;
}

export function StripeVerificationCard({ status = "not-started", onStart, className }: StripeVerificationCardProps) {
  const cfg = {
    "not-started": {
      icon: <ShieldIcon className="h-8 w-8" />,
      title: "Verifiko identitetin tënd",
      desc: "Për të mundësuar pagesat dhe donacionet, verifikoje identitetin tënd përmes Stripe Identity.",
      color: "text-unify-blue bg-unify-blue/10",
      label: "Fillo verifikimin",
    },
    pending: {
      icon: <AlertCircleIcon className="h-8 w-8" />,
      title: "Verifikimi në pritje",
      desc: "Të dhënat tuaja po rishikohen. Kjo mund të marrë deri në 24 orë.",
      color: "text-yellow-600 bg-yellow-100",
      label: "Shiko statusin",
    },
    verified: {
      icon: <CheckCircleIcon className="h-8 w-8" />,
      title: "I verifikuar",
      desc: "Identiteti yt është verifikuar me sukses.",
      color: "text-unify-green bg-unify-green/10",
      label: "Mbyll",
    },
    failed: {
      icon: <AlertCircleIcon className="h-8 w-8" />,
      title: "Verifikimi dështoi",
      desc: "Nuk mundëm të verifikojmë dokumentet. Provo përsëri.",
      color: "text-destructive bg-destructive/10",
      label: "Provo përsëri",
    },
  }[status];
  return (
    <div className={cn("bg-card rounded-[24px] p-6 border border-border", className)}>
      <div className={cn("h-14 w-14 rounded-full flex items-center justify-center mb-4", cfg.color)}>
        {cfg.icon}
      </div>
      <h3 className="font-display text-xl text-unify-brown mb-2">{cfg.title}</h3>
      <p className="font-sans text-sm text-muted-foreground mb-5">{cfg.desc}</p>
      {status !== "verified" && <Button onClick={onStart}>{cfg.label}</Button>}
    </div>
  );
}
