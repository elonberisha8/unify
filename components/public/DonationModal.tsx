"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
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
import { DonationCheckout } from "@/components/stripe";
import { useAuth, useUser } from "@clerk/nextjs";

export interface DonationModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  campaignId: string;
  campaignTitle: string;
  presetAmounts?: number[];
  currency?: string;
}

type Step = "select" | "checkout";

export function DonationModal({
  open, onOpenChange, campaignId, campaignTitle,
  presetAmounts = [10, 25, 50, 100], currency = "€",
}: DonationModalProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [step, setStep] = React.useState<Step>("select");
  const [amount, setAmount] = React.useState<number | "">(presetAmounts[1] ?? 25);
  const [message, setMessage] = React.useState("");
  const [anonymous, setAnonymous] = React.useState(false);
  const [guestName, setGuestName] = React.useState("");

  const isGuest = !user;

  // Reset kur hapet modali
  React.useEffect(() => {
    if (open) {
      setStep("select");
      setAmount(presetAmounts[1] ?? 25);
      setMessage("");
      setAnonymous(false);
      setGuestName("");
    }
  }, [open]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) < 1) return;
    setStep("checkout");
  };

  const handleSuccess = async (paymentIntentId: string) => {
    // Ruaj donacionin direkt në DB — nuk presim webhook
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"}/api/donations/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": "unify-internal",
        },
        body: JSON.stringify({
          campaignId,
          donorClerkId:          user?.id ?? null,
          amount:                Number(amount),
          isAnonymous:           anonymous,
          message:               message || null,
          guestName:             isGuest && !anonymous ? (guestName || null) : null,
          stripePaymentIntentId: paymentIntentId,
        }),
      });
    } catch (e) {
      console.error("Gabim duke ruajtur donacionin:", e);
    }

    onOpenChange(false);
    router.push(
      `/sukses/donacion?pi=${paymentIntentId}&slug=${encodeURIComponent(campaignId)}&amount=${amount}&title=${encodeURIComponent(campaignTitle)}`
    );
  };

  const handleError = (msg: string) => {
    alert(msg);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setStep("select"); onOpenChange(o); }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "select" ? "Dhuro për këtë kampanjë" : `Pagesa — €${amount}`}
          </DialogTitle>
          <DialogDescription className="line-clamp-2">{campaignTitle}</DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <form onSubmit={handleContinue} className="space-y-5">
            {/* Shuma */}
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
                      amount === a
                        ? "bg-unify-blue text-white border-unify-blue"
                        : "bg-white border-border hover:border-unify-blue"
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

            {/* Emri nëse është guest */}
            {isGuest && !anonymous && (
              <div>
                <Label htmlFor="guest-name">Emri yt (opsional)</Label>
                <Input
                  id="guest-name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="p.sh. Arta Berisha"
                  className="mt-2"
                />
              </div>
            )}

            {/* Mesazhi */}
            <div>
              <Label htmlFor="msg">Mesazh (opsional)</Label>
              <Textarea
                id="msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2"
                rows={2}
                placeholder="Lëro një mesazh inkurajues..."
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={anonymous} onCheckedChange={(v) => setAnonymous(Boolean(v))} />
              <span className="text-sm">Dhuro anonimisht</span>
            </label>

            <Button type="submit" className="w-full" size="lg" disabled={!amount || Number(amount) < 1}>
              Vazhdo me pagesën — {currency}{amount || 0}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setStep("select")}
              className="text-sm text-unify-blue hover:underline flex items-center gap-1"
            >
              ← Ndrysho shumën
            </button>
            <DonationCheckout
              campaignId={campaignId}
              campaignTitle={campaignTitle}
              amount={Number(amount)}
              anonymous={anonymous}
              message={message}
              guestName={isGuest && !anonymous ? guestName : undefined}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
