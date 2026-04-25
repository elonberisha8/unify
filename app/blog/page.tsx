// ============================================================
// BRANCH: feat/static-pages
// FIGMA:
//   Blog - Lista -> https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=88-397
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import Link from "next/link"
import { BlogCard, BlogSidebar } from "@/components/public"
import { PublicLayout } from "@/components/layout"
import { Badge, Button } from "@/components/ui"
import { ArrowRightIcon } from "@/components/icons"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../_lib/public-layout-config"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  tags: string[]
  createdAt: string
  author?: { name?: string | null }
}

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"

async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BASE}/api/blog`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

function readTime(content?: string | null) {
  if (!content) return "2 min"
  const words = content.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 180))} min`
}

export default async function BlogListPage() {
  const posts = await getPosts()
  const featuredPost = posts[0] ?? null
  const otherPosts = featuredPost ? posts.filter((post) => post.slug !== featuredPost.slug) : []
  const categories = Array.from(new Set(posts.flatMap((post) => post.tags.length ? post.tags : ["Blog"]))).map((label) => ({
    label,
    count: posts.filter((post) => post.tags.includes(label) || (!post.tags.length && label === "Blog")).length,
  }))
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 12)

  return (
    <PublicLayout navbar={PUBLIC_NAVBAR} footer={PUBLIC_FOOTER}>
      <section className="border-b border-border bg-unify-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <Badge variant="secondary" className="mb-4">
            Unify Blog
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="font-display text-4xl text-unify-brown md:text-5xl">
                Ide, udhezime dhe histori nga komuniteti yne.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Blogjet ketu vijne nga databaza: userat i dergojne, admini i aprovon, publiku i lexon.
              </p>
            </div>
            <div className="rounded-[28px] border border-border bg-white/80 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-unify-blue">Ne fokus</p>
              <h2 className="mt-3 font-display text-2xl text-unify-brown">Postimet e aprovuara se fundmi</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Nese nuk ka postime, nuk shfaqim mock data - lista mbetet bosh derisa admini te publikoje blogje.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {posts.length === 0 ? (
          <div className="rounded-[28px] border border-border bg-white p-10 text-center text-muted-foreground">
            Ende nuk ka blogje te publikuara ne DB.
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-8">
              {featuredPost && (
                <div>
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-unify-blue">Artikulli kryesor</p>
                  <Link href={`/blog/${featuredPost.slug}`} className="block">
                    <BlogCard
                      title={featuredPost.title}
                      excerpt={featuredPost.excerpt ?? ""}
                      imageUrl={featuredPost.coverImage ?? ""}
                      category={featuredPost.tags[0] ?? "Blog"}
                      author={featuredPost.author?.name ?? "Unify"}
                      publishedAt={new Date(featuredPost.createdAt).toLocaleDateString("sq-AL")}
                      readTime={readTime(featuredPost.excerpt)}
                      variant="featured"
                    />
                  </Link>
                </div>
              )}

              <div>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-unify-brown">Artikujt e fundit</h2>
                    <p className="text-sm text-muted-foreground">Te gjitha postimet e publikuara nga DB.</p>
                  </div>
                  <Button variant="ghost" className="hidden sm:inline-flex">Te gjitha temat</Button>
                </div>

                <div className="grid gap-6">
                  {otherPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                      <BlogCard
                        title={post.title}
                        excerpt={post.excerpt ?? ""}
                        imageUrl={post.coverImage ?? ""}
                        category={post.tags[0] ?? "Blog"}
                        author={post.author?.name ?? "Unify"}
                        publishedAt={new Date(post.createdAt).toLocaleDateString("sq-AL")}
                        readTime={readTime(post.excerpt)}
                        variant="horizontal"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <BlogSidebar
              recent={posts.slice(0, 4).map((post) => ({
                title: post.title,
                date: new Date(post.createdAt).toLocaleDateString("sq-AL"),
                image: post.coverImage ?? "",
                href: `/blog/${post.slug}`,
              }))}
              categories={categories}
              tags={tags}
            />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-[32px] border border-border bg-unify-brown px-6 py-10 text-white md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Per krijuesit dhe donatoret</p>
              <h2 className="mt-3 font-display text-3xl">Deshiron te shohesh edhe faqet kryesore te platformes?</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Shfleto kampanjat, lexo si funksionon Unify dhe zbulo si ndertohet besimi rreth nje kauze publike.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/shpalljet">
                  Shpalljet
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
