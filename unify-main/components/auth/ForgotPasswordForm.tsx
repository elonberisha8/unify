"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";

export interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => void | Promise<void>;
  onBackToLogin?: () => void;
  className?: string;
}

export function ForgotPasswordForm({ onSubmit, onBackToLogin, className }: ForgotPasswordFormProps) {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit?.(email); setSent(true); } finally { setLoading(false); }
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardContent className="p-8 space-y-5">
        <div className="text-center">
          <h1 className="font-display text-3xl text-unify-brown">Rikuperim fjalëkalimi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sent ? "Kontrollo emailin për udhëzimet." : "Të dërgojmë një link për rikuperim."}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handle} className="space-y-4">
            <div>
              <Label htmlFor="f-email">Email</Label>
              <Input id="f-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Duke dërguar..." : "Dërgo link"}
            </Button>
          </form>
        ) : (
          <div className="text-center text-sm text-muted-foreground bg-unify-cream rounded-xl p-4">
            Një email është dërguar në <span className="font-bold text-foreground">{email}</span>.
          </div>
        )}

        {onBackToLogin && (
          <button onClick={onBackToLogin} className="text-sm text-unify-blue hover:underline w-full text-center">
            ← Kthehu te hyrja
          </button>
        )}
      </CardContent>
    </Card>
  );
}
