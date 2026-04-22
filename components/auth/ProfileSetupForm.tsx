"use client";
import * as React from "react";
import { Input, Label, Textarea, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface ProfileSetupData {
  fullName: string;
  phone: string;
  city: string;
  bio: string;
  avatar?: File;
}

export interface ProfileSetupFormProps {
  onSubmit?: (data: ProfileSetupData) => void;
  submitLabel?: string;
  className?: string;
}

export function ProfileSetupForm({ onSubmit, submitLabel = "Vazhdo", className }: ProfileSetupFormProps) {
  const [data, setData] = React.useState<ProfileSetupData>({ fullName: "", phone: "", city: "", bio: "" });
  const upd = (k: keyof ProfileSetupData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData({ ...data, [k]: e.target.value });
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(data); }}
      className={cn("space-y-5", className)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Emri i plotë</Label>
          <Input id="fullName" value={data.fullName} onChange={upd("fullName")} placeholder="Arta Hoxha" />
        </div>
        <div>
          <Label htmlFor="phone">Telefoni</Label>
          <Input id="phone" type="tel" value={data.phone} onChange={upd("phone")} placeholder="+383 44 123 456" />
        </div>
      </div>
      <div>
        <Label htmlFor="city">Qyteti</Label>
        <Input id="city" value={data.city} onChange={upd("city")} placeholder="Prishtinë" />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={data.bio} onChange={upd("bio")} rows={4} placeholder="Trego pak për veten..." />
      </div>
      <Button type="submit" size="lg" className="w-full">{submitLabel}</Button>
    </form>
  );
}
