import { Router, Response } from "express";
import { BlogStatus, BlockListType, CampaignStatus, NetworkRuleType, VolunteerStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth";
import {
  sendCampaignApprovedEmail,
  sendCampaignRejectedEmail,
} from "../lib/resend";

const router = Router();

// Të gjitha routes kërkojnë auth + admin rol
router.use(requireAuth);
router.use(requireAdmin);

async function getAdminDbUser(req: AuthenticatedRequest) {
  if (!req.userId) return null;
  return prisma.user.findUnique({ where: { clerkId: req.userId } });
}

async function writeAudit(req: AuthenticatedRequest, action: string, target: string, details?: string) {
  const admin = await getAdminDbUser(req);
  if (!admin) return;
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action,
      target,
      details,
    },
  });
}

const DEFAULT_ADMIN_SETTINGS: Record<string, boolean> = {
  holdCampaignsForReview: true,
  autoBlockReportedAccounts: true,
  requireCreatorIdentity: true,
  allowAutoBlogPublishing: false,
  notifyLargeDonations: true,
};

function normalizeBlockValue(value: string) {
  return value.trim().toLowerCase();
}

function parseBlogStatus(value: unknown, fallback: BlogStatus = BlogStatus.DRAFT) {
  const clean = String(value ?? fallback).toUpperCase();
  return Object.values(BlogStatus).includes(clean as BlogStatus) ? clean as BlogStatus : fallback;
}

function parseBlockListType(value: unknown) {
  const clean = String(value ?? "").toUpperCase();
  return Object.values(BlockListType).includes(clean as BlockListType) ? clean as BlockListType : null;
}

function parseNetworkRuleType(value: unknown) {
  const clean = String(value ?? "").toUpperCase();
  return Object.values(NetworkRuleType).includes(clean as NetworkRuleType) ? clean as NetworkRuleType : null;
}

function parseCampaignStatus(value: unknown) {
  const clean = String(value ?? "").toUpperCase();
  return Object.values(CampaignStatus).includes(clean as CampaignStatus) ? clean as CampaignStatus : null;
}

function parseVolunteerStatus(value: unknown) {
  const clean = String(value ?? "").toUpperCase();
  return Object.values(VolunteerStatus).includes(clean as VolunteerStatus) ? clean as VolunteerStatus : null;
}

// GET /api/admin/stats — Statistikat e platformës
router.get("/stats", async (_req, res: Response) => {
  try {
    const [totalCampaigns, activeCampaigns, pendingCampaigns, totalUsers, donationSum, totalVolunteers, openReports, pendingBlogs] =
      await Promise.all([
        prisma.campaign.count(),
        prisma.campaign.count({ where: { status: "ACTIVE" } }),
        prisma.campaign.count({ where: { status: "PENDING" } }),
        prisma.user.count(),
        prisma.donation.aggregate({
          where: { status: "SUCCEEDED" },
          _sum: { amount: true },
        }),
        prisma.volunteerListing.count(),
        prisma.report.count({ where: { status: "PENDING" } }),
        prisma.blog.count({ where: { status: "PENDING" } }),
      ]);

    res.json({
      totalCampaigns,
      activeCampaigns,
      pendingCampaigns,
      totalUsers,
      totalRaised: donationSum._sum.amount || 0,
      totalVolunteers,
      openReports,
      pendingBlogs,
    });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/admin/campaigns — Listo kampanjat (me filtër statusi)
router.get("/campaigns", async (req, res: Response) => {
  try {
    const { status, page = "1", limit = "20" } = req.query;
    const where = status ? { status: String(status) } : {};
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          creator: { select: { id: true, name: true, email: true } },
          _count: { select: { donations: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(String(limit)),
      }),
      prisma.campaign.count({ where }),
    ]);

    res.json({ campaigns, total });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/campaigns/:id/approve — Aprovo kampanjë
router.patch("/campaigns/:id/approve", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: { status: "ACTIVE" },
      include: { creator: true },
    });

    if (campaign.creator.email) {
      await sendCampaignApprovedEmail(campaign.creator.email, campaign.title);
    }

    await prisma.notification.create({
      data: {
        userId: campaign.creatorId,
        title: "Kampanja u aprovua",
        message: `Kampanja "${campaign.title}" eshte publikuar ne faqe publike.`,
        type: "CAMPAIGN_APPROVED",
        targetType: "CAMPAIGN",
        targetId: campaign.id,
      },
    });
    await writeAudit(req, "APPROVE_CAMPAIGN", campaign.id, campaign.title);

    res.json(campaign);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/campaigns/:id/reject — Refuzo kampanjë
router.patch("/campaigns/:id/reject", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason) { res.status(400).json({ error: "Arsyeja kërkohet" }); return; }

    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: { status: "REJECTED", rejectionReason: reason },
      include: { creator: true },
    });

    if (campaign.creator.email) {
      await sendCampaignRejectedEmail(campaign.creator.email, campaign.title, reason);
    }

    await prisma.notification.create({
      data: {
        userId: campaign.creatorId,
        title: "Kampanja u refuzua",
        message: `Kampanja "${campaign.title}" u refuzua. Arsyeja: ${reason}`,
        type: "CAMPAIGN_REJECTED",
        targetType: "CAMPAIGN",
        targetId: campaign.id,
      },
    });
    await writeAudit(req, "REJECT_CAMPAIGN", campaign.id, String(reason));

    res.json(campaign);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/campaigns/:id/featured — Toggle featured
router.patch("/campaigns/:id/featured", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const campaign = await prisma.campaign.findUnique({ where: { id: req.params.id } });
    if (!campaign) { res.status(404).json({ error: "Kampanja nuk u gjet" }); return; }

    const updated = await prisma.campaign.update({
      where: { id: req.params.id },
      data: { isFeatured: !campaign.isFeatured },
    });

    await writeAudit(req, "TOGGLE_FEATURED_CAMPAIGN", updated.id, String(updated.isFeatured));

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/admin/users — Listo të gjithë përdoruesit
router.get("/users", async (req, res: Response) => {
  try {
    const { role, page = "1", limit = "20" } = req.query;
    const where = role ? { role: String(role) } : {};
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, image: true, role: true,
          isVerified: true, isBanned: true, createdAt: true,
          _count: { select: { campaigns: true, donations: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(String(limit)),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/users/:id/ban — Bloko/çbloko user
router.patch("/users/:id/ban", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) { res.status(404).json({ error: "Përdoruesi nuk u gjet" }); return; }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: !user.isBanned },
    });

    await writeAudit(req, updated.isBanned ? "BAN_USER" : "UNBAN_USER", updated.id, updated.email);

    res.json({ isBanned: updated.isBanned });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/users/:id/verify — Verifiko manualisht
router.patch("/users/:id/verify", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isVerified: true },
    });
    await writeAudit(req, "VERIFY_USER", updated.id, updated.email);
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/users/:id/role — Ndrysho rolin
router.patch("/users/:id/role", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!["USER", "ADMIN", "MODERATOR"].includes(role)) {
      res.status(400).json({ error: "Rol invalid" });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });
    await writeAudit(req, "CHANGE_USER_ROLE", updated.id, String(role));
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/admin/volunteers — Listo asetet vullnetare
router.get("/volunteers", async (req, res: Response) => {
  try {
    const { status } = req.query;
    const where = status ? { status: String(status) } : {};

    const listings = await prisma.volunteerListing.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(listings);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/volunteers/:id/approve
router.patch("/volunteers/:id/approve", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await prisma.volunteerListing.update({
      where: { id: req.params.id },
      data: { status: "ACTIVE" },
    });
    await prisma.notification.create({
      data: {
        userId: updated.ownerId,
        title: "Shpallja u aprovua",
        message: `Shpallja "${updated.title}" eshte publikuar ne faqe publike.`,
        type: "LISTING_APPROVED",
        targetType: "VOLUNTEER_LISTING",
        targetId: updated.id,
      },
    });
    await writeAudit(req, "APPROVE_VOLUNTEER_LISTING", updated.id, updated.title);
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/campaigns/:id/status - Ndrysho statusin pa veprim special
router.patch("/campaigns/:id/status", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, reason } = req.body ?? {};
    const nextStatus = parseCampaignStatus(status);
    if (!nextStatus) {
      res.status(400).json({ error: "Status invalid" });
      return;
    }

    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: {
        status: nextStatus,
        rejectionReason: nextStatus === "REJECTED" ? String(reason ?? "Refuzuar nga admin.") : undefined,
      },
    });

    await writeAudit(req, "CHANGE_CAMPAIGN_STATUS", campaign.id, `${campaign.status}: ${reason ?? ""}`);
    res.json(campaign);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/volunteers/:id/reject
router.patch("/volunteers/:id/reject", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reason = "Refuzuar nga admin." } = req.body ?? {};
    const updated = await prisma.volunteerListing.update({
      where: { id: req.params.id },
      data: { status: "REJECTED" },
    });
    await prisma.notification.create({
      data: {
        userId: updated.ownerId,
        title: "Shpallja u refuzua",
        message: `Shpallja "${updated.title}" u refuzua. Arsyeja: ${reason}`,
        type: "LISTING_REJECTED",
        targetType: "VOLUNTEER_LISTING",
        targetId: updated.id,
      },
    });
    await writeAudit(req, "REJECT_VOLUNTEER_LISTING", updated.id, String(reason));
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/volunteers/:id/status - Ndrysho statusin pa humbur historikun
router.patch("/volunteers/:id/status", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, reason } = req.body ?? {};
    const nextStatus = parseVolunteerStatus(status);
    if (!nextStatus) {
      res.status(400).json({ error: "Status invalid" });
      return;
    }

    const listing = await prisma.volunteerListing.update({
      where: { id: req.params.id },
      data: { status: nextStatus },
    });

    await writeAudit(req, "CHANGE_VOLUNTEER_STATUS", listing.id, `${listing.status}: ${reason ?? ""}`);
    res.json(listing);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/admin/users/:id — Detajet e plotë të një useri
// GET /api/admin/applications/review - Request-at qe pronari i dergoi te admini
router.get("/applications/review", async (_req, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      where: { status: "ADMIN_REVIEW" },
      include: {
        applicant: { select: { id: true, name: true, email: true, image: true, username: true } },
        listing: {
          include: {
            owner: { select: { id: true, name: true, email: true, image: true, username: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ applications });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/applications/:id/approve - Aprovo finalisht dhe mbyll shpalljen
router.patch("/applications/:id/approve", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { listing: true, applicant: true },
    });
    if (!application) { res.status(404).json({ error: "Aplikimi nuk u gjet" }); return; }

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: { status: "ACCEPTED" },
      include: {
        applicant: { select: { id: true, name: true, email: true, image: true, username: true } },
        listing: { include: { owner: { select: { id: true, name: true, email: true } } } },
      },
    });

    await prisma.volunteerListing.update({
      where: { id: application.listingId },
      data: { status: "CLOSED", fulfilledAt: new Date() },
    });

    await prisma.notification.createMany({
      data: [
        {
          userId: application.listing.ownerId,
          title: "Shpallja u aprovua me sukses",
          message: `Admini aprovoi permbushjen e "${application.listing.title}". Shpallja u mbyll si e permbushur.`,
          type: "FULFILLMENT_APPROVED",
          targetType: "APPLICATION",
          targetId: application.id,
        },
        {
          userId: application.applicantId,
          title: "Kerkesa jote u aprovua",
          message: `Admini aprovoi kerkesen tende per "${application.listing.title}".`,
          type: "APPLICATION_APPROVED",
          targetType: "APPLICATION",
          targetId: application.id,
        },
      ],
    });

    await writeAudit(req, "APPROVE_APPLICATION_FULFILLMENT", application.id, application.listing.title);

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/applications/:id/reject - Refuzo finalisht request-in
router.patch("/applications/:id/reject", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { listing: true, applicant: true },
    });
    if (!application) { res.status(404).json({ error: "Aplikimi nuk u gjet" }); return; }

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: { status: "REJECTED" },
      include: {
        applicant: { select: { id: true, name: true, email: true, image: true, username: true } },
        listing: { include: { owner: { select: { id: true, name: true, email: true } } } },
      },
    });

    await prisma.volunteerListing.update({
      where: { id: application.listingId },
      data: { status: "ACTIVE" },
    });

    await prisma.notification.createMany({
      data: [
        {
          userId: application.listing.ownerId,
          title: "Admini refuzoi kerkesen",
          message: `Request-i per "${application.listing.title}" u refuzua nga admini.`,
          type: "FULFILLMENT_REJECTED",
          targetType: "APPLICATION",
          targetId: application.id,
        },
        {
          userId: application.applicantId,
          title: "Kerkesa u refuzua",
          message: `Admini refuzoi kerkesen tende per "${application.listing.title}".`,
          type: "APPLICATION_REJECTED",
          targetType: "APPLICATION",
          targetId: application.id,
        },
      ],
    });

    await writeAudit(req, "REJECT_APPLICATION_FULFILLMENT", application.id, application.listing.title);

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/admin/blocklist - Lista dinamike e bllokimeve
router.get("/blocklist", async (_req, res: Response) => {
  try {
    const items = await prisma.moderationBlock.findMany({
      include: { createdBy: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      items: items.map((item) => ({
        id: item.id,
        type: item.type.toLowerCase(),
        value: item.value,
        reason: item.reason,
        expires: item.expiresAt ? item.expiresAt.toISOString().split("T")[0] : "permanent",
        createdAt: item.createdAt.toISOString(),
        createdBy: item.createdBy?.email ?? "system",
      })),
    });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// POST /api/admin/blocklist - Shto user/email/ip/domain ne blocklist
router.post("/blocklist", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type = "email", value, reason = "Shtuar nga moderimi", expiresAt } = req.body ?? {};
    const blockType = parseBlockListType(type);
    if (!blockType || !value) {
      res.status(400).json({ error: "Blocklist type/value invalid" });
      return;
    }

    const admin = await getAdminDbUser(req);
    const item = await prisma.moderationBlock.upsert({
      where: { type_value: { type: blockType, value: normalizeBlockValue(String(value)) } },
      create: {
        type: blockType,
        value: normalizeBlockValue(String(value)),
        reason: String(reason),
        expiresAt: expiresAt ? new Date(String(expiresAt)) : undefined,
        createdById: admin?.id,
      },
      update: {
        reason: String(reason),
        expiresAt: expiresAt ? new Date(String(expiresAt)) : null,
        createdById: admin?.id,
      },
    });

    await writeAudit(req, "UPSERT_BLOCKLIST", item.id, `${item.type}:${item.value}`);
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// DELETE /api/admin/blocklist/:id - Hiq nga blocklist
router.delete("/blocklist/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await prisma.moderationBlock.delete({ where: { id: req.params.id } });
    await writeAudit(req, "DELETE_BLOCKLIST", deleted.id, `${deleted.type}:${deleted.value}`);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/admin/settings - Network rules dhe toggles nga DB
router.get("/settings", async (_req, res: Response) => {
  try {
    const [rules, settingRows] = await Promise.all([
      prisma.networkRule.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.adminSetting.findMany(),
    ]);
    const settings = { ...DEFAULT_ADMIN_SETTINGS };
    for (const row of settingRows) {
      settings[row.key] = row.value === "true";
    }

    res.json({
      rules: rules.map((rule) => ({
        id: rule.id,
        type: rule.type.toLowerCase(),
        value: rule.value,
        note: rule.note ?? "",
      })),
      settings,
    });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// POST /api/admin/settings/network-rules - Shto allow/block rule
router.post("/settings/network-rules", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type = "allow", value, note = "" } = req.body ?? {};
    const ruleType = parseNetworkRuleType(type);
    if (!ruleType || !value) {
      res.status(400).json({ error: "Network rule invalid" });
      return;
    }
    const rule = await prisma.networkRule.upsert({
      where: { type_value: { type: ruleType, value: String(value).trim() } },
      create: { type: ruleType, value: String(value).trim(), note: String(note) },
      update: { note: String(note) },
    });
    await writeAudit(req, "UPSERT_NETWORK_RULE", rule.id, `${rule.type}:${rule.value}`);
    res.status(201).json(rule);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// DELETE /api/admin/settings/network-rules/:id
router.delete("/settings/network-rules/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await prisma.networkRule.delete({ where: { id: req.params.id } });
    await writeAudit(req, "DELETE_NETWORK_RULE", deleted.id, `${deleted.type}:${deleted.value}`);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/settings/toggles/:key
router.patch("/settings/toggles/:key", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const key = String(req.params.key);
    if (!(key in DEFAULT_ADMIN_SETTINGS)) {
      res.status(400).json({ error: "Setting invalid" });
      return;
    }
    const value = Boolean(req.body?.value);
    const setting = await prisma.adminSetting.upsert({
      where: { key },
      create: { key, value: String(value) },
      update: { value: String(value) },
    });
    await writeAudit(req, "UPDATE_ADMIN_SETTING", key, String(value));
    res.json({ key: setting.key, value });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

router.get("/users/:id", async (req, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, name: true, email: true, image: true, role: true,
        isVerified: true, isBanned: true, createdAt: true, updatedAt: true,
        _count: {
          select: {
            campaigns: true,
            donations: true,
            volunteerListings: true,
            applications: true,
            reports: { where: { reporterId: req.params.id } },
          },
        },
        donations: {
          where: { status: "SUCCEEDED" },
          select: { amount: true },
        },
      },
    });

    if (!user) { res.status(404).json({ error: "Useri nuk u gjet" }); return; }

    const totalDonated = user.donations.reduce((sum, d) => sum + d.amount, 0);
    const { donations, ...rest } = user;
    res.json({ ...rest, totalDonated });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/admin/audit-log — Listo veprimet e adminit
router.get("/audit-log", async (req, res: Response) => {
  try {
    const { page = "1", limit = "50" } = req.query;
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const logs = await prisma.auditLog.findMany({
      include: { admin: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: parseInt(String(limit)),
    });

    const entries = logs.map((log) => ({
      id: log.id,
      timestamp: log.createdAt.toISOString(),
      actor: log.admin.email,
      action: log.action,
      target: log.target,
      ip: "",
      severity: log.action.includes("BAN") || log.action.includes("DELETE")
        ? "warning"
        : "info",
    }));

    res.json({ entries });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/admin/reports — Listo raportimet
router.get("/reports", async (req, res: Response) => {
  try {
    const { status } = req.query;
    const where = status ? { status: String(status).toUpperCase() } : {};

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: { select: { name: true, email: true } },
        reported: { select: { name: true, email: true } },
        campaign: { select: { title: true, slug: true, creator: { select: { name: true, email: true } } } },
        listing: { select: { title: true, owner: { select: { name: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const statusMap: Record<string, string> = {
      PENDING: "open",
      REVIEWED: "resolved",
      DISMISSED: "dismissed",
    };

    const mapped = reports.map((r) => {
      const hasCampaign = r.campaign != null;
      const hasListing = r.listing != null;
      const targetType = hasCampaign ? "Kampanje" : hasListing ? "Shpallje" : r.commentId ? "Koment" : "Profil";
      const targetName = hasCampaign ? r.campaign!.title : hasListing ? r.listing!.title : r.reportedId ?? "—";
      const owner = hasCampaign ? r.campaign!.creator : hasListing ? r.listing!.owner : r.reported;
      const targetUrl = hasCampaign ? `/admin/kampanjat` : hasListing ? `/admin/vullnetare` : `/admin/perdoruesit/${r.reportedId}`;

      return {
        id: r.id,
        targetType,
        targetName,
        targetOwner: owner?.name ?? "—",
        targetOwnerEmail: owner?.email ?? "—",
        targetUrl,
        reporter: r.reporter.name,
        reporterEmail: r.reporter.email,
        reason: r.reason,
        createdAt: r.createdAt.toISOString().split("T")[0],
        status: statusMap[r.status] ?? "open",
        severity: r.status === "PENDING" ? "medium" : "low",
      };
    });

    res.json({ reports: mapped });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/reports/:id — Ndrysho statusin e raportimit
router.patch("/reports/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    const statusMap: Record<string, string> = {
      open: "PENDING",
      investigating: "PENDING",
      resolved: "REVIEWED",
      dismissed: "DISMISSED",
    };
    const dbStatus = statusMap[status] ?? "PENDING";
    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data: { status: dbStatus },
    });
    await writeAudit(req, "UPDATE_REPORT_STATUS", updated.id, dbStatus);
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// DELETE /api/admin/reports/:id - Fshi raportimin
router.delete("/reports/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await prisma.report.findUnique({ where: { id: req.params.id } });
    await prisma.report.delete({ where: { id: req.params.id } });
    await writeAudit(req, "DELETE_REPORT", req.params.id, deleted?.reason);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/admin/blog-posts — Listo të gjithë bloget
router.get("/blog-posts", async (req, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: { author: { select: { id: true, name: true, email: true, username: true } } },
      orderBy: { createdAt: "desc" },
    });

    const posts = blogs.map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt ?? "",
      content: b.content,
      tags: b.tags,
      author: b.author?.name ?? "Unify Admin",
      authorEmail: b.author?.email ?? "admin@unify.local",
      source: b.authorId ? "user" : "admin",
      status: b.status.toLowerCase(),
      submittedAt: b.createdAt.toLocaleString("sq-AL"),
      coverImage: b.coverImage ?? undefined,
      reviewNote: b.reviewNote ?? undefined,
    }));

    res.json({ posts });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// PATCH /api/admin/blog-posts/:id — Ndrysho blog postin
// POST /api/admin/blog-posts - Krijo draft nga admini
router.post("/blog-posts", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title = "", slug, excerpt = "", content = "", tags = [], coverImage, status = "draft" } = req.body ?? {};
    const cleanTitle = String(title || "Postim pa titull").trim();
    const baseSlug = String(slug || cleanTitle)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 70) || `postim-${Date.now()}`;
    const blogStatus = parseBlogStatus(status);

    const post = await prisma.blog.create({
      data: {
        title: cleanTitle,
        slug: `${baseSlug}-${Date.now()}`,
        excerpt: String(excerpt),
        content: String(content || " "),
        tags: Array.isArray(tags) ? tags.map(String) : [],
        coverImage: coverImage ? String(coverImage) : undefined,
        status: blogStatus,
        isPublished: blogStatus === BlogStatus.PUBLISHED,
      },
    });

    await writeAudit(req, "CREATE_BLOG_POST", post.id, post.title);
    res.status(201).json(post);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

router.patch("/blog-posts/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, slug, excerpt, content, status, tags, coverImage, reviewNote } = req.body;
    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (content !== undefined) data.content = content;
    if (tags !== undefined) data.tags = Array.isArray(tags) ? tags.map(String) : [];
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (reviewNote !== undefined) data.reviewNote = reviewNote;
    if (status !== undefined) {
      const nextStatus = parseBlogStatus(status);
      data.status = nextStatus;
      data.isPublished = nextStatus === BlogStatus.PUBLISHED;
    }

    const updated = await prisma.blog.update({
      where: { id: req.params.id },
      data,
    });
    await writeAudit(req, "UPDATE_BLOG_POST", updated.id, `${updated.status}`);
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// DELETE /api/admin/blog-posts/:id — Fshi blog postin
router.delete("/blog-posts/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await prisma.blog.findUnique({ where: { id: req.params.id } });
    await prisma.blog.delete({ where: { id: req.params.id } });
    await writeAudit(req, "DELETE_BLOG_POST", req.params.id, deleted?.title);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// ─── GROUPS (Inbox moderation) ───────────────────────────────────────────────

router.get("/groups", async (_req, res: Response) => {
  try {
    const groups = await prisma.conversation.findMany({
      where: { type: "GROUP" },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, image: true, username: true } } },
        },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });

    const mapped = groups.map((g) => ({
      id: g.id,
      type: g.type,
      name: g.name,
      image: g.image,
      participants: g.participants.map((p) => ({
        id: p.user.id,
        username: p.user.username ?? "",
        name: p.user.name,
        image: p.user.image,
      })),
      lastMessage: g.messages[0]
        ? { id: g.messages[0].id, content: g.messages[0].content, senderId: g.messages[0].senderId, senderUsername: "", createdAt: g.messages[0].createdAt.toISOString() }
        : null,
      unreadCount: 0,
      updatedAt: g.updatedAt.toISOString(),
      isSuspended: g.isSuspended,
      reportCount: 0,
    }));

    res.json({ groups: mapped });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

router.patch("/groups/:id/suspend", async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.conversation.update({ where: { id: req.params.id }, data: { isSuspended: true } });
    await writeAudit(req, "SUSPEND_GROUP", req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

router.patch("/groups/:id/unsuspend", async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.conversation.update({ where: { id: req.params.id }, data: { isSuspended: false } });
    await writeAudit(req, "UNSUSPEND_GROUP", req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

export default router;
