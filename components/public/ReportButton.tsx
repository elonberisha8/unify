"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Label, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui";
import { FlagIcon } from "@/components/icons";
import { apiFetch } from "@/app/_lib/api";
import { cn } from "@/lib/utils";

export interface ReportButtonProps {
  /** Tipi i objektit që raportohet */
  targetType: "campaign" | "volunteer" | "comment" | "profile";
  /** ID i objektit */
  targetId: string;
  /** Stil */
  variant?: "icon" | "text";
  size?: "sm" | "md";
  className?: string;
}

const REASONS = [
  { value: "spam", label: "Spam ose përmbajtje e padëshiruar" },
  { value: "inappropriate", label: "Përmbajtje e papërshtatshme" },
  { value: "fraud", label: "Mashtrim ose informacion i rremë" },
  { value: "abuse", label: "Abuzim ose ngacmim" },
  { value: "copyright", label: "Shkelje të të drejtave të autorit" },
  { value: "other", label: "Tjetër" },
];

export function ReportButton({ targetType, targetId, variant = "icon", size = "sm", className }: ReportButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const effectivelySignedIn = typeof window !== "undefined" && Boolean(window.localStorage.getItem("authToken"));

  function handleClick() {
    if (!effectivelySignedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setOpen(true);
  }

  async function submitReport() {
    setSubmitting(true);
    try {
      const token = window.localStorage.getItem("authToken");
      const reasonText = `[${REASONS.find((r) => r.value === reason)?.label ?? reason}] ${details.trim()}`;
      const path = targetType === "campaign" ? `/campaigns/${targetId}/report`
        : targetType === "volunteer" ? `/volunteers/${targetId}/report`
        : `/admin/reports`; // fallback

      await apiFetch(path, {
        method: "POST",
        token,
        body: JSON.stringify({ reason: reasonText, targetType, targetId }),
      });
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setReason("");
        setDetails("");
      }, 1500);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gabim gjatë raportimit");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = reason && details.trim().length >= 10;

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={handleClick}
          className={cn(
            "rounded-full flex items-center justify-center bg-white border border-border hover:border-red-500 hover:text-red-600 transition-colors",
            size === "sm" ? "h-8 w-8" : "h-10 w-10",
            className
          )}
          aria-label="Raporto"
          title="Raporto"
        >
          <FlagIcon className="h-4 w-4" />
        </button>
      ) : (
        <Button variant="outline" size={size} onClick={handleClick} className={cn("gap-2", className)}>
          <FlagIcon className="h-4 w-4" /> Raporto
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raporto përmbajtjen</DialogTitle>
          </DialogHeader>
          {success ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-700 text-2xl">✓</div>
              <p className="font-bold text-gray-900">Faleminderit!</p>
              <p className="text-sm text-gray-500 mt-1">Raportimi yt po shqyrtohet nga ekipi i moderimit.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Arsyeja *</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger><SelectValue placeholder="Zgjidh arsyen" /></SelectTrigger>
                  <SelectContent>
                    {REASONS.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Detaje shtesë * (min 10 karaktere)</Label>
                <Textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  placeholder="Shpjego me detaje pse je duke raportuar këtë përmbajtje..."
                />
                <span className="text-xs text-gray-400">{details.length} karaktere</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Anulo</Button>
                <Button onClick={submitReport} disabled={!canSubmit || submitting} className="bg-red-600 hover:bg-red-700">
                  {submitting ? "Duke dërguar..." : "Dërgo Raportin"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
