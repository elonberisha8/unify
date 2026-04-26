import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin, AuthenticatedRequest } from "../middleware/auth";
import { resend } from "../lib/resend";

const router = Router();

// Të gjitha routes kërkojnë auth + admin
router.use(requireAuth);
router.use(requireAdmin);

const FROM_EMAIL = "Unify <noreply@unify.ks>";

const SendEmailSchema = z.object({
  templateId: z.string().optional(),
  subject: z.string().min(1).max(200),
  htmlBody: z.string().min(1),
  audience: z.enum(["ALL_USERS", "ALL_CREATORS", "CAMPAIGN_DONORS", "BY_LOCATION", "INDIVIDUAL"]),
  audienceRef: z.string().optional(), // campaignId / lokacioni / userId
});

const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  subject: z.string().min(1).max(200),
  htmlBody: z.string().min(1),
});

// ─── TEMPLATES ────────────────────────────────────────────────────────────────

// GET /api/admin/emails/templates
router.get("/templates", async (_req, res: Response) => {
  try {
    const templates = await prisma.emailTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(templates);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// POST /api/admin/emails/templates
router.post("/templates", async (req, res: Response) => {
  try {
    const data = CreateTemplateSchema.parse(req.body);
    const template = await prisma.emailTemplate.create({ data });
    res.status(201).json(template);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    res.status(500).json({ error: "Gabim" });
  }
});

// PUT/PATCH /api/admin/emails/templates/:id (alias)
async function updateTemplate(req: AuthenticatedRequest, res: Response) {
  try {
    const data = CreateTemplateSchema.partial().parse(req.body);
    const template = await prisma.emailTemplate.update({
      where: { id: req.params.id },
      data,
    });
    res.json(template);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    res.status(500).json({ error: "Gabim" });
  }
}
router.put("/templates/:id", updateTemplate);
router.patch("/templates/:id", updateTemplate);

// DELETE /api/admin/emails/templates/:id
router.delete("/templates/:id", async (req, res: Response) => {
  try {
    await prisma.emailTemplate.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ deleted: true });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// ─── SEND ─────────────────────────────────────────────────────────────────────

// POST /api/admin/emails/send
router.post("/send", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = SendEmailSchema.parse(req.body);

    const admin = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!admin) { res.status(404).json({ error: "Admin nuk u gjet" }); return; }

    // Merr listën e destinatarëve sipas audiencës
    const recipients = await getRecipients(data.audience, data.audienceRef);

    if (recipients.length === 0) {
      res.status(400).json({ error: "Nuk u gjet asnjë destinatar" });
      return;
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const user of recipients) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: data.subject,
          html: data.htmlBody
            .replace(/\{\{name\}\}/g, user.name)
            .replace(/\{\{email\}\}/g, user.email),
        });
        sentCount++;
        // Delay 100ms — Resend free tier: 100 email/ditë
        await new Promise((r) => setTimeout(r, 100));
      } catch (emailErr) {
        errors.push(`Dështoi: ${user.email}`);
      }
    }

    // Ruaj log-un
    await prisma.emailLog.create({
      data: {
        subject: data.subject,
        htmlBody: data.htmlBody,
        audience: data.audience,
        audienceRef: data.audienceRef,
        recipientCount: sentCount,
        status: errors.length === recipients.length ? "FAILED" : "SENT",
        sentById: admin.id,
        templateId: data.templateId,
      },
    });

    res.json({
      sent: sentCount,
      total: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.errors }); return; }
    res.status(500).json({ error: "Gabim gjatë dërgimit" });
  }
});

// ─── LOGS ─────────────────────────────────────────────────────────────────────

// GET /api/admin/emails/logs
router.get("/logs", async (_req, res: Response) => {
  try {
    const logs = await prisma.emailLog.findMany({
      include: {
        sentBy: { select: { id: true, name: true } },
        template: { select: { id: true, name: true } },
      },
      orderBy: { sentAt: "desc" },
      take: 50,
    });
    // Mapo strukturën që pret frontend-i
    const mapped = logs.map((log) => ({
      id: log.id,
      subject: log.subject ?? log.template?.name ?? "—",
      recipients: Array.isArray(log.recipients) ? log.recipients.length : (log.recipients as unknown as number) ?? 0,
      status: log.status ?? "SENT",
      sentAt: log.sentAt.toISOString(),
      sentBy: log.sentBy?.name ?? "Admin",
      templateId: log.templateId ?? null,
    }));
    res.json(mapped);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/admin/emails/scheduled — Email automatike (cron triggers)
router.get("/scheduled", async (_req, res: Response) => {
  // TODO: kur ke ScheduledEmail model. Tani kthe listë boshe.
  res.json([]);
});

// PATCH /api/admin/emails/scheduled/:id — Aktivizo/çaktivizo trigger
router.patch("/scheduled/:id", async (_req, res: Response) => {
  // TODO: ScheduledEmail model
  res.json({ ok: true });
});

// ─── HELPER ──────────────────────────────────────────────────────────────────

async function getRecipients(
  audience: string,
  audienceRef?: string
): Promise<{ email: string; name: string }[]> {
  switch (audience) {
    case "ALL_USERS":
      return prisma.user.findMany({
        where: { isBanned: false },
        select: { email: true, name: true },
      });

    case "ALL_CREATORS":
      return prisma.user.findMany({
        where: { isVerified: true, isBanned: false },
        select: { email: true, name: true },
      });

    case "CAMPAIGN_DONORS":
      if (!audienceRef) return [];
      const donations = await prisma.donation.findMany({
        where: { campaignId: audienceRef, status: "SUCCEEDED", donor: { isBanned: false } },
        include: { donor: { select: { email: true, name: true } } },
        distinct: ["donorId"],
      });
      return donations
        .filter((d) => d.donor)
        .map((d) => ({ email: d.donor!.email, name: d.donor!.name }));

    case "BY_LOCATION":
      if (!audienceRef) return [];
      return prisma.user.findMany({
        where: { location: { contains: audienceRef, mode: "insensitive" }, isBanned: false },
        select: { email: true, name: true },
      });

    case "INDIVIDUAL":
      if (!audienceRef) return [];
      const user = await prisma.user.findUnique({
        where: { id: audienceRef },
        select: { email: true, name: true },
      });
      return user ? [user] : [];

    default:
      return [];
  }
}

export default router;
