"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";

export interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string; remember: boolean }) => void | Promise<void>;
  onGoogleLogin?: () => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  error?: string;
  className?: string;
}

export function LoginForm({ onSubmit, onGoogleLogin, onForgotPassword, onRegister, error, className }: LoginFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit?.({ email, password, remember }); } finally { setLoading(false); }
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardContent className="p-8 space-y-5">
        <div className="text-center">
          <h1 className="font-display text-3xl text-unify-brown">Mirë se erdhe</h1>
          <p className="text-sm text-muted-foreground mt-1">Hyr në llogarinë tënde Unify</p>
        </div>

        {onGoogleLogin && (
          <>
            <Button type="button" variant="outline" className="w-full" onClick={onGoogleLogin}>
              Vazhdo me Google
            </Button>
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">ose</span></div>
            </div>
          </>
        )}

        <form onSubmit={handle} className="space-y-4">
          <div>
            <Label htmlFor="l-email">Email</Label>
            <Input id="l-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="l-pass">Fjalëkalimi</Label>
              {onForgotPassword && (
                <button type="button" onClick={onForgotPassword} className="text-xs text-unify-blue hover:underline">Harrove?</button>
              )}
            </div>
            <Input id="l-pass" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
            <span className="text-sm">Më mba mend</span>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Duke hyrë..." : "Hyr"}
          </Button>
        </form>

        {onRegister && (
          <p className="text-sm text-center text-muted-foreground">
            Nuk ke llogari?{" "}
            <button onClick={onRegister} className="text-unify-blue font-bold hover:underline">Regjistrohu</button>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
