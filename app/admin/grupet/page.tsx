"use client";

// ============================================================
// /admin/grupet — Group Management
// ============================================================

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { AdminLayout } from "@/components/layout";
import { Card, CardContent, Button, Input, Badge, Skeleton, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { UsersIcon, EyeIcon, AlertTriangleIcon, SearchIcon } from "@/components/icons";
import { apiFetch, type Conversation } from "@/app/_lib/api";

interface AdminGroup extends Conversation {
  reportCount?: number;
  isSuspended?: boolean;
}

export default function AdminGroupsPage() {
  const { getToken } = useAuth();
  const [groups, setGroups] = React.useState<AdminGroup[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [activeGroup, setActiveGroup] = React.useState<AdminGroup | null>(null);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const token = await getToken();
        const data = await apiFetch<AdminGroup[] | { groups: AdminGroup[] }>("/admin/groups", { token });
        const list = Array.isArray(data) ? data : (data as { groups?: AdminGroup[] }).groups ?? [];
        setGroups(list);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  const filtered = groups.filter((g) =>
    !search || g.name?.toLowerCase().includes(search.toLowerCase()) ||
    g.participants.some((p) => p.username.toLowerCase().includes(search.toLowerCase()))
  );

  async function suspendGroup(id: string, suspend: boolean) {
    try {
      const token = await getToken();
      await apiFetch(`/admin/groups/${id}/${suspend ? "suspend" : "unsuspend"}`, { method: "PATCH", token });
      setGroups((p) => p.map((g) => g.id === id ? { ...g, isSuspended: suspend } : g));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gabim");
    }
  }

  return (
    <AdminLayout
      sidebar={{ activeKey: "groups" }}
      header={{
        title: "Grupet",
        description: "Menaxhim grupesh dhe raportimesh",
        user: { name: "Unify Admin", role: "Internal" },
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon className="h-6 w-6" /> Group Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Të gjitha grupet në inbox · raportimet · pezullim
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
          <SearchIcon className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Kërko sipas emrit ose @username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0 px-0"
          />
          <Badge variant="outline" className="ml-auto">{filtered.length} grupe</Badge>
        </div>

        {loading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-sm text-gray-500">
            Asnjë grup në sistem.
          </CardContent></Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((g) => (
              <Card key={g.id} className="border border-gray-200">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{g.name ?? "Grup pa emër"}</h3>
                      {g.isSuspended && <Badge className="bg-red-100 text-red-800">PEZULLUAR</Badge>}
                      {(g.reportCount ?? 0) > 0 && (
                        <Badge className="bg-orange-100 text-orange-800">
                          <AlertTriangleIcon className="h-3 w-3 mr-1" /> {g.reportCount} raportime
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {g.participants.length} anëtarë · krijuar {new Date(g.updatedAt).toLocaleDateString("sq-AL")}
                    </p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {g.participants.slice(0, 6).map((p) => (
                        <Badge key={p.id} variant="outline" className="text-xs">@{p.username}</Badge>
                      ))}
                      {g.participants.length > 6 && (
                        <Badge variant="outline" className="text-xs">+{g.participants.length - 6}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setActiveGroup(g)} className="gap-2">
                      <EyeIcon className="h-3 w-3" /> Detajet
                    </Button>
                    {g.isSuspended ? (
                      <Button size="sm" variant="outline" onClick={() => suspendGroup(g.id, false)}>
                        Çpezullo
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => suspendGroup(g.id, true)} className="text-red-600 hover:bg-red-50 border-red-200">
                        Pezullo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!activeGroup} onOpenChange={(o) => !o && setActiveGroup(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{activeGroup?.name ?? "Grup"}</DialogTitle>
          </DialogHeader>
          {activeGroup && (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Anëtarët</p>
                <div className="space-y-2">
                  {activeGroup.participants.map((p) => (
                    <a key={p.id} href={`/profili/${p.username}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                      <div className="h-9 w-9 rounded-full bg-unify-blue text-white flex items-center justify-center text-sm font-semibold">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-gray-500">@{p.username}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

