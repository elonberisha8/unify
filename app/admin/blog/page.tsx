"use client"

// ============================================================
// BRANCH: feat/admin-moderation
// FIGMA:
//   Admin - Blog CMS -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=43-2
// NOTION: https://www.notion.so/34874891227e8145ac16f2b024b58fc0
// ============================================================

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { AdminActionMenu, AdminFilterBar, AdminTable, BlogEditor, type AdminActionMenuItem, type BlogEditorData } from "@/components/admin"
import { AdminLayout } from "@/components/layout"
import { Badge, Button, Card, CardContent, Skeleton } from "@/components/ui"
import { apiFetch } from "@/app/_lib/api"

type BlogStatus = "pending" | "draft" | "published" | "rejected"

interface BlogPost extends BlogEditorData {
  id: string
  author: string
  authorEmail: string
  source: "user" | "admin"
  status: BlogStatus
  submittedAt: string
  reviewNote?: string
}

const statusVariant = {
  pending: "warning",
  draft: "secondary",
  published: "success",
  rejected: "destructive",
} as const

export default function AdminBlogPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [posts, setPosts] = React.useState<BlogPost[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedId, setSelectedId] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [query, setQuery] = React.useState("")

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const res = await apiFetch<{ posts: BlogPost[] }>("/admin/blog-posts", { token })
      setPosts(res.posts)
      setSelectedId((current) => res.posts.some((post) => post.id === current) ? current : res.posts[0]?.id ?? "")
    } catch {
      setPosts([])
      setSelectedId("")
    } finally {
      setLoading(false)
    }
  }, [getToken])

  React.useEffect(() => { load() }, [load])

  const selected = posts.find((post) => post.id === selectedId) ?? null

  const patchPost = async (id: string, patch: Partial<BlogPost>) => {
    setPosts((current) => current.map((post) => (post.id === id ? { ...post, ...patch } : post)))
    try {
      const token = await getToken()
      await apiFetch(`/admin/blog-posts/${id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(patch),
      })
      await load()
    } catch { /* keep optimistic update */ }
  }

  const createPost = async () => {
    try {
      const token = await getToken()
      const post = await apiFetch<BlogPost>("/admin/blog-posts", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: "Postim i ri",
          slug: `postim-i-ri-${Date.now()}`,
          excerpt: "",
          content: "",
          tags: [],
          status: "draft",
        }),
      })
      await load()
      setSelectedId(post.id)
    } catch { /* keep current */ }
  }

  const removePost = async (id: string) => {
    setPosts((current) => current.filter((post) => post.id !== id))
    if (selectedId === id) setSelectedId(posts.find((post) => post.id !== id)?.id ?? "")
    try {
      const token = await getToken()
      await apiFetch(`/admin/blog-posts/${id}`, { method: "DELETE", token })
    } catch { /* keep optimistic removal */ }
  }

  const saveEditor = (data: BlogEditorData) => {
    if (!selected?.id) return
    patchPost(selected.id, { ...data, status: selected.status === "published" ? "published" : "draft" })
  }

  const publishEditor = (data: BlogEditorData) => {
    if (!selected?.id) return
    patchPost(selected.id, { ...data, status: "published", reviewNote: "Publikuar nga admin." })
  }

  const getPostActions = (post: BlogPost): AdminActionMenuItem[] => {
    const actions: AdminActionMenuItem[] = [
      { label: "Hap ne editor", onClick: () => setSelectedId(post.id) },
    ]

    if (post.status === "pending") {
      actions.push(
        { label: "Aprovo dhe publiko", onClick: () => patchPost(post.id, { status: "published", reviewNote: "Aprovuar nga admin." }) },
        { label: "Kthe ne draft", onClick: () => patchPost(post.id, { status: "draft", reviewNote: "Kerkohet editim para publikimit." }) },
        { label: "Refuzo", onClick: () => patchPost(post.id, { status: "rejected", reviewNote: "Refuzuar nga admin." }), destructive: true },
      )
    }

    if (post.status === "draft") {
      actions.push({ label: "Publiko", onClick: () => patchPost(post.id, { status: "published", reviewNote: "Publikuar nga draft." }) })
    }

    if (post.status === "published") {
      actions.push({ label: "Kthe ne draft", onClick: () => patchPost(post.id, { status: "draft", reviewNote: "U hoq nga publikimi per editim." }) })
    }

    if (post.status === "rejected") {
      actions.push({ label: "Rihap per review", onClick: () => patchPost(post.id, { status: "pending", reviewNote: "Rihapur per review." }) })
    }

    actions.push({ label: "Fshi postimin", onClick: () => removePost(post.id), destructive: true, divider: true, confirmLabel: "A je i sigurt qe do ta fshish kete blog?" })
    return actions
  }

  const filtered = posts.filter((post) => {
    const matchesStatus = status === "all" || post.status === status
    const matchesSearch = `${post.title} ${post.author} ${post.authorEmail} ${post.slug}`.toLowerCase().includes(query.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <AdminLayout
      sidebar={{ activeKey: "blog" }}
      header={{
        title: "Blog CMS",
        description: "Review, aprovim/refuzim dhe publikim i blogjeve nga userat dhe admini.",
        notificationCount: posts.filter((post) => post.status === "pending").length,
        actions: (
          <div className="flex gap-2">
            <Button variant="outline" onClick={load}>Rifresko</Button>
            <Button variant="outline" onClick={() => { router.push("/blog") }}>Shiko blogun</Button>
          </div>
        ),
        user: { name: "Unify Admin", role: "Internal" },
      }}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="Pending user blogs" value={`${posts.filter((post) => post.status === "pending").length}`} tone="warning" />
          <Stat label="Drafts" value={`${posts.filter((post) => post.status === "draft").length}`} tone="secondary" />
          <Stat label="Published" value={`${posts.filter((post) => post.status === "published").length}`} tone="success" />
          <Stat label="Rejected" value={`${posts.filter((post) => post.status === "rejected").length}`} tone="destructive" />
        </div>

        <AdminFilterBar
          searchValue={query}
          onSearchChange={setQuery}
          searchPlaceholder="Kerko titull, autor, email ose slug..."
          filters={[
            {
              key: "status",
              label: "Statusi",
              value: status,
              onChange: setStatus,
              options: [
                { label: "Te gjitha", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
                { label: "Rejected", value: "rejected" },
              ],
            },
          ]}
          actions={<Button onClick={createPost}>Blog i ri</Button>}
        />

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1fr_520px]">
          <AdminTable
            rows={filtered}
            getRowId={(row) => row.id}
            columns={[
              { key: "title", label: "Blogu", render: (row) => <button className="text-left" onClick={() => setSelectedId(row.id)}><p className="font-bold text-unify-brown">{row.title || "Pa titull"}</p><p className="text-xs text-muted-foreground">{row.slug || "pa-slug"}</p></button> },
              { key: "author", label: "Autori", render: (row) => <div><p>{row.author}</p><p className="text-xs text-muted-foreground">{row.authorEmail}</p></div> },
              { key: "source", label: "Burimi", render: (row) => <Badge variant={row.source === "user" ? "primary" : "secondary"}>{row.source}</Badge> },
              { key: "status", label: "Status", render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge> },
              { key: "submitted", label: "Derguar", render: (row) => row.submittedAt },
              { key: "actions", label: "", align: "right", render: (row) => <AdminActionMenu items={getPostActions(row)} /> },
            ]}
            empty={<p className="text-sm text-muted-foreground">Nuk ka blogje ne DB per keto filtra.</p>}
          />

          <div className="space-y-4">
            {selected != null ? (
              <>
                <Card>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusVariant[selected.status]}>{selected.status}</Badge>
                      <Badge variant={selected.source === "user" ? "primary" : "secondary"}>{selected.source}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Autor: <span className="font-medium text-unify-brown">{selected.author}</span> - {selected.authorEmail}
                    </p>
                    {selected.reviewNote && <p className="rounded-xl bg-muted/50 p-3 text-sm text-unify-brown">{selected.reviewNote}</p>}
                  </CardContent>
                </Card>
                <BlogEditor
                  key={selected.id}
                  initialData={selected}
                  onSave={saveEditor}
                  onPublish={publishEditor}
                />
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-sm text-muted-foreground">Zgjidh nje blog nga DB ose krijo nje te ri.</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "warning" | "secondary" | "success" | "destructive" }) {
  return (
    <Card>
      <CardContent className="p-5">
        <Badge variant={tone}>{label}</Badge>
        <p className="mt-3 font-display text-3xl text-unify-brown">{value}</p>
      </CardContent>
    </Card>
  )
}
