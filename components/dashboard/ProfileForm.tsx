"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/Card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";

export interface ProfileFormProps {
  initial?: {
    name?: string;
    email?: string;
    bio?: string;
    phone?: string;
    location?: string;
    avatarUrl?: string;
  };
  onSave?: (data: Record<string, string>) => void | Promise<void>;
  className?: string;
}

export function ProfileForm({ initial = {}, onSave, className }: ProfileFormProps) {
  const [form, setForm] = React.useState({
    name: initial.name ?? "",
    email: initial.email ?? "",
    bio: initial.bio ?? "",
    phone: initial.phone ?? "",
    location: initial.location ?? "",
  });
  const [saving, setSaving] = React.useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave?.(form); } finally { setSaving(false); }
  };

  return (
    <Card className={cn(className)}>
      <CardContent className="p-6">
        <form onSubmit={handle} className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {initial.avatarUrl && <AvatarImage src={initial.avatarUrl} />}
              <AvatarFallback className="text-2xl">{form.name.charAt(0).toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <Button type="button" variant="outline" size="sm">Ndrysho foton</Button>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG — max 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Emri i plotë</Label>
              <Input id="name" value={form.name} onChange={set("name")} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={set("email")} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="phone">Telefoni</Label>
              <Input id="phone" value={form.phone} onChange={set("phone")} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="location">Qyteti</Label>
              <Input id="location" value={form.location} onChange={set("location")} className="mt-2" />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={form.bio} onChange={set("bio")} rows={4} className="mt-2" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>{saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
