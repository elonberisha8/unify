import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { sendApplicationStatusEmail } from "../lib/resend";

const router = Router();

const CreateApplicationSchema = z.object({
  listingId: z.string(),
  reason: z.string().min(10, "Arsyeja duhet te jete te pakten 10 karaktere"),
  isAnonymous: z.boolean().default(false),
});

const OwnerStatusSchema = z.enum(["ADMIN_REVIEW", "REJECTED"]);

async function getCurrentUser(req: AuthenticatedRequest) {
  if (!req.userId) return null;
  return prisma.user.findUnique({ where: { clerkId: req.userId } });
}

// POST /api/applications - Apliko per shpallje
router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = CreateApplicationSchema.parse(req.body);
    const user = await getCurrentUser(req);
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const listing = await prisma.volunteerListing.findUnique({
      where: { id: data.listingId },
    });
    if (!listing || listing.status !== "ACTIVE") {
      res.status(404).json({ error: "Listimi nuk u gjet ose nuk eshte aktiv" });
      return;
    }
    if (listing.ownerId === user.id) {
      res.status(400).json({ error: "Nuk mund te aplikosh ne shpalljen tende" });
      return;
    }

    const application = await prisma.application.create({
      data: {
        listingId: data.listingId,
        applicantId: user.id,
        reason: data.reason,
        isAnonymous: data.isAnonymous,
        status: "PENDING",
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
        message: `${user.name} aplikoi per "${listing.title}".`,
        type: "APPLICATION_RECEIVED",
        targetType: "APPLICATION",
        targetId: application.id,
      },
    });

    res.status(201).json(application);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    const isUniqueConstraint = err instanceof Error && err.message.includes("Unique constraint");
    if (isUniqueConstraint) {
      res.status(409).json({ error: "Ke aplikuar tashme" });
      return;
    }
    res.status(500).json({ error: "Gabim gjate aplikimit" });
  }
});

// GET /api/applications/my - Aplikimet qe i kam bere une
// GET /api/applications/my (dhe alias /mine) — Aplikimet e mia
async function getMyApplications(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await getCurrentUser(req);
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const applications = await prisma.application.findMany({
      where: { applicantId: user.id },
      include: {
        listing: {
          include: {
            owner: { select: { id: true, name: true, email: true, image: true, username: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Frontend pret strukturë të mapuar (MyApplication)
    const mapped = applications.map((a) => ({
      id: a.id,
      reason: a.reason,
      status: a.status,
      isAnonymous: a.isAnonymous,
      createdAt: a.createdAt.toISOString(),
      listing: {
        id: a.listing.id,
        title: a.listing.title,
        subtype: a.listing.subtype,
        category: a.listing.category,
        location: a.listing.location,
        image: a.listing.images?.[0] ?? null,
        owner: {
          id: a.listing.owner.id,
          username: a.listing.owner.username ?? "",
          name: a.listing.owner.name,
        },
      },
    }));

    res.json({ applications: mapped });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
}

router.get("/my", requireAuth, getMyApplications);
router.get("/mine", requireAuth, getMyApplications);

// PATCH /api/applications/:id/withdraw — Tërhiq aplikimin tim (vetëm PENDING)
router.patch("/:id/withdraw", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const application = await prisma.application.findUnique({ where: { id: req.params.id } });
    if (!application) { res.status(404).json({ error: "Aplikimi nuk u gjet" }); return; }
    if (application.applicantId !== user.id) { res.status(403).json({ error: "Pa qasje" }); return; }
    if (application.status !== "PENDING") {
      res.status(400).json({ error: "Vetëm aplikimet PENDING mund të tërhiqen" });
      return;
    }

    const updated = await prisma.application.update({
      where: { id: application.id },
      data: { status: "WITHDRAWN" },
    });
    res.json({ application: updated });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/applications/received - Kerkesat qe kane ardhur ne shpalljet e mia
router.get("/received", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const applications = await prisma.application.findMany({
      where: { listing: { ownerId: user.id } },
      include: {
        applicant: { select: { id: true, name: true, email: true, image: true, username: true, location: true } },
        listing: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ applications });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/applications/listing/:listingId - Aplikimet per nje listim (pronari)
router.get("/listing/:listingId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const listingId = String(req.params.listingId);
    const listing = await prisma.volunteerListing.findUnique({
      where: { id: listingId },
    });
    if (!listing || listing.ownerId !== user.id) {
      res.status(403).json({ error: "Pa leje" });
      return;
    }

    const applications = await prisma.application.findMany({
      where: { listingId },
      include: {
        applicant: { select: { id: true, name: true, email: true, image: true, username: true, location: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ applications });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/applications/:id/status - Pronari pranon/refuzon; pranimi kalon te admini
router.patch("/:id/status", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = OwnerStatusSchema.parse(req.body.status);
    const applicationId = String(req.params.id);
    const user = await getCurrentUser(req);
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { listing: true, applicant: true },
    });
    if (!application) { res.status(404).json({ error: "Aplikimi nuk u gjet" }); return; }
    if (application.listing.ownerId !== user.id) {
      res.status(403).json({ error: "Pa leje" });
      return;
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        applicant: { select: { id: true, name: true, email: true, image: true, username: true } },
        listing: true,
      },
    });

    if (status === "ADMIN_REVIEW") {
      await prisma.volunteerListing.update({
        where: { id: application.listingId },
        data: { status: "IN_REVIEW" },
      });

      const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "MODERATOR"] } },
        select: { id: true },
      });

      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          title: "Rast i ri per aprovim final",
          message: `${user.name} pranoi kerkesen e ${application.applicant.name} per "${application.listing.title}".`,
          type: "ADMIN_REVIEW_REQUEST",
          targetType: "APPLICATION",
          targetId: application.id,
        })),
      });
    } else {
      await prisma.notification.create({
        data: {
          userId: application.applicantId,
          title: "Kerkesa u refuzua",
          message: `Kerkesa jote per "${application.listing.title}" u refuzua nga pronari.`,
          type: "APPLICATION_REJECTED",
          targetType: "APPLICATION",
          targetId: application.id,
        },
      });
    }

    if (application.applicant.email) {
      await sendApplicationStatusEmail(application.applicant.email, application.listing.title, status);
    }

    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: "Gabim" });
  }
});

export default router;
