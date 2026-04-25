"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from "@/components/ui";

export interface DonationModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  campaignTitle: string;
  presetAmounts?: number[];
  currency?: string;
  onSubmit?: (data: { amount: number; message?: string; anonymous: boolean }) => void;
}

export function DonationModal({
  open, onOpenChange, campaignTitle,
  presetAmounts = [10, 25, 50, 100], currency = "€", onSubmit,
}: DonationModalProps) {
  const [amount, setAmount] = React.useState<number | "">(presetAmounts[1] ?? 25);
  const [message, setMessage] = React.useState("");
  const [anonymous, setAnonymous] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    onSubmit?.({ amount: Number(amount), message: message || undefined, anonymous });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dhuro për këtë kampanjë</DialogTitle>
          <DialogDescription className="line-clamp-2">{campaignTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Zgjidh shumën</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {presetAmounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmount(a)}
                  className={cn(
                    "h-12 rounded-xl font-bold text-sm border-2 transition-colors",
                    amount === a ? "bg-unify-blue text-white border-unify-blue" : "bg-white border-border hover:border-unify-blue"
                  )}
                >
                  {currency}{a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="custom-amount">Ose fut shumën tënde</Label>
            <div className="relative mt-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{currency}</span>
              <Input
                id="custom-amount"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="pl-8"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="msg">Mesazh (opsional)</Label>
            <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2" rows={3} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={anonymous} onCheckedChange={(v) => setAnonymous(Boolean(v))} />
            <span className="text-sm">Dhuro anonimisht</span>
          </label>

          <Button type="submit" className="w-full" size="lg">
            Dhuro {currency}{amount || 0}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
