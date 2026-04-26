import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/users/username/:username/available - Kontrollo nese username eshte unik
router.get("/username/:username/available", async (req, res: Response) => {
  try {
    const username = String(req.params.username || "").trim().toLowerCase();
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      res.status(400).json({
        available: false,
        error: "Username duhet te kete 3-30 karaktere dhe vetem shkronja, numra ose _",
      });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    res.json({ available: !existing });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
  bio: z.string().max(200).optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  image: z.string().url().optional(),
  privacyProfilePublic: z.boolean().optional(),
  privacyCampaignsPublic: z.boolean().optional(),
  privacyDonationsPublic: z.boolean().optional(),
  privacyVolunteerPublic: z.boolean().optional(),
});

// POST /api/users/sync — Sinkronizo userin nga Clerk (thirret pas login/regjistrim)
router.post("/sync", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, image, username } = req.body;
    const normalizedUsername = typeof username === "string" && username.trim()
      ? username.trim().toLowerCase()
      : undefined;

    if (normalizedUsername && !/^[a-zA-Z0-9_]{3,30}$/.test(normalizedUsername)) {
      res.status(400).json({ error: "Username invalid" });
      return;
    }

    const user = await prisma.user.upsert({
      where: { clerkId: req.userId! },
      create: {
        clerkId: req.userId!,
        name: name || "Anëtar",
        email,
        image,
        username: normalizedUsername,
      },
      update: {
        name: name || undefined,
        image: image || undefined,
        username: normalizedUsername,
      },
    });

    res.json(user);
  } catch {
    res.status(500).json({ error: "Gabim gjatë sinkronizimit" });
  }
});

// GET /api/users/me — Profili im
router.get("/me", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: req.userId },
      include: {
        _count: {
          select: {
            campaigns: true,
            donations: true,
            volunteerListings: true,
          },
        },
      },
    });

    if (!user) { res.status(404).json({ error: "Përdoruesi nuk u gjet" }); return; }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PUT /api/users/me — Edito profilin tim
router.put("/me", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = UpdateProfileSchema.parse(req.body);

    // Kontrollo nëse username është marrë
    if (data.username) {
      const existing = await prisma.user.findFirst({
        where: { username: data.username, NOT: { clerkId: req.userId } },
      });
      if (existing) {
        res.status(400).json({ error: "Ky username është i zënë" });
        return;
      }
    }

    const user = await prisma.user.update({
      where: { clerkId: req.userId },
      data,
    });

    res.json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/users/search?q=... — Live search për @username (Inbox + groupies)
router.get("/search", async (req, res: Response) => {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();
    if (!q) { res.json([]); return; }

    const results = await prisma.user.findMany({
      where: {
        AND: [
          { isBanned: false },
          {
            OR: [
              { username: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        isVerified: true,
      },
      orderBy: [{ username: "asc" }],
      take: 12,
    });

    // Filtro ata pa username — ata nuk mund të mesazhojnë
    res.json(results.filter((u) => Boolean(u.username)));
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/users/:username — Profili publik
router.get("/:username", async (req, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: { username: req.params.username, privacyProfilePublic: true },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        location: true,
        isVerified: true,
        createdAt: true,
        privacyCampaignsPublic: true,
        privacyDonationsPublic: true,
        privacyVolunteerPublic: true,
        _count: { select: { campaigns: true, donations: true, volunteerListings: true } },
        campaigns: {
          where: { status: "ACTIVE" },
          select: { id: true, title: true, slug: true, images: true, currentAmount: true, targetAmount: true },
          take: 6,
        },
      },
    });

    if (!user) { res.status(404).json({ error: "Profili nuk u gjet" }); return; }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/users/bookmark/:campaignId/check — A është bookmark-uar?
router.get("/bookmark/:campaignId/check", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.json({ bookmarked: false }); return; }
    const exists = await prisma.bookmark.findFirst({
      where: { userId: user.id, campaignId: req.params.campaignId },
    });
    res.json({ bookmarked: Boolean(exists) });
  } catch {
    res.json({ bookmarked: false });
  }
});

// POST /api/users/bookmark/:campaignId — Ruaj/hiq bookmark
router.post("/bookmark/:campaignId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Përdoruesi nuk u gjet" }); return; }

    const existing = await prisma.bookmark.findFirst({
      where: { userId: user.id, campaignId: req.params.campaignId },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      res.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: { userId: user.id, campaignId: req.params.campaignId },
      });
      res.json({ bookmarked: true });
    }
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/users/bookmarks — Të ruajtura
router.get("/me/bookmarks", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Përdoruesi nuk u gjet" }); return; }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        campaign: {
          include: {
            creator: { select: { id: true, name: true, image: true } },
            _count: { select: { donations: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookmarks);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// POST /api/users/set-verified — Thirret nga webhook Stripe Identity
router.post("/set-verified", async (req, res: Response) => {
  const secret = req.headers["x-webhook-secret"];
  if (secret !== (process.env.WEBHOOK_INTERNAL_SECRET ?? "unify-internal")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { clerkId } = req.body;
  if (!clerkId) { res.status(400).json({ error: "clerkId mungon" }); return; }

  try {
    await prisma.user.update({
      where: { clerkId },
      data: { isVerified: true },
    });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

export default router;
