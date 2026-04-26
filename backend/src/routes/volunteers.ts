import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, optionalAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

const ListingKindSchema = z.enum(["VOLUNTEER_CONTRIBUTION", "SUPPORT_REQUEST"]).default("VOLUNTEER_CONTRIBUTION");
const VolunteerSubtypeSchema = z.enum(["PHYSICAL_ITEM", "SERVICE", "FUND"]).default("SERVICE");
const LISTING_KINDS = new Set(["VOLUNTEER_CONTRIBUTION", "SUPPORT_REQUEST"]);
const VOLUNTEER_SUBTYPES = new Set(["PHYSICAL_ITEM", "SERVICE", "FUND"]);
const VOLUNTEER_SORTS = new Set(["newest", "oldest", "deadline"]);

const CreateVolunteerSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  kind: ListingKindSchema,
  subtype: VolunteerSubtypeSchema.optional(),
  helpType: VolunteerSubtypeSchema.optional(), // alias frontend
  category: z.string().min(1),
  location: z.string().min(1).default("Online"),
  organization: z.string().max(120).optional(),
  valueLabel: z.string().max(120).optional(),
  remote: z.boolean().default(false),
  images: z.array(z.string().url()).max(10).default([]),
  conditions: z.string().optional(),
  applicationDeadline: z.string().datetime().optional(),
  isAnonymous: z.boolean().default(false),
  // Detaje sipas tipit (nga wizard)
  itemDetails: z.object({
    quantity: z.string().optional(),
    condition: z.string().optional(),
    pickupAddress: z.string().optional(),
  }).optional(),
  serviceDetails: z.object({
    duration: z.string().optional(),
    availability: z.string().optional(),
  }).optional(),
  fundDetails: z.object({
    maxAmount: z.number().optional(),
    purpose: z.string().optional(),
    criteria: z.string().optional(),
  }).optional(),
});

function selectSubtype(data: z.infer<typeof CreateVolunteerSchema>) {
  if (data.subtype) return data.subtype;
  if (data.helpType) return data.helpType;
  if (data.kind === "SUPPORT_REQUEST") return "FUND";
  return "SERVICE";
}

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

function cleanEnum(value: unknown, allowed: Set<string>) {
  const raw = cleanString(value);
  if (!raw || raw === "all") return null;
  const normalized = raw.toUpperCase();
  return allowed.has(normalized) ? normalized : "__INVALID__";
}

function cleanSort(value: unknown) {
  const raw = cleanString(value);
  return VOLUNTEER_SORTS.has(raw) ? raw : "newest";
}

function volunteerOrderBy(sort: string) {
  if (sort === "oldest") return [{ createdAt: "asc" }];
  if (sort === "deadline") return [{ applicationDeadline: "asc" }, { createdAt: "desc" }];
  return [{ createdAt: "desc" }];
}

// GET /api/volunteers/my - Shpalljet e userit te loguar me request-at
router.get("/my", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const listings = await prisma.volunteerListing.findMany({
      where: { ownerId: user.id },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true, username: true } },
        applications: {
          include: {
            applicant: { select: { id: true, name: true, email: true, image: true, username: true, location: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ listings });
  } catch {
    res.status(500).json({ error: "Gabim gjate marrjes se shpalljeve" });
  }
});

// GET /api/volunteers - Listo te gjitha shpalljet publike aktive
router.get("/", optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, location, subtype, kind, search, page, limit, sort } = req.query;
    const cleanKind = cleanEnum(kind, LISTING_KINDS);
    const cleanSubtype = cleanEnum(subtype, VOLUNTEER_SUBTYPES);
    const cleanCategory = cleanString(category);
    const cleanLocation = cleanString(location);
    const cleanSearch = cleanString(search);
    const cleanPageNumber = cleanPage(page);
    const cleanLimitNumber = cleanLimit(limit, 12);
    const cleanSortKey = cleanSort(sort);

    if (cleanKind === "__INVALID__" || cleanSubtype === "__INVALID__") {
      res.json({ listings: [], total: 0, page: cleanPageNumber, limit: cleanLimitNumber });
      return;
    }

    const where: Record<string, unknown> = { status: "ACTIVE" };
    if (cleanCategory && cleanCategory !== "all") where.category = cleanCategory;
    if (cleanLocation && cleanLocation !== "all") where.location = cleanLocation;
    if (cleanSubtype) where.subtype = cleanSubtype;
    if (cleanKind) where.kind = cleanKind;
    if (cleanSearch) {
      where.OR = [
        { title: { contains: cleanSearch, mode: "insensitive" } },
        { description: { contains: cleanSearch, mode: "insensitive" } },
      ];
    }

    const take = cleanLimitNumber;
    const skip = (cleanPageNumber - 1) * take;
    const [listings, total] = await Promise.all([
      prisma.volunteerListing.findMany({
        where,
        include: {
          owner: { select: { id: true, name: true, image: true, isVerified: true, username: true } },
          _count: { select: { applications: true } },
        },
        orderBy: volunteerOrderBy(cleanSortKey) as never,
        skip,
        take,
      }),
      prisma.volunteerListing.count({ where }),
    ]);

    res.json({ listings, total, page: cleanPageNumber, limit: take });
  } catch {
    res.status(500).json({ error: "Gabim gjate marrjes se listimeve" });
  }
});

// POST /api/volunteers - Krijo kontribut vullnetar ose kerkese per mbeshtetje
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = CreateVolunteerSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    // Përmbledh helpDetails nga forma përkatëse e wizard-it
    const subtype = selectSubtype(data);
    const helpDetails =
      subtype === "PHYSICAL_ITEM" ? data.itemDetails ?? null :
      subtype === "SERVICE" ? data.serviceDetails ?? null :
      subtype === "FUND" ? data.fundDetails ?? null :
      null;

    const listing = await prisma.volunteerListing.create({
      data: {
        title: data.title,
        description: data.description,
        kind: data.kind,
        subtype,
        category: data.category,
        location: data.remote ? "Online" : data.location,
        organization: data.organization,
        valueLabel: data.valueLabel,
        remote: data.remote,
        images: data.images,
        conditions: data.conditions,
        applicationDeadline: data.applicationDeadline,
        isAnonymous: data.isAnonymous,
        helpDetails: helpDetails ?? undefined,
        ownerId: user.id,
        status: "PENDING",
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true, username: true } },
        _count: { select: { applications: true } },
      },
    });

    res.status(201).json(listing);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: "Gabim gjate krijimit" });
  }
});

// GET /api/volunteers/:id - Merr shpalljen me id
router.get("/:id", optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listing = await prisma.volunteerListing.findUnique({
      where: { id: String(req.params.id) },
      include: {
        owner: { select: { id: true, name: true, image: true, isVerified: true, username: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!listing) {
      res.status(404).json({ error: "Listimi nuk u gjet" });
      return;
    }
    if (listing.status !== "ACTIVE") {
      res.status(404).json({ error: "Listimi nuk u gjet" });
      return;
    }

    res.json(listing);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// POST /api/volunteers/:id/apply - Apliko per shpallje
router.post("/:id/apply", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reason, anonymous = false } = req.body;
    if (!reason || String(reason).trim().length < 10) {
      res.status(400).json({ error: "Arsyeja duhet te jete te pakten 10 karaktere." });
      return;
    }

    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const listing = await prisma.volunteerListing.findUnique({ where: { id: String(req.params.id) } });
    if (!listing) { res.status(404).json({ error: "Listimi nuk u gjet" }); return; }
    if (listing.status !== "ACTIVE") { res.status(400).json({ error: "Ky listim nuk pranon aplikime." }); return; }
    if (listing.ownerId === user.id) { res.status(400).json({ error: "Nuk mund te aplikosh ne shpalljen tende." }); return; }

    const application = await prisma.application.create({
      data: {
        reason: String(reason).trim(),
        isAnonymous: Boolean(anonymous),
        applicantId: user.id,
        listingId: String(req.params.id),
      },
      include: {
        applicant: { select: { id: true, name: true, email: true, image: true, username: true } },
        listing: { select: { id: true, title: true, kind: true, ownerId: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId: listing.ownerId,
        title: "Kerkese e re per shpalljen tende",
        message: `${user.name} dergoi kerkese per "${listing.title}".`,
        type: "APPLICATION_RECEIVED",
        targetType: "APPLICATION",
        targetId: application.id,
      },
    });

    res.status(201).json(application);
  } catch (err: unknown) {
    const isUniqueConstraint = err instanceof Error && err.message.includes("Unique constraint");
    if (isUniqueConstraint) {
      res.status(409).json({ error: "Tashme ke aplikuar per kete listim." });
      return;
    }
    res.status(500).json({ error: "Gabim gjate aplikimit" });
  }
});

// POST /api/volunteers/:id/report — Raporto shpallje
router.post("/:id/report", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason?.trim() || reason.length < 10) {
      res.status(400).json({ error: "Arsyeja duhet min 10 karaktere" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const report = await prisma.report.create({
      data: {
        reason: reason.trim(),
        reporterId: user.id,
        listingId: req.params.id,
        status: "PENDING",
      },
    });
    res.status(201).json({ ok: true, reportId: report.id });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

export default router;
