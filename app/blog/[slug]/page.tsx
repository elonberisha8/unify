import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogCard, BlogSidebar } from "@/components/public"
import { PublicLayout } from "@/components/layout"
import { Badge, Button } from "@/components/ui"
import { ArrowLeftIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../../_lib/public-layout-config"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"

type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  tags: string[]
  createdAt: string
  author?: { name: string; email?: string; username?: string | null; image?: string | null }
}

async function getPost(slug: string) {
  try {
    const res = await fetch(`${BACKEND}/api/blog/${encodeURIComponent(slug)}`, { cache: "no-store" })
    if (res.status === 404) return null
    if (!res.ok) return null
    return (await res.json()) as BlogPost
  } catch {
    return null
  }
}

async function getRecentPosts() {
  try {
    const res = await fetch(`${BACKEND}/api/blog`, { cache: "no-store" })
    if (!res.ok) return []
    return (await res.json()) as BlogPost[]
  } catch {
    return []
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" })
}

function readTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 180))} min`
}

function splitContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const recentPosts = await getRecentPosts()
  const relatedPosts = recentPosts.filter((item) => item.slug !== post.slug).slice(0, 3)
  const paragraphs = splitContent(post.content)

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

            <Badge variant="secondary">{post.tags?.[0] ?? "Blog"}</Badge>
            <h1 className="mt-4 font-display text-4xl text-unify-brown md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{post.excerpt}</p>}

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="font-semibold text-unify-brown">{post.author?.name ?? "Unify"}</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>{readTime(post.content)} lexim</span>
            </div>

            {post.coverImage && (
              <div
                className="mt-8 h-[280px] rounded-[32px] bg-cover bg-center md:h-[420px]"
                style={{ backgroundImage: `url(${post.coverImage})` }}
              />
            )}

            <div className="mt-10 space-y-4">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-8 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>

            {post.tags?.length > 0 && (
              <div className="mt-10 rounded-[28px] border border-border bg-unify-cream p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-unify-blue">
                  Etiketat
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-unify-brown"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <section className="mt-12">
                <div className="mb-6">
                  <h2 className="font-display text-2xl text-unify-brown">Lexo edhe</h2>
                  <p className="text-sm text-muted-foreground">
                    Artikuj të tjerë nga blogu publik.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {relatedPosts.map((item) => (
                    <Link key={item.slug} href={`/blog/${item.slug}`} className="block">
                      <BlogCard
                        title={item.title}
                        excerpt={item.excerpt ?? undefined}
                        imageUrl={item.coverImage ?? undefined}
                        category={item.tags?.[0] ?? "Blog"}
                        author={item.author?.name ?? "Unify"}
                        publishedAt={formatDate(item.createdAt)}
                        readTime={readTime(item.content ?? item.excerpt ?? item.title)}
                      />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <BlogSidebar
            recent={recentPosts.slice(0, 4).map((item) => ({
              title: item.title,
              date: formatDate(item.createdAt),
              image: item.coverImage ?? undefined,
              href: `/blog/${item.slug}`,
            }))}
            categories={Array.from(new Set(recentPosts.map((item) => item.tags?.[0] ?? "Blog"))).map((label) => ({
              label,
              count: recentPosts.filter((item) => (item.tags?.[0] ?? "Blog") === label).length,
            }))}
            tags={Array.from(new Set(recentPosts.flatMap((item) => item.tags ?? []))).slice(0, 12)}
          />
        </div>
      </article>
    </PublicLayout>
  )
}
