"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export interface NewsletterSignupProps {
  title?: string;
  description?: string;
  onSubmit?: (email: string) => void | Promise<void>;
  className?: string;
}

export function NewsletterSignup({
  title = "Abonohu në newsletter",
  description = "Merr përditësimet tona direkt në inbox.",
  onSubmit, className,
}: NewsletterSignupProps) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try { await onSubmit?.(email); setDone(true); } finally { setLoading(false); }
  };

  return (
    <div className={cn("rounded-[24px] bg-unify-cream p-6 md:p-8", className)}>
      <h3 className="font-display text-2xl text-unify-brown">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      {done ? (
        <p className="mt-4 text-unify-green font-bold">Faleminderit! Je abonuar.</p>
      ) : (
        <form onSubmit={handle} className="mt-4 flex gap-2">
          <Input type="email" required placeholder="emaili@shembull.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" disabled={loading}>{loading ? "..." : "Abonohu"}</Button>
        </form>
      )}
    </div>
  );
}
