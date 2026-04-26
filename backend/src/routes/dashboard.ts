import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

function mapStatus(status: string) {
  const statusMap: Record<string, string> = {
    PENDING: "pending",
    ADMIN_REVIEW: "admin_review",
    ACCEPTED: "completed",
    REJECTED: "rejected",
    WITHDRAWN: "rejected",
  };
  return statusMap[status] ?? "pending";
}

function domainFromKind(kind: string) {
  return kind === "SUPPORT_REQUEST" ? "support" : "volunteer";
}

function flowForOwner(kind: string) {
  return kind === "SUPPORT_REQUEST" ? "incoming" : "outgoing";
}

function flowForApplicant(kind: string) {
  return kind === "SUPPORT_REQUEST" ? "outgoing" : "incoming";
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("sq-AL", { month: "short" });
}

function campaignUiStatus(status: string) {
  const map: Record<string, string> = {
    ACTIVE: "active",
    PENDING: "draft",
    COMPLETED: "completed",
    PAUSED: "paused",
    SUSPENDED: "paused",
    REJECTED: "paused",
  };
  return map[status] ?? "draft";
}

function relativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `${minutes} min me pare`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ore me pare`;
  const days = Math.round(hours / 24);
  return `${days} dite me pare`;
}

async function getCurrentUser(req: AuthenticatedRequest) {
  if (!req.userId) return null;
  return prisma.user.findUnique({ where: { clerkId: req.userId } });
}

// GET /api/dashboard/overview - Te dhenat reale per dashboard home
router.get("/overview", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [campaigns, volunteerListings, myApplications, outgoingDonations, incomingDonations, notifications] = await Promise.all([
      prisma.campaign.findMany({
        where: { creatorId: user.id },
        include: {
          donations: {
            where: { status: "SUCCEEDED" },
            include: { donor: { select: { id: true, name: true, image: true } } },
          },
          _count: { select: { donations: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.volunteerListing.findMany({
        where: { ownerId: user.id },
        include: { _count: { select: { applications: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.findMany({
        where: { applicantId: user.id },
        include: { listing: { select: { id: true, title: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.donation.findMany({
        where: { donorId: user.id, status: "SUCCEEDED" },
        include: { campaign: { select: { id: true, title: true, slug: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.donation.findMany({
        where: { campaign: { creatorId: user.id }, status: "SUCCEEDED" },
        include: { donor: { select: { id: true, name: true, image: true } }, campaign: { select: { id: true, title: true, slug: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const totalIncoming = incomingDonations.reduce((sum, donation) => sum + donation.amount, 0);
    const donorIds = new Set(incomingDonations.map((donation) => donation.donorId ?? donation.guestName ?? donation.id));

    const monthCursor = new Date(sixMonthsAgo);
    const monthBuckets = new Map<string, { muaji: string; shuma: number }>();
    for (let i = 0; i < 6; i += 1) {
      const d = new Date(monthCursor);
      d.setMonth(monthCursor.getMonth() + i);
      monthBuckets.set(monthKey(d), { muaji: monthLabel(d), shuma: 0 });
    }
    for (const donation of incomingDonations) {
      const key = monthKey(donation.createdAt);
      const bucket = monthBuckets.get(key);
      if (bucket) bucket.shuma += donation.amount;
    }

    const donorMap = new Map<string, { name: string; amount: number }>();
    for (const donation of incomingDonations) {
      const key = donation.donorId ?? donation.guestName ?? "guest";
      const current = donorMap.get(key) ?? { name: donation.isAnonymous ? "Anonim" : donation.donor?.name ?? donation.guestName ?? "Guest", amount: 0 };
      current.amount += donation.amount;
      donorMap.set(key, current);
    }

    const activity = [
      ...incomingDonations.slice(0, 8).map((donation) => ({
        id: `donation-in-${donation.id}`,
        actor: { name: donation.isAnonymous ? "Anonim" : donation.donor?.name ?? donation.guestName ?? "Guest" },
        action: "dha donacion per",
        target: donation.campaign.title,
        timestamp: relativeTime(donation.createdAt),
      })),
      ...myApplications.slice(0, 8).map((application) => ({
        id: `application-${application.id}`,
        actor: { name: user.name },
        action: "aplikoi per shpalljen",
        target: application.listing.title,
        timestamp: relativeTime(application.createdAt),
      })),
      ...notifications.slice(0, 8).map((notification) => ({
        id: `notification-${notification.id}`,
        actor: { name: "Unify" },
        action: notification.title,
        target: notification.message,
        timestamp: relativeTime(notification.createdAt),
      })),
    ].sort((a, b) => a.timestamp.localeCompare(b.timestamp)).slice(0, 10);

    res.json({
      stats: [
        { label: "Donacione totale", value: `EUR ${Math.round(totalIncoming).toLocaleString("sq-AL")}`, change: { value: `${incomingDonations.length} transaksione`, direction: "up" } },
        { label: "Kampanja aktive", value: campaigns.filter((c) => c.status === "ACTIVE").length, change: { value: `${campaigns.length} gjithsej`, direction: "neutral" } },
        { label: "Donatore", value: donorIds.size, change: { value: "nga DB", direction: "neutral" } },
        { label: "Shpallje aktive", value: volunteerListings.filter((v) => v.status === "ACTIVE").length, change: { value: `${volunteerListings.length} gjithsej`, direction: "neutral" } },
      ],
      donationTrend: Array.from(monthBuckets.values()),
      applicationsPerListing: volunteerListings.slice(0, 6).map((listing) => ({
        shpallja: listing.title.slice(0, 18),
        aplikime: listing._count.applications,
      })),
      topDonors: Array.from(donorMap.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map((donor) => ({
          name: donor.name,
          amount: `EUR ${Math.round(donor.amount).toLocaleString("sq-AL")}`,
          avatar: donor.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
        })),
      campaigns: campaigns.slice(0, 4).map((campaign) => {
        const realRaised = campaign.donations.reduce((sum, d) => sum + d.amount, 0);
        const realDonorCount = campaign.donations.length;
        return {
          id: campaign.id,
          slug: campaign.slug,
          title: campaign.title,
          image: campaign.images?.[0] ?? null,
          status: campaignUiStatus(campaign.status),
          raised: realRaised,
          goal: campaign.targetAmount,
          currency: "EUR",
          donorCount: realDonorCount,
          daysLeft: campaign.endsAt ? Math.max(0, Math.ceil((campaign.endsAt.getTime() - Date.now()) / 86400000)) : undefined,
        };
      }),
      activity,
    });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/dashboard/activity - Aktiviteti i plote i llogarise
router.get("/activity", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const [applications, donations, notifications] = await Promise.all([
      prisma.application.findMany({
        where: { OR: [{ applicantId: user.id }, { listing: { ownerId: user.id } }] },
        include: { applicant: { select: { name: true } }, listing: { select: { title: true, ownerId: true } } },
        orderBy: { updatedAt: "desc" },
        take: 50,
      }),
      prisma.donation.findMany({
        where: { OR: [{ donorId: user.id }, { campaign: { creatorId: user.id } }] },
        include: { donor: { select: { name: true } }, campaign: { select: { title: true, creatorId: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 }),
    ]);

    const items = [
      ...applications.map((application) => ({
        id: `application-${application.id}`,
        createdAt: application.updatedAt.toISOString(),
        actor: { name: application.listing.ownerId === user.id ? application.applicant.name : user.name },
        action: application.listing.ownerId === user.id ? "aplikoi per shpalljen tende" : "dergoi aplikim per",
        target: application.listing.title,
        timestamp: relativeTime(application.updatedAt),
      })),
      ...donations.map((donation) => ({
        id: `donation-${donation.id}`,
        createdAt: donation.createdAt.toISOString(),
        actor: { name: donation.campaign.creatorId === user.id ? donation.donor?.name ?? donation.guestName ?? "Guest" : user.name },
        action: donation.campaign.creatorId === user.id ? "dha donacion per" : "dhuroi per",
        target: donation.campaign.title,
        timestamp: relativeTime(donation.createdAt),
      })),
      ...notifications.map((notification) => ({
        id: `notification-${notification.id}`,
        createdAt: notification.createdAt.toISOString(),
        actor: { name: "Unify" },
        action: notification.title,
        target: notification.message,
        timestamp: relativeTime(notification.createdAt),
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ items });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/dashboard/support-ledger - Historiku dinamik i mbeshtetjes
router.get("/support-ledger", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const [ownedListings, myApplications, outgoingDonations, incomingDonations] = await Promise.all([
      prisma.volunteerListing.findMany({
        where: { ownerId: user.id },
        include: {
          applications: {
            include: {
              applicant: { select: { id: true, name: true, email: true } },
            },
            orderBy: { updatedAt: "desc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.application.findMany({
        where: { applicantId: user.id },
        include: {
          listing: {
            include: {
              owner: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.donation.findMany({
        where: { donorId: user.id },
        include: { campaign: { select: { id: true, title: true, slug: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.donation.findMany({
        where: { campaign: { creatorId: user.id } },
        include: { donor: { select: { id: true, name: true, email: true } }, campaign: { select: { id: true, title: true, slug: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const listingEntries = [
      ...ownedListings.flatMap((listing) =>
        listing.applications.map((application) => ({
          id: `owner-${application.id}`,
          sourceId: application.id,
          domain: domainFromKind(listing.kind),
          flow: flowForOwner(listing.kind),
          date: application.updatedAt.toISOString(),
          title: listing.title,
          counterparty: application.applicant.name,
          description: application.reason,
          valueLabel: listing.valueLabel || listing.conditions || listing.category,
          status: mapStatus(application.status),
          targetType: "APPLICATION",
          targetId: application.id,
        }))
      ),
      ...myApplications.map((application) => ({
        id: `applicant-${application.id}`,
        sourceId: application.id,
        domain: domainFromKind(application.listing.kind),
        flow: flowForApplicant(application.listing.kind),
        date: application.updatedAt.toISOString(),
        title: application.listing.title,
        counterparty: application.listing.owner.name,
        description: application.reason,
        valueLabel: application.listing.valueLabel || application.listing.conditions || application.listing.category,
        status: mapStatus(application.status),
        targetType: "APPLICATION",
        targetId: application.id,
      })),
    ];

    const donationEntries = [
      ...outgoingDonations.map((donation) => ({
        id: `donation-out-${donation.id}`,
        sourceId: donation.id,
        domain: "financial",
        flow: "outgoing",
        date: donation.createdAt.toISOString(),
        title: donation.campaign.title,
        counterparty: "Kampanje donacioni",
        description: donation.message || "Donacion financiar",
        valueLabel: `EUR ${donation.amount}`,
        status: donation.status === "SUCCEEDED" ? "completed" : donation.status.toLowerCase(),
        targetType: "DONATION",
        targetId: donation.id,
      })),
      ...incomingDonations.map((donation) => ({
        id: `donation-in-${donation.id}`,
        sourceId: donation.id,
        domain: "financial",
        flow: "incoming",
        date: donation.createdAt.toISOString(),
        title: donation.campaign.title,
        counterparty: donation.isAnonymous ? "Anonim" : donation.donor?.name || donation.guestName || "Guest",
        description: donation.message || "Donacion i pranuar",
        valueLabel: `EUR ${donation.amount}`,
        status: donation.status === "SUCCEEDED" ? "completed" : donation.status.toLowerCase(),
        targetType: "DONATION",
        targetId: donation.id,
      })),
    ];

    const entries = [...listingEntries, ...donationEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json({ entries });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/dashboard/transactions — Të gjitha transaksionet financiare të userit
//   Tabs: DONATION_OUT (kam dhuruar), DONATION_IN (mbledhur), TIP, WITHDRAWAL
router.get("/transactions", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const [outDonations, inDonations] = await Promise.all([
      prisma.donation.findMany({
        where: { donorId: user.id },
        include: { campaign: { select: { id: true, title: true, slug: true, creator: { select: { name: true, username: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      prisma.donation.findMany({
        where: { campaign: { creatorId: user.id } },
        include: { donor: { select: { id: true, name: true, username: true } }, campaign: { select: { id: true, title: true, slug: true } } },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
    ]);

    const transactions = [
      // DONATION_OUT
      ...outDonations.map((d) => ({
        id: `out-${d.id}`,
        kind: "DONATION_OUT" as const,
        amount: d.amount,
        currency: "EUR",
        campaignId: d.campaign.id,
        campaignSlug: d.campaign.slug,
        campaignTitle: d.campaign.title,
        counterparty: d.campaign.creator.username ? `@${d.campaign.creator.username}` : d.campaign.creator.name,
        status: d.status,
        method: d.stripePaymentIntentId ? "Stripe" : "—",
        createdAt: d.createdAt.toISOString(),
      })),
      // DONATION_IN
      ...inDonations.map((d) => ({
        id: `in-${d.id}`,
        kind: "DONATION_IN" as const,
        amount: d.amount,
        currency: "EUR",
        campaignId: d.campaign.id,
        campaignSlug: d.campaign.slug,
        campaignTitle: d.campaign.title,
        counterparty: d.isAnonymous ? "Anonim" : d.donor?.username ? `@${d.donor.username}` : d.donor?.name ?? d.guestName ?? "Guest",
        status: d.status,
        method: d.stripePaymentIntentId ? "Stripe" : "—",
        createdAt: d.createdAt.toISOString(),
      })),
      // TIP & WITHDRAWAL: TODO kur backend mban tip si Donation flag dhe Withdrawal model
    ];

    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(transactions);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/dashboard/audit-log — Audit log personal i userit
router.get("/audit-log", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Perdoruesi nuk u gjet" }); return; }

    const logs = await prisma.auditLog.findMany({
      where: { adminId: user.id },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    function categorize(action: string): "ACCOUNT" | "FINANCE" | "CAMPAIGN" | "SOCIAL" | "SYSTEM" {
      const a = action.toUpperCase();
      if (/(LOGIN|LOGOUT|PASSWORD|EMAIL|SIGNUP|REGISTER|VERIFY)/.test(a)) return "ACCOUNT";
      if (/(DONAT|PAY|TIP|WITHDRAW|REFUND)/.test(a)) return "FINANCE";
      if (/(CAMPAIGN|MILESTONE|LISTING|VOLUNTEER)/.test(a)) return "CAMPAIGN";
      if (/(MESSAGE|COMMENT|APPLY|REPORT|FOLLOW)/.test(a)) return "SOCIAL";
      return "SYSTEM";
    }

    const entries = logs.map((log) => ({
      id: log.id,
      timestamp: log.createdAt.toISOString(),
      actor: user.email,
      action: log.action,
      target: log.target,
      ip: "",
      severity: log.action.includes("BAN") || log.action.includes("DELETE") ? "warning" : "info",
      category: categorize(log.action),
      device: "",
      diff: log.details ? { details: log.details } : null,
    }));

    res.json({ entries });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

export default router;
