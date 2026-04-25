"use client";

import * as React from "react";
import { ModerationActions } from "./ModerationActions";
import { cn } from "@/lib/utils";
import { Badge, Button } from "@/components/ui";

export interface ModerationDetailItem {
  label: string;
  value: string;
}

export interface ModerationDecisionCardProps {
  title: string;
  submittedBy: string;
  submittedAt: string;
  reason?: string;
  targetType?: "Kampanje" | "Shpallje" | "Request" | "Koment" | "Profil";
  targetId?: string;
  targetTitle?: string;
  targetStatus?: string;
  ownerName?: string;
  ownerId?: string;
  category?: string;
  location?: string;
  risk?: "low" | "medium" | "high";
  details?: ModerationDetailItem[];
  evidence?: string[];
  objectUrl?: string;
  ownerUrl?: string;
  preview?: React.ReactNode;
  onApprove?: (note: string) => void;
  onReject?: (note: string) => void;
  onPause?: (note: string) => void;
  onBlockEmail?: () => void;
  onBlockUser?: () => void;
  className?: string;
}

const riskVariant = {
  low: "secondary",
  medium: "warning",
  high: "destructive",
} as const;

export function ModerationDecisionCard({
  title,
  submittedBy,
  submittedAt,
  reason,
  targetType,
  targetId,
  targetTitle,
  targetStatus,
  ownerName,
  ownerId,
  category,
  location,
  risk = "medium",
  details = [],
  evidence = [],
  objectUrl,
  ownerUrl,
  preview,
  onApprove,
  onReject,
  onPause,
  onBlockEmail,
  onBlockUser,
  className,
}: ModerationDecisionCardProps) {
  const [note, setNote] = React.useState("");

  return (
    <div className={cn("space-y-5 rounded-[20px] border border-border bg-card p-6 shadow-sm", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            {targetType && <Badge variant="primary">{targetType}</Badge>}
            {targetStatus && <Badge variant="warning">{targetStatus}</Badge>}
            <Badge variant={riskVariant[risk]}>risk: {risk}</Badge>
          </div>
          <h3 className="mt-3 font-display text-xl text-unify-brown">{title}</h3>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Derguar nga <span className="font-bold text-unify-brown">{submittedBy}</span> - {submittedAt}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {objectUrl && <Button variant="outline" size="sm" onClick={() => { window.location.href = objectUrl }}>Hap objektin</Button>}
          {ownerUrl && <Button variant="outline" size="sm" onClick={() => { window.location.href = ownerUrl }}>Hap pronarin</Button>}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/20 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Objekti qe po moderohet</p>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <Info label="Titulli" value={targetTitle ?? title} />
          <Info label="ID / slug" value={targetId ?? "pa-id"} />
          <Info label="Pronari" value={ownerName ? `${ownerName}${ownerId ? ` (${ownerId})` : ""}` : submittedBy} />
          <Info label="Kategori / lokacion" value={[category, location].filter(Boolean).join(" - ") || "Nuk eshte vendosur"} />
        </div>
      </div>

      {reason && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="mb-1 font-sans text-xs font-bold uppercase text-yellow-800">Arsyeja e raportimit / review</p>
          <p className="font-sans text-sm text-yellow-900">{reason}</p>
        </div>
      )}

      {details.length > 0 && (
        <div className="grid gap-3 text-sm md:grid-cols-3">
          {details.map((item) => (
            <Info key={item.label} label={item.label} value={item.value} boxed />
          ))}
        </div>
      )}

      {evidence.length > 0 && (
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Evidenca per vendim</p>
          <ul className="mt-3 space-y-2 text-sm text-unify-brown">
            {evidence.map((item) => (
              <li key={item} className="rounded-lg bg-muted/40 px-3 py-2">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {preview && <div className="rounded-xl border border-border bg-muted/30 p-4">{preview}</div>}

      <div>
        <label className="mb-2 block font-sans text-sm font-medium text-unify-brown">Shenim i brendshem</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Shkruaj arsyen e vendimit..."
          className="w-full resize-none rounded-xl border border-border px-4 py-3 font-sans text-sm focus:border-unify-blue focus:outline-none"
        />
      </div>
      <ModerationActions
        onApprove={onApprove ? () => onApprove(note) : undefined}
        onReject={onReject ? () => onReject(note) : undefined}
        onPause={onPause ? () => onPause(note) : undefined}
      />
      {(onBlockEmail || onBlockUser) && (
        <div className="flex flex-wrap gap-2 border-t border-border pt-3">
          {onBlockEmail && <Button variant="outline" size="sm" onClick={onBlockEmail}>Blloko email</Button>}
          {onBlockUser && <Button variant="destructive" size="sm" onClick={onBlockUser}>Blloko user</Button>}
        </div>
      )}
    </div>
  );
}

function Info({ label, value, boxed }: { label: string; value: string; boxed?: boolean }) {
  return (
    <div className={cn(boxed && "rounded-xl border border-border bg-white p-3")}>
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-medium text-unify-brown">{value}</p>
    </div>
  );
}
