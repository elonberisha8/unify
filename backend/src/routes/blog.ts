import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// ─── SCHEMA ──────────────────────────────────────────────────────────────────

const CreateBlogSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug duhet të ketë vetëm shkronja të vogla, numra dhe -"),
  content: z.string().min(1),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().url().optional(),
});

const UpdateBlogSchema = CreateBlogSchema.partial();

const SubmitBlogSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(20),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string()).max(8).optional(),
});

function makeSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);
}

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// GET /api/blog — Artikujt e publikuar
router.get("/", async (_req, res: Response) => {
  try {
    const posts = await prisma.blog.findMany({
      where: { OR: [{ isPublished: true }, { status: "PUBLISHED" }] },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        createdAt: true,
        author: { select: { name: true, email: true, username: true, image: true } },
      },
    });
    res.json(posts);
  } catch {
    res.status(500).json({ error: "Gabim gjatë marrjes së artikujve" });
  }
});

// GET /api/blog/:slug — Një artikull i plotë
// POST /api/blog/submit - Useri i loguar dergon postim per aprovim
router.post("/submit", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = SubmitBlogSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const baseSlug = makeSlug(data.title) || "postim";
    const post = await prisma.blog.create({
      data: {
        title: data.title,
        slug: `${baseSlug}-${Date.now()}`,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        tags: data.tags ?? [],
        status: "PENDING",
        isPublished: false,
        authorId: user.id,
      },
    });

    res.status(201).json({
      ...post,
      message: "Postimi u dergua per aprovim nga admini.",
    });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    res.status(500).json({ error: "Gabim gjate dergimit te postimit" });
  }
});

// GET /api/blog/my - Blogjet e userit te loguar
router.get("/my", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const posts = await prisma.blog.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ posts });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/blog/my/:id - Edito draft/pending te userit
router.patch("/my/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const post = await prisma.blog.findUnique({ where: { id: req.params.id } });
    if (!post || post.authorId !== user.id) {
      res.status(403).json({ error: "Pa leje" });
      return;
    }

    const data = UpdateBlogSchema.pick({
      title: true,
      content: true,
      excerpt: true,
      coverImage: true,
    }).parse(req.body);

    const updated = await prisma.blog.update({
      where: { id: req.params.id },
      data: {
        ...data,
        status: post.status === "PUBLISHED" ? "PENDING" : post.status,
        isPublished: post.status === "PUBLISHED" ? false : post.isPublished,
      },
    });

    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    res.status(500).json({ error: "Gabim" });
  }
});

// DELETE /api/blog/my/:id - Fshi blogun e userit nese eshte i tij
router.delete("/my/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const post = await prisma.blog.findUnique({ where: { id: req.params.id } });
    if (!post || post.authorId !== user.id) {
      res.status(403).json({ error: "Pa leje" });
      return;
    }

    await prisma.blog.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

router.get("/:slug", async (req, res: Response) => {
  try {
    const post = await prisma.blog.findFirst({
      where: { slug: req.params.slug, OR: [{ isPublished: true }, { status: "PUBLISHED" }] },
      include: { author: { select: { name: true, email: true, username: true, image: true } } },
    });
    if (!post) {
      res.status(404).json({ error: "Artikulli nuk u gjet" });
      return;
    }
    res.json(post);
  } catch {
    res.status(500).json({ error: "Gabim gjatë marrjes së artikullit" });
  }
});

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// POST /api/admin/blog — Krijo artikull të ri
router.post("/admin", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = CreateBlogSchema.parse(req.body);

    // Kontrollo nëse slug ekziston
    const existing = await prisma.blog.findUnique({ where: { slug: data.slug } });
    if (existing) {
      res.status(400).json({ error: "Slug ekziston tashmë" });
      return;
    }

    const post = await prisma.blog.create({ data });
    res.status(201).json(post);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    res.status(500).json({ error: "Gabim gjatë krijimit të artikullit" });
  }
});

// PUT /api/admin/blog/:id — Edito artikull
router.put("/admin/:id", requireAuth, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = UpdateBlogSchema.parse(req.body);

    // Nëse ndryshon slug, kontrollo duplikatin
    if (data.slug) {
      const existing = await prisma.blog.findFirst({
        where: { slug: data.slug, NOT: { id: req.params.id } },
      });
      if (existing) {
        res.status(400).json({ error: "Slug ekziston tashmë" });
        return;
      }
    }

    const post = await prisma.blog.update({
      where: { id: req.params.id },
      data,
    });
    res.json(post);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    res.status(500).json({ error: "Gabim gjatë editimit të artikullit" });
  }
});

// PATCH /api/admin/blog/:id/publish — Publiko ose çpubliko
router.patch("/admin/:id/publish", requireAuth, requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const post = await prisma.blog.findUnique({ where: { id: _req.params.id } });
    if (!post) {
      res.status(404).json({ error: "Artikulli nuk u gjet" });
      return;
    }

    const updated = await prisma.blog.update({
      where: { id: _req.params.id },
      data: { isPublished: !post.isPublished },
    });
    res.json({ isPublished: updated.isPublished });
  } catch {
    res.status(500).json({ error: "Gabim gjatë ndryshimit të statusit" });
  }
});

// DELETE /api/admin/blog/:id — Fshi artikull
router.delete("/admin/:id", requireAuth, requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.blog.delete({ where: { id: _req.params.id } });
    res.json({ deleted: true });
  } catch {
    res.status(500).json({ error: "Gabim gjatë fshirjes së artikullit" });
  }
});

export default router;
