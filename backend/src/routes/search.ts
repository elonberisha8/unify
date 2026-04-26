import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// GET /api/search?q=kerkimi
router.get("/", async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string)?.trim();

    if (!q || q.length < 2) {
      res.status(400).json({ error: "Kërkimi duhet të ketë të paktën 2 karaktere" });
      return;
    }

    const [campaigns, users] = await Promise.all([
      prisma.campaign.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { shortDescription: { contains: q, mode: "insensitive" } },
            { location: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          images: true,
          location: true,
          currentAmount: true,
          targetAmount: true,
        },
        take: 10,
        orderBy: { isFeatured: "desc" },
      }),

      prisma.user.findMany({
        where: {
          isBanned: false,
          privacyProfilePublic: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { username: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          isVerified: true,
        },
        take: 10,
      }),
    ]);

    res.json({
      campaigns: campaigns.map((c) => ({
        ...c,
        image: c.images[0] ?? null,
      })),
      users,
    });
  } catch {
    res.status(500).json({ error: "Gabim gjatë kërkimit" });
  }
});

export default router;
