"use client";

// ============================================================
// BRANCH: feat/dashboard-home
// Blog — menaxho postimet që shfaqen në faqen kryesore publike
// ============================================================

import * as React from "react";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  Button, Input, Textarea, Label,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
  Badge,
} from "@/components/ui";
import { DashboardLayout } from "@/components/layout";
import { EditIcon, TrashIcon, PlusIcon, EyeIcon, CalendarIcon } from "@/components/icons";

type PostStatus = "published" | "draft";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  category: string;
  date: string;
  author: string;
  readTime: string;
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: "p1",
    title: "Si e ndryshoi jetën vullnetarizmi: Historia e Artës",
    excerpt: "Arta Krasniqi ndau historinë e saj të jashtëzakonshme si vullnetare me OJQ Drita — tre vjet përvojë që e transformoi karrierën e saj.",
    content: "Arta Krasniqi ndau historinë e saj...",
    status: "published",
    category: "Historia suksesi",
    date: "22 Pri 2026",
    author: "Redaksia Unify",
    readTime: "3 min",
  },
  {
    id: "p2",
    title: "Kampanja 'Bursa Studentore 2025' arriti objektivin!",
    excerpt: "Falënderojmë të gjithë donatorët që kontribuan për të arritur objektivin e €3,000 brenda 45 ditësh.",
    content: "Falënderojmë të gjithë donatorët...",
    status: "published",
    category: "Lajme",
    date: "18 Pri 2026",
    author: "Redaksia Unify",
    readTime: "2 min",
  },
  {
    id: "p3",
    title: "5 arsye pse organizatat duhet të listohen në Unify",
    excerpt: "Platforma jonë ofron mjetet e duhura për të gjetur vullnetarë të motivuar dhe për të menaxhuar kampanjat tuaja.",
    content: "Platforma jonë ofron...",
    status: "draft",
    category: "Udhëzues",
    date: "15 Pri 2026",
    author: "Redaksia Unify",
    readTime: "5 min",
  },
];

const CATEGORIES = ["Historia suksesi", "Lajme", "Udhëzues", "Ngjarje", "Njoftim"];

const STATUS_STYLES: Record<PostStatus, string> = {
  published: "bg-green-100 text-green-800",
  draft:     "bg-yellow-100 text-yellow-700",
};
const STATUS_LABELS: Record<PostStatus, string> = {
  published: "Publikuar",
  draft:     "Draft",
};

const EMPTY_FORM = { title: "", excerpt: "", content: "", status: "draft" as PostStatus, category: "", author: "", readTime: "" };

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState<PostStatus | "all">("all");

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content, status: post.status, category: post.category, author: post.author, readTime: post.readTime });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.title.trim()) return;
    const now = new Date().toLocaleDateString("sq-AL", { day: "numeric", month: "short", year: "numeric" });
    if (editing) {
      setPosts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...form } : p));
    } else {
      const newPost: BlogPost = { id: `p${Date.now()}`, ...form, date: now };
      setPosts((prev) => [newPost, ...prev]);
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function toggleStatus(id: string) {
    setPosts((prev) =>
      prev.map((p) => p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p)
    );
  }

  const filtered = posts.filter((p) => filterStatus === "all" || p.status === filterStatus);
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  return (
    <DashboardLayout activeKey="blog">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
            <p className="text-sm text-gray-500 mt-1">
              {publishedCount} publikuar · {draftCount} draft
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <PlusIcon className="h-4 w-4" /> Postim i ri
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {([["all", "Të gjitha", posts.length], ["published", "Publikuar", publishedCount], ["draft", "Draft", draftCount]] as const).map(([val, label, count]) => (
            <button
              key={val}
              onClick={() => setFilterStatus(val as PostStatus | "all")}
              className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                filterStatus === val
                  ? "border-unify-blue text-unify-blue"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${filterStatus === val ? "bg-unify-blue text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Post list */}
        <div className="space-y-3">
          {filtered.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[post.status]}`}>
                    {STATUS_LABELS[post.status]}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">{post.category}</span>
                  <span className="text-xs text-gray-400">· {post.readTime} lexim</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{post.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{post.date}</span>
                  <span>{post.author}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-unify-blue"
                  title="Shiko"
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-unify-blue"
                  onClick={() => openEdit(post)}
                  title="Edito"
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-green-600"
                  onClick={() => toggleStatus(post.id)}
                  title={post.status === "draft" ? "Publiko" : "Kthe në draft"}
                >
                  {post.status === "draft" ? "📢" : "📋"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                  onClick={() => handleDelete(post.id)}
                  title="Fshi"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edito postimin" : "Postim i ri"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Titulli *</Label>
              <Input
                placeholder="Titulli i postimit"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Kategoria</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Zgjidh" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Statusi</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as PostStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Publiko</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Autori</Label>
                <Input
                  placeholder="Emri i autorit"
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Kohë leximi</Label>
                <Input
                  placeholder="p.sh. 3 min"
                  value={form.readTime}
                  onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Rezyme e shkurtër</Label>
              <Textarea
                rows={2}
                placeholder="Shkruaj 1-2 fjali të shkurtra që përshkruajnë postimin..."
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Përmbajtja e plotë *</Label>
              <Textarea
                rows={8}
                placeholder="Shkruaj përmbajtjen e plotë të postimit..."
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Anulo</Button>
              <Button onClick={handleSave} disabled={!form.title.trim()}>
                {editing ? "Ruaj ndryshimet" : "Krijo postimin"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
