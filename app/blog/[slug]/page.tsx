// ============================================================
// BRANCH: feat/static-pages
// FIGMA:
//   Blog - Artikull -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=74-2
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogCard, BlogSidebar } from "@/components/public"
import { PublicLayout } from "@/components/layout"
import { Badge, Button } from "@/components/ui"
import { ArrowLeftIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../../_lib/public-layout-config"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  tags: string[]
  createdAt: string
  author?: { name?: string | null }
}

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}/api${path}`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function paragraphs(content: string) {
  return content.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)
}

function readTime(content: string) {
  const words = content.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 180))} min`
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchJson<BlogPost>(`/blog/${params.slug}`)

  if (!post) {
    notFound()
  }

  const posts = await fetchJson<BlogPost[]>("/blog") ?? []
  const relatedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3)
  const categories = Array.from(new Set(posts.flatMap((item) => item.tags.length ? item.tags : ["Blog"]))).map((label) => ({
    label,
    count: posts.filter((item) => item.tags.includes(label) || (!item.tags.length && label === "Blog")).length,
  }))
  const tags = Array.from(new Set(posts.flatMap((item) => item.tags))).slice(0, 12)

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <article className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.75fr]">
          <div>
            <Button asChild variant="ghost" className="mb-6 pl-0 text-muted-foreground">
              <Link href="/blog">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Kthehu te blogu
              </Link>
            </Button>

            <Badge variant="secondary">{post.tags[0] ?? "Blog"}</Badge>
            <h1 className="mt-4 font-display text-4xl text-unify-brown md:text-5xl">{post.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{post.excerpt}</p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="font-semibold text-unify-brown">{post.author?.name ?? "Unify"}</span>
              <span>{new Date(post.createdAt).toLocaleDateString("sq-AL")}</span>
              <span>{readTime(post.content)} lexim</span>
            </div>

            {post.coverImage && (
              <div
                className="mt-8 h-[280px] rounded-[32px] bg-cover bg-center md:h-[420px]"
                style={{ backgroundImage: `url(${post.coverImage})` }}
              />
            )}

            <div className="mt-10 space-y-5">
              {paragraphs(post.content).map((paragraph) => (
                <p key={paragraph} className="leading-8 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 rounded-[28px] border border-border bg-unify-cream p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-unify-blue">Etiketat</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(post.tags.length ? post.tags : ["Blog"]).map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-unify-brown">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <section className="mt-12">
                <div className="mb-6">
                  <h2 className="font-display text-2xl text-unify-brown">Lexo edhe</h2>
                  <p className="text-sm text-muted-foreground">Artikuj te tjere nga DB.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {relatedPosts.map((item) => (
                    <Link key={item.slug} href={`/blog/${item.slug}`} className="block">
                      <BlogCard
                        title={item.title}
                        excerpt={item.excerpt ?? ""}
                        imageUrl={item.coverImage ?? ""}
                        category={item.tags[0] ?? "Blog"}
                        author={item.author?.name ?? "Unify"}
                        publishedAt={new Date(item.createdAt).toLocaleDateString("sq-AL")}
                        readTime={readTime(item.content)}
                      />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <BlogSidebar
            recent={posts.slice(0, 4).map((item) => ({
              title: item.title,
              date: new Date(item.createdAt).toLocaleDateString("sq-AL"),
              image: item.coverImage ?? "",
              href: `/blog/${item.slug}`,
            }))}
            categories={categories}
            tags={tags}
          />
        </div>
      </article>
    </PublicLayout>
  )
}
