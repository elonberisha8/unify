"use client";

// ============================================================
// BRANCH: feat/dashboard-home
// Blog - postime dinamike te userit
// ============================================================

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  Button, Input, Textarea, Label,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import { EditIcon, TrashIcon, PlusIcon, CalendarIcon } from "@/components/icons";
import { apiFetch } from "@/app/_lib/api";

type ApiBlogStatus = "PENDING" | "DRAFT" | "PUBLISHED" | "REJECTED";
type PostStatus = "pending" | "published" | "draft" | "rejected";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage?: string | null;
  status: ApiBlogStatus;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_FORM = { title: "", excerpt: "", content: "", coverImage: "" };

const STATUS_STYLES: Record<PostStatus, string> = {
  published: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-700",
  pending: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<PostStatus, string> = {
  published: "Publikuar",
  draft: "Draft",
  pending: "Ne review",
  rejected: "Refuzuar",
};

function normalizeStatus(status: ApiBlogStatus): PostStatus {
  return status.toLowerCase() as PostStatus;
}

export default function BlogPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<BlogPost | null>(null);
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = React.useState<PostStatus | "all">("all");
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    if (!isLoaded) return;
    const hasLocalToken = typeof window !== "undefined" && Boolean(window.localStorage.getItem("authToken"));
    if (!isSignedIn && !hasLocalToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const token = isSignedIn ? await getToken() : null;
      const res = await apiFetch<{ posts: BlogPost[] }>("/blog/my", { token });
      setPosts(res.posts);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  React.useEffect(() => { load() }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) return;
    const token = isSignedIn ? await getToken() : null;
    if (editing) {
      await apiFetch(`/blog/my/${editing.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt || undefined,
          content: form.content,
          coverImage: form.coverImage || undefined,
        }),
      }).catch(() => {});
    } else {
      await apiFetch("/blog/submit", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt || undefined,
          content: form.content,
          coverImage: form.coverImage || undefined,
        }),
      }).catch(() => {});
    }
    setDialogOpen(false);
    await load();
  }

  async function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    const token = isSignedIn ? await getToken() : null;
    await apiFetch(`/blog/my/${id}`, { method: "DELETE", token }).catch(() => {});
  }

  const filtered = posts.filter((p) => filterStatus === "all" || normalizeStatus(p.status) === filterStatus);
  const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;
  const pendingCount = posts.filter((p) => p.status === "PENDING").length;
  const draftCount = posts.filter((p) => p.status === "DRAFT").length;

  return (
    <DashboardLayout activeKey="blog">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
            <p className="mt-1 text-sm text-gray-500">{publishedCount} publikuar - {pendingCount} ne review - {draftCount} draft</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <PlusIcon className="h-4 w-4" /> Postim i ri
          </Button>
        </div>

        <div className="flex gap-1 border-b border-gray-200">
          {([["all", "Te gjitha", posts.length], ["published", "Publikuar", publishedCount], ["pending", "Ne review", pendingCount], ["draft", "Draft", draftCount]] as const).map(([val, label, count]) => (
            <button
              key={val}
              onClick={() => setFilterStatus(val as PostStatus | "all")}
              className={`flex items-center gap-1.5 border-b-2 px-3 pb-3 text-sm font-medium transition-colors ${
                filterStatus === val ? "border-unify-blue text-unify-blue" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${filterStatus === val ? "bg-unify-blue text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">Duke lexuar blogjet nga DB...</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">Nuk ka blogje ne DB per kete filter.</div>
          ) : filtered.map((post) => {
            const status = normalizeStatus(post.status);
            return (
              <div key={post.id} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>
                    <span className="text-xs text-gray-400">- {new Date(post.createdAt).toLocaleDateString("sq-AL")}</span>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug text-gray-900">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">{post.excerpt}</p>
                  {post.coverImage && <p className="mt-1 truncate text-xs text-gray-400">Foto: {post.coverImage}</p>}
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{new Date(post.updatedAt).toLocaleDateString("sq-AL")}</span>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-unify-blue" onClick={() => openEdit(post)} title="Edito">
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-red-500" onClick={() => handleDelete(post.id)} title="Fshi">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edito postimin" : "Postim i ri"}</DialogTitle>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            <div className="space-y-1.5">
              <Label>Titulli *</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Titulli i postimit" />
            </div>

            <div className="space-y-1.5">
              <Label>Statusi</Label>
              <Select value={editing ? normalizeStatus(editing.status) : "pending"} disabled>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Dergohet per aprovim</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Publikuar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Foto cover (URL)</Label>
              <Input value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))} placeholder="https://..." />
            </div>

            <div className="space-y-1.5">
              <Label>Rezyme e shkurter</Label>
              <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} placeholder="Shkruaj 1-2 fjali te shkurtra..." />
            </div>

            <div className="space-y-1.5">
              <Label>Permbajtja e plote *</Label>
              <Textarea rows={8} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="Shkruaj permbajtjen e plote te postimit..." />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Anulo</Button>
              <Button onClick={handleSave} disabled={!form.title.trim() || !form.content.trim()}>
                {editing ? "Ruaj ndryshimet" : "Dergo per aprovim"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
