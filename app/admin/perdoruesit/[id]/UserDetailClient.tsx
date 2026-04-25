"use client"

import * as React from "react"
import { useAuth } from "@clerk/nextjs"
import { AdminLayout } from "@/components/layout"
import { Badge, Button, Card, CardContent, Separator, Skeleton } from "@/components/ui"
import { apiFetch, type AdminUserDetail } from "@/app/_lib/api"

export function UserDetailClient({ id }: { id: string }) {
  const { getToken } = useAuth()
  const [user, setUser] = React.useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [notFound, setNotFound] = React.useState(false)
  const [systemNote, setSystemNote] = React.useState("Gati per kontroll.")

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const data = await apiFetch<AdminUserDetail>(`/admin/users/${id}`, { token })
      setUser(data)
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [id, getToken])

  React.useEffect(() => { load() }, [load])

  const mutate = React.useCallback(
    async (path: string, body?: Record<string, unknown>) => {
      const token = await getToken()
      await apiFetch(path, {
        method: "PATCH",
        token,
        body: body ? JSON.stringify(body) : undefined,
      })
      await load()
    },
    [getToken, load]
  )

  if (loading) {
    return (
      <AdminLayout
        sidebar={{ activeKey: "users" }}
        header={{ title: "Detajet e user-it", description: `User ID: ${id}`, user: { name: "Unify Admin", role: "Internal" } }}
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </AdminLayout>
    )
  }

  if (notFound || !user) {
    return (
      <AdminLayout
        sidebar={{ activeKey: "users" }}
        header={{ title: "Detajet e user-it", description: `User ID: ${id}`, user: { name: "Unify Admin", role: "Internal" } }}
      >
        <Card>
          <CardContent className="p-8 text-center">
            <p className="font-display text-xl text-unify-brown">Useri nuk u gjet</p>
            <Button className="mt-4" variant="outline" onClick={() => { window.location.href = "/admin/perdoruesit" }}>
              Kthehu te lista
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      sidebar={{ activeKey: "users" }}
      header={{
        title: "Detajet e user-it",
        description: `User ID: ${id}. Vetem user i regjistruar, jo admin.`,
        user: { name: "Unify Admin", role: "Internal" },
      }}
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Identity card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={user.isBanned ? "destructive" : "success"}>
                      {user.isBanned ? "blocked" : "active"}
                    </Badge>
                    <Badge variant={user.isVerified ? "success" : "warning"}>
                      {user.isVerified ? "verified" : "unverified"}
                    </Badge>
                    <Badge variant="primary">role: {user.role.toLowerCase()}</Badge>
                  </div>
                  <h2 className="mt-4 font-display text-3xl text-unify-brown">{user.name}</h2>
                  <p className="mt-1 text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Anëtarësuar: {new Date(user.createdAt).toLocaleDateString("sq-AL")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await mutate(`/admin/users/${id}/ban`)
                      setSystemNote(user.isBanned ? "Useri u zhbllokua." : "Useri u bllokua.")
                    }}
                  >
                    {user.isBanned ? "Zhblloko" : "Blloko"}
                  </Button>
                  {!user.isVerified && (
                    <Button
                      variant="outline"
                      onClick={async () => {
                        await mutate(`/admin/users/${id}/verify`)
                        setSystemNote("Useri u verifikua manualisht.")
                      }}
                    >
                      Verifiko
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (!window.confirm("A je i sigurt qe do ta fshish kete user?")) return
                      window.location.href = "/admin/perdoruesit"
                    }}
                  >
                    Fshi
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Kampanja" value={`${user._count.campaigns}`} hint="të krijuara" />
                <Metric label="Donacione" value={`${user._count.donations}`} hint={user.totalDonated ? `EUR ${user.totalDonated.toLocaleString()}` : "—"} />
                <Metric label="Shpallje" value={`${user._count.volunteerListings ?? 0}`} hint="vullnetare" />
                <Metric label="Raportime" value={`${user._count.reports ?? 0}`} hint="risk i ulet" />
              </div>
            </CardContent>
          </Card>

          {/* Verification & tech */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-xl text-unify-brown">Statusi i llogarisë</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Info label="Verifikuar" value={user.isVerified ? "Po" : "Jo"} variant={user.isVerified ? "success" : "warning"} />
                <Info label="Bllokuar" value={user.isBanned ? "Po" : "Jo"} variant={user.isBanned ? "destructive" : "success"} />
                <Info label="Roli" value={user.role} variant="primary" />
                <Info label="Aplikime" value={`${user._count.applications ?? 0} aplikime`} variant="secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin controls sidebar */}
        <Card>
          <CardContent className="space-y-3 p-6">
            <h3 className="font-display text-xl text-unify-brown">Admin controls</h3>
            <p className="rounded-xl bg-muted/50 p-3 text-sm text-unify-brown">{systemNote}</p>

            {!user.isVerified && (
              <Button
                className="w-full"
                onClick={async () => {
                  await mutate(`/admin/users/${id}/verify`)
                  setSystemNote("User u shenua fully verified.")
                }}
              >
                Sheno fully verified
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                await mutate(`/admin/users/${id}/role`, { role: "MODERATOR" })
                setSystemNote("Roli u ndryshua ne Moderator.")
              }}
            >
              Bëje Moderator
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                await mutate(`/admin/users/${id}/role`, { role: "USER" })
                setSystemNote("Roli u kthye ne User.")
              }}
            >
              Ktheje User
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={async () => {
                await mutate(`/admin/users/${id}/ban`)
                setSystemNote(user.isBanned ? "Useri u zhbllokua." : "Useri u bllokua.")
              }}
            >
              {user.isBanned ? "Zhblloko user" : "Blloko user"}
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => { window.location.href = "/admin/perdoruesit" }}
            >
              Kthehu te lista
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl text-unify-brown">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

function Info({ label, value, variant }: { label: string; value: string; variant: "primary" | "secondary" | "success" | "warning" | "destructive" }) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <Badge className="mt-2" variant={variant}>{value}</Badge>
    </div>
  )
}
