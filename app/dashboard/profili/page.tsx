"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { StripeVerificationCard, type VerifyStatus } from "@/components/dashboard";
import { apiFetch } from "@/app/_lib/api";
import { profileUrl } from "@/app/_lib/username";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Separator,
  Switch,
  Textarea,
} from "@/components/ui";

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  image?: string | null;
  isVerified: boolean;
  privacyProfilePublic?: boolean;
  privacyCampaignsPublic?: boolean;
  privacyDonationsPublic?: boolean;
  privacyVolunteerPublic?: boolean;
};

type ProfileFormState = {
  name: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  phone: string;
  image: string;
  privacyProfilePublic: boolean;
  privacyCampaignsPublic: boolean;
  privacyDonationsPublic: boolean;
  privacyVolunteerPublic: boolean;
};

const emptyForm: ProfileFormState = {
  name: "",
  username: "",
  email: "",
  bio: "",
  location: "",
  phone: "",
  image: "",
  privacyProfilePublic: true,
  privacyCampaignsPublic: true,
  privacyDonationsPublic: true,
  privacyVolunteerPublic: false,
};

const privacySettings = [
  {
    key: "privacyProfilePublic",
    title: "Profili publik",
    description: "Shfaq profilin në faqet publike.",
  },
  {
    key: "privacyCampaignsPublic",
    title: "Kampanjat",
    description: "Shfaq kampanjat aktive në profil.",
  },
  {
    key: "privacyDonationsPublic",
    title: "Donacionet",
    description: "Shfaq kontributet jo-anonime.",
  },
  {
    key: "privacyVolunteerPublic",
    title: "Vullnetarizmi",
    description: "Shfaq aktivitetin vullnetar.",
  },
] as const;

type PrivacyKey = (typeof privacySettings)[number]["key"];

async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text.slice(0, 160) || `HTTP ${res.status}`);
  }
}

function formFromUser(user: ProfileUser): ProfileFormState {
  return {
    name: user.name ?? "",
    username: user.username ?? "",
    email: user.email ?? "",
    bio: user.bio ?? "",
    location: user.location ?? "",
    phone: user.phone ?? "",
    image: user.image ?? "",
    privacyProfilePublic: user.privacyProfilePublic ?? true,
    privacyCampaignsPublic: user.privacyCampaignsPublic ?? true,
    privacyDonationsPublic: user.privacyDonationsPublic ?? true,
    privacyVolunteerPublic: user.privacyVolunteerPublic ?? false,
  };
}

export default function ProfilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [user, setUser] = React.useState<ProfileUser | null>(null);
  const [form, setForm] = React.useState<ProfileFormState>(emptyForm);
  const [verificationStatus, setVerificationStatus] = React.useState<VerifyStatus>("not-started");
  const [loading, setLoading] = React.useState(true);
  const [checkingVerification, setCheckingVerification] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const refreshVerificationStatus = React.useCallback(async () => {
    const res = await fetch("/api/verification/status");
    const data = await readJson<{ isVerified?: boolean }>(res);
    const nextStatus = data.isVerified
      ? "verified"
      : searchParams.get("identity") === "complete"
        ? "pending"
        : "not-started";

    setVerificationStatus(nextStatus);
    setUser((current) => current ? { ...current, isVerified: Boolean(data.isVerified) } : current);
    return nextStatus;
  }, [searchParams]);

  React.useEffect(() => {
    async function loadProfile() {
      if (!isLoaded) return;
      if (!isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const [me] = await Promise.all([
          apiFetch<ProfileUser>("/users/me", { token }),
          refreshVerificationStatus().catch(() => null),
        ]);
        setUser(me);
        setForm(formFromUser(me));
        if (me.isVerified) setVerificationStatus("verified");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Profili nuk u ngarkua.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [getToken, isLoaded, isSignedIn, refreshVerificationStatus]);

  const update = (key: keyof ProfileFormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function saveProfile() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const token = await getToken();
      const updated = await apiFetch<ProfileUser>("/users/me", {
        method: "PUT",
        token,
        body: JSON.stringify({
          name: form.name,
          username: form.username || undefined,
          bio: form.bio,
          location: form.location,
          phone: form.phone,
          image: form.image || undefined,
          privacyProfilePublic: form.privacyProfilePublic,
          privacyCampaignsPublic: form.privacyCampaignsPublic,
          privacyDonationsPublic: form.privacyDonationsPublic,
          privacyVolunteerPublic: form.privacyVolunteerPublic,
        }),
      });

      setUser(updated);
      setForm(formFromUser(updated));
      setMessage("Profili u ruajt me sukses.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ndryshimet nuk u ruajtën.");
    } finally {
      setSaving(false);
    }
  }

  async function startVerification() {
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/verification/start", { method: "POST" });
      const data = await readJson<{ url?: string; error?: string }>(res);

      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
      if (!data.url) throw new Error("Stripe nuk ktheu URL për verifikim. Provo përsëri.");

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gabim gjatë hapjes së verifikimit.");
    }
  }

  async function checkVerificationAgain() {
    setCheckingVerification(true);
    setError("");
    try {
      const nextStatus = await refreshVerificationStatus();
      if (nextStatus === "verified") setMessage("Identiteti u verifikua me sukses.");
      else setMessage("Statusi u kontrollua. Stripe ende po e shqyrton verifikimin.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Statusi i verifikimit nuk u lexua.");
    } finally {
      setCheckingVerification(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout activeKey="profile">
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-gray-500">Duke ngarkuar profilin...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeKey="profile"
      user={user ? { name: user.name, email: user.email, avatarUrl: user.image ?? undefined } : undefined}
    >
      <div className="max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profili im</h1>
            <p className="mt-1 text-sm text-gray-500">
              Menaxho profilin, cilësimet dhe verifikimin e identitetit.
            </p>
          </div>

          {user?.username && (
            <Button asChild variant="outline">
              <a href={profileUrl(user.username)}>Shiko profilin publik</a>
            </Button>
          )}
        </div>

        {(error || message) && (
          <div
            className={
              error
                ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                : "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            }
          >
            {error || message}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Card>
            <CardContent className="space-y-6 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-20 w-20">
                  {form.image && <AvatarImage src={form.image} />}
                  <AvatarFallback className="text-2xl">
                    {form.name.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-unify-brown">{form.name || "Profili"}</h2>
                    <Badge variant={verificationStatus === "verified" ? "success" : "secondary"}>
                      {verificationStatus === "verified" ? "I verifikuar" : "Pa verifikim"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{form.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Emri i plotë</Label>
                  <Input id="name" value={form.name} onChange={(event) => update("name", event.target.value)} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={form.username} onChange={(event) => update("username", event.target.value)} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={form.email} disabled className="mt-2 bg-muted/60" />
                </div>
                <div>
                  <Label htmlFor="phone">Telefoni</Label>
                  <Input id="phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} className="mt-2" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="location">Lokacioni</Label>
                  <Input id="location" value={form.location} onChange={(event) => update("location", event.target.value)} className="mt-2" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="image">Foto profili URL</Label>
                  <Input id="image" value={form.image} onChange={(event) => update("image", event.target.value)} className="mt-2" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={form.bio} onChange={(event) => update("bio", event.target.value)} rows={4} className="mt-2" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={saveProfile} disabled={saving}>
                  {saving ? "Duke ruajtur..." : "Ruaj profilin"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <aside className="space-y-5">
            <section className="space-y-3">
              <div>
                <h2 className="text-base font-bold text-unify-brown">Verifikimi</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Stripe Identity për krijimin e kampanjave.
                </p>
              </div>

              {searchParams.get("identity") === "complete" && verificationStatus === "pending" && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                  <strong>Dokumenti u dërgua.</strong> Stripe po e shqyrton.
                </div>
              )}

              <StripeVerificationCard status={verificationStatus} onStart={startVerification} className="rounded-xl p-5" />

              {verificationStatus === "pending" && (
                <button
                  onClick={checkVerificationAgain}
                  disabled={checkingVerification}
                  className="text-sm font-medium text-unify-blue hover:underline disabled:opacity-60"
                >
                  {checkingVerification ? "Duke kontrolluar..." : "Kontrollo statusin sërish →"}
                </button>
              )}

              {verificationStatus === "verified" && (
                <button
                  onClick={() => router.push("/dashboard/krijo/kampanje")}
                  className="text-sm font-medium text-unify-blue hover:underline"
                >
                  Krijo kampanjën tënde të parë →
                </button>
              )}
            </section>

            <Card>
              <CardContent className="space-y-4 p-4">
                <div>
                  <h2 className="text-base font-bold text-unify-brown">Cilësimet</h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Çfarë shihet publikisht nga profili yt.
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  {privacySettings.map((item) => (
                    <div key={item.key} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-unify-brown">{item.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch
                        checked={form[item.key]}
                        onCheckedChange={(checked) => update(item.key as PrivacyKey, checked)}
                        aria-label={item.title}
                      />
                    </div>
                  ))}
                </div>

                <Button type="button" onClick={saveProfile} disabled={saving} className="w-full">
                  {saving ? "Duke ruajtur..." : "Ruaj cilësimet"}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
