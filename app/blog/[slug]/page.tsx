// ============================================================
// BRANCH: feat/static-pages
// FIGMA:
//   • Blog — Artikull → https://www.figma.com/design/1OT7I2MkWFD2ClFkMGkQt7/Unify-Platform-Design?node-id=74-2
// NOTION: https://www.notion.so/34874891227e8130855afa1edb64a28b
// ============================================================

import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogCard, BlogSidebar } from "@/components/public"
import { PublicLayout } from "@/components/layout"
import { Badge, Button } from "@/components/ui"
import { ArrowLeftIcon } from "@/components/icons"
import { BLOG_CATEGORIES, BLOG_POSTS, BLOG_TAGS, getBlogPostBySlug } from "../../_lib/blog-data"
import { PUBLIC_FOOTER, PUBLIC_NAVBAR } from "../../_lib/public-layout-config"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3)

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

            <Badge variant="secondary">{post.category}</Badge>
            <h1 className="mt-4 font-display text-4xl text-unify-brown md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{post.excerpt}</p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="font-semibold text-unify-brown">{post.author}</span>
              <span>{post.publishedAt}</span>
              <span>{post.readTime} lexim</span>
            </div>

            <div
              className="mt-8 h-[280px] rounded-[32px] bg-cover bg-center md:h-[420px]"
              style={{ backgroundImage: `url(${post.imageUrl})` }}
            />

            <div className="mt-10 space-y-8">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-display text-2xl text-unify-brown">{section.heading}</h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="leading-8 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

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

            <section className="mt-12">
              <div className="mb-6">
                <h2 className="font-display text-2xl text-unify-brown">Lexo edhe</h2>
                <p className="text-sm text-muted-foreground">
                  Artikuj të tjerë nga tema të ngjashme.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {relatedPosts.map((item) => (
                  <Link key={item.slug} href={`/blog/${item.slug}`} className="block">
                    <BlogCard
                      title={item.title}
                      excerpt={item.excerpt}
                      imageUrl={item.imageUrl}
                      category={item.category}
                      author={item.author}
                      publishedAt={item.publishedAt}
                      readTime={item.readTime}
                    />
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <BlogSidebar
            recent={BLOG_POSTS.slice(0, 4).map((item) => ({
              title: item.title,
              date: item.publishedAt,
              image: item.imageUrl,
              href: `/blog/${item.slug}`,
            }))}
            categories={BLOG_CATEGORIES}
            tags={BLOG_TAGS}
          />
        </div>
      </article>
    </PublicLayout>
  )
}
