"use client";
import * as React from "react";
import { ModerationActions } from "./ModerationActions";
import { cn } from "@/lib/utils";

export interface ModerationDecisionCardProps {
  title: string;
  submittedBy: string;
  submittedAt: string;
  reason?: string;
  preview?: React.ReactNode;
  onApprove?: (note: string) => void;
  onReject?: (note: string) => void;
  className?: string;
}

export function ModerationDecisionCard({ title, submittedBy, submittedAt, reason, preview, onApprove, onReject, className }: ModerationDecisionCardProps) {
  const [note, setNote] = React.useState("");
  return (
    <div className={cn("bg-card rounded-[20px] p-6 border border-border space-y-5", className)}>
      <div>
        <h3 className="font-display text-xl text-unify-brown">{title}</h3>
        <p className="font-sans text-sm text-muted-foreground mt-1">
          Dërguar nga <span className="font-bold text-unify-brown">{submittedBy}</span> — {submittedAt}
        </p>
      </div>
      {reason && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="font-sans text-xs font-bold uppercase text-yellow-800 mb-1">Arsyeja e raportimit</p>
          <p className="font-sans text-sm text-yellow-900">{reason}</p>
        </div>
      )}
      {preview && <div className="rounded-xl border border-border p-4 bg-muted/30">{preview}</div>}
      <div>
        <label className="block font-sans text-sm font-medium text-unify-brown mb-2">Shënim i brendshëm</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Shkruaj arsyen e vendimit..."
          className="w-full px-4 py-3 rounded-xl border border-border font-sans text-sm focus:outline-none focus:border-unify-blue resize-none"
        />
      </div>
      <ModerationActions
        onApprove={() => onApprove?.(note)}
        onReject={() => onReject?.(note)}
      />
    </div>
  );
}
