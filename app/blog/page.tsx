import Link from "next/link"
import { BlogCard, BlogSidebar } from "@/components/public"
import { PublicLayout } from "@/components/layout"
import { Badge, Button } from "@/components/ui"
import { ArrowRightIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../_lib/public-layout-config"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  tags: string[]
  createdAt: string
  author?: { name: string; email?: string; username?: string | null; image?: string | null }
}

async function getPublishedPosts() {
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

function readTime(post: BlogPost) {
  const words = `${post.title} ${post.excerpt ?? ""}`.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 180))} min`
}

function categoriesFromPosts(posts: BlogPost[]) {
  const counts = new Map<string, number>()
  for (const post of posts) {
    const firstTag = post.tags?.[0] || "Komunitet"
    counts.set(firstTag, (counts.get(firstTag) ?? 0) + 1)
  }
  return Array.from(counts.entries()).map(([label, count]) => ({ label, count }))
}

function tagsFromPosts(posts: BlogPost[]) {
  return Array.from(new Set(posts.flatMap((post) => post.tags ?? []))).slice(0, 12)
}

export default async function BlogListPage() {
  const posts = await getPublishedPosts()
  const featuredPost = posts[0]
  const otherPosts = featuredPost ? posts.filter((post) => post.slug !== featuredPost.slug) : []
  const categories = categoriesFromPosts(posts)
  const tags = tagsFromPosts(posts)

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="border-b border-border bg-unify-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
          <Badge variant="secondary" className="mb-4">
            Unify Blog
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="font-display text-4xl text-unify-brown md:text-5xl">
                Ide, udhëzime dhe histori nga komuniteti ynë.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Artikujt vijnë nga dashboard-i dhe shfaqen publikisht vetëm pasi aprovohen nga admini.
              </p>
            </div>
            <div className="rounded-[24px] border border-border bg-white/80 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-unify-blue">
                Në fokus
              </p>
              <h2 className="mt-3 font-display text-2xl text-unify-brown">
                Postimet e aprovuara
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Blogjet e reja që krijohen nga dashboard-i fillimisht shfaqen në admin si pending.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {posts.length === 0 ? (
          <div className="rounded-[24px] border border-border bg-white p-8">
            <h2 className="font-display text-2xl text-unify-brown">Ende nuk ka postime publike</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Blogjet e krijuara nga dashboard-i do të shfaqen këtu pasi admini i aprovon.
            </p>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-8">
              {featuredPost && (
                <div>
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-unify-blue">
                    Artikulli kryesor
                  </p>
                  <Link href={`/blog/${featuredPost.slug}`} className="block">
                    <BlogCard
                      title={featuredPost.title}
                      excerpt={featuredPost.excerpt ?? undefined}
                      imageUrl={featuredPost.coverImage ?? undefined}
                      category={featuredPost.tags?.[0] ?? "Blog"}
                      author={featuredPost.author?.name ?? "Unify"}
                      publishedAt={formatDate(featuredPost.createdAt)}
                      readTime={readTime(featuredPost)}
                      variant="featured"
                    />
                  </Link>
                </div>
              )}

              {otherPosts.length > 0 ? (
                <div>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-unify-brown">Artikujt e fundit</h2>
                      <p className="text-sm text-muted-foreground">
                        Përmbajtje e krijuar në dashboard dhe e publikuar pas aprovimit.
                      </p>
                    </div>
                    <Button variant="ghost" className="hidden sm:inline-flex">
                      Të gjitha temat
                    </Button>
                  </div>

                  <div className="grid gap-6">
                    {otherPosts.map((post) => (
                      <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                        <BlogCard
                          title={post.title}
                          excerpt={post.excerpt ?? undefined}
                          imageUrl={post.coverImage ?? undefined}
                          category={post.tags?.[0] ?? "Blog"}
                          author={post.author?.name ?? "Unify"}
                          publishedAt={formatDate(post.createdAt)}
                          readTime={readTime(post)}
                          variant="horizontal"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-border bg-white p-6">
                  <h2 className="font-display text-xl text-unify-brown">Më shumë artikuj së shpejti</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Për momentin ka vetëm një postim të aprovuar. Blogjet demo që krijuam do shfaqen këtu pasi t’i aprovosh nga admini.
                  </p>
                </div>
              )}
            </div>

            <BlogSidebar
              recent={posts.slice(0, 4).map((post) => ({
                title: post.title,
                date: formatDate(post.createdAt),
                image: post.coverImage ?? undefined,
                href: `/blog/${post.slug}`,
              }))}
              categories={categories}
              tags={tags}
            />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-[28px] border border-border bg-unify-brown px-6 py-10 text-white md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Për krijuesit
              </p>
              <h2 className="mt-3 font-display text-3xl">
                Dëshiron të krijosh një artikull?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Hyr në dashboard, shkruaj blogun dhe dërgoje për aprovim.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard/blog">
                  Krijo blog
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/25 text-white hover:bg-white/10">
                <Link href="/sherbimet">Si funksionon</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
