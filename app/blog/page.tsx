// ============================================================
// BRANCH: feat/static-pages
// FIGMA:
//   • Blog — Lista → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=88-397
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import Link from "next/link"
import { BlogCard, BlogSidebar } from "@/components/public"
import { PublicLayout } from "@/components/layout"
import { Badge, Button } from "@/components/ui"
import { ArrowRightIcon } from "@/components/icons"
import { BLOG_CATEGORIES, BLOG_POSTS, BLOG_TAGS } from "../_lib/blog-data"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../_lib/public-layout-config"

const FEATURED_POST = BLOG_POSTS.find((post) => post.featured) ?? BLOG_POSTS[0]
const OTHER_POSTS = BLOG_POSTS.filter((post) => post.slug !== FEATURED_POST.slug)

export default function BlogListPage() {
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
                Ide, udhëzime dhe histori nga komuniteti ynë.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Këtu ndajmë këshilla praktike për krijuesit, donatorët dhe të gjithë
                ata që duan të ndërtojnë më shumë besim rreth kauzave publike.
              </p>
            </div>
            <div className="rounded-[28px] border border-border bg-white/80 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-unify-blue">
                Në fokus
              </p>
              <h2 className="mt-3 font-display text-2xl text-unify-brown">
                Tema që po i lexojnë më së shumti këtë javë
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Përmbajtje që ndihmon ekipet, familjet dhe komunitetet të prezantojnë
                kauza serioze në mënyrë të qartë, të sigurt dhe të besueshme.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-8">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-unify-blue">
                Artikulli kryesor
              </p>
              <Link href={`/blog/${FEATURED_POST.slug}`} className="block">
                <BlogCard
                  title={FEATURED_POST.title}
                  excerpt={FEATURED_POST.excerpt}
                  imageUrl={FEATURED_POST.imageUrl}
                  category={FEATURED_POST.category}
                  author={FEATURED_POST.author}
                  publishedAt={FEATURED_POST.publishedAt}
                  readTime={FEATURED_POST.readTime}
                  variant="featured"
                />
              </Link>
            </div>

            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-unify-brown">Artikujt e fundit</h2>
                  <p className="text-sm text-muted-foreground">
                    Përmbajtje e shkurtër, praktike dhe e dobishme për publikun.
                  </p>
                </div>
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Të gjitha temat
                </Button>
              </div>

              <div className="grid gap-6">
                {OTHER_POSTS.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                    <BlogCard
                      title={post.title}
                      excerpt={post.excerpt}
                      imageUrl={post.imageUrl}
                      category={post.category}
                      author={post.author}
                      publishedAt={post.publishedAt}
                      readTime={post.readTime}
                      variant="horizontal"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <BlogSidebar
            recent={BLOG_POSTS.slice(0, 4).map((post) => ({
              title: post.title,
              date: post.publishedAt,
              image: post.imageUrl,
              href: `/blog/${post.slug}`,
            }))}
            categories={BLOG_CATEGORIES}
            tags={BLOG_TAGS}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-[32px] border border-border bg-unify-brown px-6 py-10 text-white md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Për krijuesit dhe donatorët
              </p>
              <h2 className="mt-3 font-display text-3xl">
                Dëshiron të shohësh edhe faqet kryesore të platformës?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                Shfleto kampanjat, lexo si funksionon Unify dhe zbulo si ndërtohet
                besimi rreth një kauze publike.
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
