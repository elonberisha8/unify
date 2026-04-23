"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";

export interface RegisterFormProps {
  onSubmit?: (data: { name: string; email: string; password: string; terms: boolean }) => void | Promise<void>;
  onGoogleSignup?: () => void;
  onLogin?: () => void;
  error?: string;
  className?: string;
}

export function RegisterForm({ onSubmit, onGoogleSignup, onLogin, error, className }: RegisterFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [terms, setTerms] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) return;
    setLoading(true);
    try { await onSubmit?.({ name, email, password, terms }); } finally { setLoading(false); }
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardContent className="p-8 space-y-5">
        <div className="text-center">
          <h1 className="font-display text-3xl text-unify-brown">Krijo llogari</h1>
          <p className="text-sm text-muted-foreground mt-1">Bashkohu me komunitetin Unify</p>
        </div>

        {onGoogleSignup && (
          <>
            <Button type="button" variant="outline" className="w-full" onClick={onGoogleSignup}>
              Vazhdo me Google
            </Button>
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">ose</span></div>
            </div>
          </>
        )}

        <form onSubmit={handle} className="space-y-4">
          <div>
            <Label htmlFor="r-name">Emri i plotë</Label>
            <Input id="r-name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="r-email">Email</Label>
            <Input id="r-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="r-pass">Fjalëkalimi</Label>
            <Input id="r-pass" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Minimumi 8 karaktere</p>
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <Checkbox checked={terms} onCheckedChange={(v) => setTerms(Boolean(v))} />
            <span className="text-sm text-muted-foreground">
              Pranoj <a href="/terms" className="text-unify-blue hover:underline">Kushtet e Përdorimit</a> dhe{" "}
              <a href="/privacy" className="text-unify-blue hover:underline">Politikën e Privatësisë</a>
            </span>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading || !terms}>
            {loading ? "Duke krijuar..." : "Krijo llogari"}
          </Button>
        </form>

        {onLogin && (
          <p className="text-sm text-center text-muted-foreground">
            Ke tashmë llogari?{" "}
            <button onClick={onLogin} className="text-unify-blue font-bold hover:underline">Hyr</button>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
