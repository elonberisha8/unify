import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, optionalAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const CAMPAIGN_CATEGORIES = new Set([
  "MEDICAL",
  "EDUCATION",
  "EMERGENCY",
  "COMMUNITY",
  "SPORTS",
  "ENVIRONMENT",
  "ANIMALS",
  "TECHNOLOGY",
  "CREATIVE",
  "OTHER",
]);

const CAMPAIGN_SORTS = new Set(["urgent", "newest", "almostDone", "mostFunded"]);

const CreateCampaignSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(50),
  shortDescription: z.string().max(200).optional(),
  images: z.array(z.string().url()).max(5).default([]),
  targetAmount: z.number().min(50),
  category: z.enum([
    "MEDICAL", "EDUCATION", "EMERGENCY", "COMMUNITY",
    "SPORTS", "ENVIRONMENT", "ANIMALS", "TECHNOLOGY", "CREATIVE", "OTHER",
  ]),
  location: z.string().min(1),
  isUrgent: z.boolean().default(false),
  endsAt: z.string().datetime().optional(),
  problemStatement: z.string().optional(),
  targetGroup: z.string().optional(),
  urgency: z.number().int().min(1).max(10).optional(),
  videoUrl: z.string().optional(),
  breakdown: z.array(z.record(z.unknown())).default([]),
  budgetItems: z.array(z.record(z.unknown())).default([]),
  tipPercent: z.number().optional(),
  faqs: z.array(z.record(z.unknown())).default([]),
  supportingDocs: z.array(z.string()).default([]),
  partners: z.string().optional(),
  verificationPlan: z.string().optional(),
  expectedOutcome: z.string().optional(),
  milestones: z
    .array(
      z.object({
        title: z.string().optional(),
        name: z.string().optional(),
        amount: z.number().optional(),
        target: z.union([z.string(), z.number()]).optional(),
        description: z.string().optional(),
        deadline: z.string().optional(),
      })
    )
    .optional(),
});

function firstQueryValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

function cleanString(value: unknown) {
  const raw = firstQueryValue(value);
  return typeof raw === "string" ? raw.trim() : "";
}

function cleanPage(value: unknown) {
  const parsed = Number.parseInt(cleanString(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function cleanLimit(value: unknown, fallback = 12) {
  const parsed = Number.parseInt(cleanString(value), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, 48);
}

function cleanCampaignCategory(value: unknown) {
  const raw = cleanString(value);
  if (!raw || raw === "all") return null;
  const normalized = raw.toUpperCase();
  return CAMPAIGN_CATEGORIES.has(normalized) ? normalized : "__INVALID__";
}

function cleanSort(value: unknown) {
  const raw = cleanString(value);
  return CAMPAIGN_SORTS.has(raw) ? raw : "urgent";
}

function campaignOrderBy(sort: string) {
  if (sort === "newest") return [{ createdAt: "desc" }];
  if (sort === "mostFunded") return [{ currentAmount: "desc" }, { createdAt: "desc" }];
  if (sort === "almostDone") return [{ currentAmount: "desc" }, { isUrgent: "desc" }, { createdAt: "desc" }];
  return [{ isUrgent: "desc" }, { isFeatured: "desc" }, { endsAt: "asc" }, { createdAt: "desc" }];
}

function normalizeOptionalString(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeMilestones(milestones: z.infer<typeof CreateCampaignSchema>["milestones"]) {
  return (milestones ?? [])
    .map((milestone) => {
      const title = normalizeOptionalString(milestone.title) ?? normalizeOptionalString(milestone.name);
      const amount =
        typeof milestone.amount === "number"
          ? milestone.amount
          : Number.parseFloat(String(milestone.target ?? "0"));
      if (!title || !Number.isFinite(amount) || amount <= 0) return null;

      return {
        title,
        amount,
        description: normalizeOptionalString(milestone.description) ?? normalizeOptionalString(milestone.deadline),
      };
    })
    .filter((item): item is { title: string; amount: number; description: string | undefined } => Boolean(item));
}

// GET /api/campaigns — Listo të gjitha kampanjat aktive
router.get("/", optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, location, urgent, featured, search, page, limit, sort } = req.query;
    const cleanCategory = cleanCampaignCategory(category);
    const cleanLocation = cleanString(location);
    const cleanSearch = cleanString(search);
    const cleanFeatured = cleanString(featured);
    const cleanUrgent = cleanString(urgent);
    const cleanPageNumber = cleanPage(page);
    const cleanLimitNumber = cleanLimit(limit, 12);
    const cleanSortKey = cleanSort(sort);

    if (cleanCategory === "__INVALID__") {
      res.json({ campaigns: [], total: 0, page: cleanPageNumber, limit: cleanLimitNumber });
      return;
    }

    const where: Record<string, unknown> = { status: "ACTIVE" };
    if (cleanCategory) where.category = cleanCategory;
    if (cleanLocation && cleanLocation !== "all") where.location = cleanLocation;
    if (cleanUrgent === "true") where.isUrgent = true;
    if (cleanFeatured === "true") where.isFeatured = true;
    if (cleanSearch) {
      where.OR = [
        { title: { contains: cleanSearch, mode: "insensitive" } },
        { description: { contains: cleanSearch, mode: "insensitive" } },
      ];
    }

    const skip = (cleanPageNumber - 1) * cleanLimitNumber;
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          creator: { select: { id: true, name: true, image: true, isVerified: true, username: true } },
          donations: { where: { status: "SUCCEEDED" }, select: { amount: true } },
          _count: { select: { donations: { where: { status: "SUCCEEDED" } } } },
        },
        orderBy: campaignOrderBy(cleanSortKey) as never,
        skip,
        take: cleanLimitNumber,
      }),
      prisma.campaign.count({ where }),
    ]);

    const campaignsWithRealAmounts = campaigns.map((c) => {
      const realAmount = c.donations.reduce((sum, d) => sum + d.amount, 0);
      const { donations, ...rest } = c;
      return { ...rest, currentAmount: realAmount };
    });

    res.json({ campaigns: campaignsWithRealAmounts, total, page: cleanPageNumber, limit: cleanLimitNumber });
  } catch (err) {
    res.status(500).json({ error: "Gabim gjatë marrjes së kampanjave" });
  }
});

// GET /api/campaigns/:slug — Merr kampanjën me slug
// GET /api/campaigns/my - Kampanjat e userit te loguar
router.get("/my", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const campaigns = await prisma.campaign.findMany({
      where: { creatorId: user.id },
      include: {
        creator: { select: { id: true, name: true, email: true, image: true, isVerified: true, username: true } },
        donations: {
          where: { status: "SUCCEEDED" },
          include: { donor: { select: { id: true, name: true, image: true, username: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { donations: { where: { status: "SUCCEEDED" } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const campaignsWithRealAmounts = campaigns.map((c) => ({
      ...c,
      currentAmount: c.donations.reduce((sum, d) => sum + d.amount, 0),
    }));

    res.json({ campaigns: campaignsWithRealAmounts });
  } catch {
    res.status(500).json({ error: "Gabim gjate marrjes se kampanjave" });
  }
});

router.get("/:slug", optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const slug = cleanString(req.params.slug);
    const [campaign, donationSum, donorCount] = await Promise.all([
      prisma.campaign.findUnique({
        where: { slug },
        include: {
          creator: { select: { id: true, name: true, image: true, isVerified: true, username: true } },
          donations: {
            where: { status: "SUCCEEDED" },
            orderBy: { createdAt: "desc" },
            take: 50,
            include: { donor: { select: { id: true, name: true, image: true, username: true } } },
          },
          milestones: { orderBy: { amount: "asc" } },
          updates: { orderBy: { createdAt: "desc" } },
          comments: {
            orderBy: { createdAt: "desc" },
            include: { author: { select: { id: true, name: true, image: true, username: true } } },
          },
          _count: { select: { donations: true } },
        },
      }),
      prisma.donation.aggregate({
        where: { campaign: { slug }, status: "SUCCEEDED" },
        _sum: { amount: true },
      }),
      prisma.donation.count({
        where: { campaign: { slug }, status: "SUCCEEDED" },
      }),
    ]);

    if (!campaign) {
      res.status(404).json({ error: "Kampanja nuk u gjet" });
      return;
    }
    if (campaign.status !== "ACTIVE") {
      res.status(404).json({ error: "Kampanja nuk u gjet" });
      return;
    }

    // currentAmount gjithmonë = shumë reale e donacioneve të SUCCEEDED
    const realCurrentAmount = donationSum._sum?.amount ?? 0;

    // Sinkronizo DB nëse ka diferencë (async, pa e bllokuar përgjigjen)
    if (realCurrentAmount !== campaign.currentAmount) {
      prisma.campaign.update({
        where: { id: campaign.id },
        data: { currentAmount: realCurrentAmount },
      }).catch(() => null);
    }

    res.json({
      ...campaign,
      currentAmount: realCurrentAmount,
      _count: { ...campaign._count, donations: donorCount },
    });
  } catch {
    res.status(500).json({ error: "Gabim gjatë marrjes së kampanjës" });
  }
});

// POST /api/campaigns — Krijo kampanjë të re
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = CreateCampaignSchema.parse(req.body);
    const milestones = normalizeMilestones(data.milestones);

    // Kontrollo nëse useri ekziston — nëse jo, krijo automatikisht
    let user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) {
      res.status(404).json({ error: "Përdoruesi nuk u gjet. Kryej onboarding së pari." });
      return;
    }

    // Gjenero slug unik
    const baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    const slug = `${baseSlug}-${Date.now()}`;

    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        images: data.images,
        targetAmount: data.targetAmount,
        category: data.category,
        location: data.location,
        isUrgent: data.isUrgent,
        endsAt: data.endsAt,
        problemStatement: normalizeOptionalString(data.problemStatement),
        targetGroup: normalizeOptionalString(data.targetGroup),
        urgency: data.urgency,
        videoUrl: normalizeOptionalString(data.videoUrl),
        budgetBreakdown: data.breakdown.length ? data.breakdown : undefined,
        budgetItems: data.budgetItems.length ? data.budgetItems : undefined,
        faqs: data.faqs.length ? data.faqs : undefined,
        supportingDocs: data.supportingDocs,
        partners: normalizeOptionalString(data.partners),
        verificationPlan: normalizeOptionalString(data.verificationPlan),
        expectedOutcome: normalizeOptionalString(data.expectedOutcome),
        tipPercent: data.tipPercent,
        slug,
        creatorId: user.id,
        status: "PENDING",
        milestones: milestones.length
          ? { create: milestones }
          : undefined,
      },
    });

    res.status(201).json(campaign);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      res.status(400).json({ error: `Validim dështoi: ${messages}` });
      return;
    }
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Campaign create error:", errMsg);
    res.status(500).json({ error: `Gabim: ${errMsg}` });
  }
});

// PUT /api/campaigns/:id — Edito kampanjë
router.put("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id } });
    if (!campaign) { res.status(404).json({ error: "Kampanja nuk u gjet" }); return; }

    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user || campaign.creatorId !== user.id) {
      res.status(403).json({ error: "Pa leje" });
      return;
    }

    const updated = await prisma.campaign.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gabim gjatë editimit" });
  }
});

// POST /api/campaigns/:id/updates — Shto update te kampanja
router.post("/:id/updates", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, image } = req.body;
    const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id } });
    if (!campaign) { res.status(404).json({ error: "Kampanja nuk u gjet" }); return; }

    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user || campaign.creatorId !== user.id) {
      res.status(403).json({ error: "Pa leje" });
      return;
    }

    const update = await prisma.campaignUpdate.create({
      data: { title, content, image, campaignId: req.params.id },
    });

    res.status(201).json(update);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// POST /api/campaigns/:id/comments — Shto koment
router.post("/:id/comments", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) { res.status(400).json({ error: "Komenti nuk mund të jetë bosh" }); return; }

    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Përdoruesi nuk u gjet" }); return; }

    const comment = await prisma.comment.create({
      data: { content, authorId: user.id, campaignId: req.params.id },
      include: { author: { select: { id: true, name: true, image: true, username: true } } },
    });

    res.status(201).json(comment);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/campaigns/:id/comments — Lista publike e komenteve
router.get("/:id/comments", async (req, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { campaignId: req.params.id },
      include: { author: { select: { id: true, name: true, image: true, username: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/campaigns/:id/donors — Donor Wall (10 të fundit + 10 më të mëdhenj)
router.get("/:id/donors", async (req, res: Response) => {
  try {
    const id = req.params.id;
    const [recent, top] = await Promise.all([
      prisma.donation.findMany({
        where: { campaignId: id, status: "SUCCEEDED" },
        include: { donor: { select: { id: true, name: true, image: true, username: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.donation.findMany({
        where: { campaignId: id, status: "SUCCEEDED" },
        include: { donor: { select: { id: true, name: true, image: true, username: true } } },
        orderBy: { amount: "desc" },
        take: 10,
      }),
    ]);

    function mapDonation(d: typeof recent[0]) {
      return {
        id: d.id,
        amount: d.amount,
        message: d.message,
        createdAt: d.createdAt.toISOString(),
        anonymous: d.isAnonymous,
        guestName: d.guestName,
        donor: d.isAnonymous ? null : d.donor ? {
          id: d.donor.id,
          name: d.donor.name,
          username: d.donor.username,
          image: d.donor.image,
        } : null,
      };
    }

    res.json({
      recent: recent.map(mapDonation),
      top: top.map(mapDonation),
    });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// POST /api/campaigns/:id/report — Raporto kampanjë
router.post("/:id/report", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason?.trim() || reason.length < 10) {
      res.status(400).json({ error: "Arsyeja duhet min 10 karaktere" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Përdoruesi nuk u gjet" }); return; }

    const report = await prisma.report.create({
      data: {
        reason: reason.trim(),
        reporterId: user.id,
        campaignId: req.params.id,
        status: "PENDING",
      },
    });
    res.status(201).json({ ok: true, reportId: report.id });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

export default router;
