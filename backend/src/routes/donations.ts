import { Router, Response } from "express";
import Stripe from "stripe";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, optionalAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const CreateDonationSchema = z.object({
  campaignId: z.string(),
  amount: z.number().min(1),
  isAnonymous: z.boolean().default(false),
  message: z.string().max(500).optional(),
  guestName: z.string().optional(), // vetëm për guest (pa llogari)
  tipPercent: z.number().min(0).max(10).default(0),
});

// POST /api/donations/create-payment-intent
router.post("/create-payment-intent", optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = CreateDonationSchema.parse(req.body);

    const campaign = await prisma.campaign.findUnique({
      where: { id: data.campaignId },
      include: { creator: true },
    });

    if (!campaign || campaign.status !== "ACTIVE") {
      res.status(404).json({ error: "Kampanja nuk u gjet ose nuk është aktive" });
      return;
    }

    const tipAmount = Math.round(data.amount * (data.tipPercent / 100) * 100); // në cents
    const campaignAmount = Math.round(data.amount * 100); // në cents
    const totalAmount = campaignAmount + tipAmount;

    const platformFeePercent = parseInt(process.env.STRIPE_PLATFORM_FEE_PERCENT || "5");
    const platformFee = Math.round(campaignAmount * (platformFeePercent / 100));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "eur",
      application_fee_amount: platformFee,
      transfer_data: {
        destination: campaign.creator.stripeAccountId!,
      },
      metadata: {
        campaignId: data.campaignId,
        donorId: req.userId || "guest",
        isAnonymous: String(data.isAnonymous),
        message: data.message || "",
        guestName: data.guestName || "",
        tipAmount: String(tipAmount),
        tipPercent: String(data.tipPercent),
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: "Gabim gjatë krijimit të pagesës" });
  }
});

// GET /api/donations/my — Donacionet e userit të loguar
router.get("/my", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Përdoruesi nuk u gjet" }); return; }

    const donations = await prisma.donation.findMany({
      where: { donorId: user.id },
      include: {
        campaign: { select: { id: true, title: true, slug: true, images: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(donations);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// POST /api/donations/record — Thirret nga Next.js webhook pas pagesës
router.post("/record", async (req, res: Response) => {
  const secret = req.headers["x-webhook-secret"];
  if (secret !== (process.env.WEBHOOK_INTERNAL_SECRET ?? "unify-internal")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { campaignId, donorClerkId, amount, isAnonymous, message, guestName, stripePaymentIntentId } = req.body;

    if (!campaignId || !amount || !stripePaymentIntentId) {
      res.status(400).json({ error: "campaignId, amount dhe stripePaymentIntentId janë të detyrueshme" });
      return;
    }

    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId }, include: { creator: true } });
    if (!campaign) {
      res.status(404).json({ error: "Kampanja nuk u gjet" });
      return;
    }

    // Mos ruan dy herë të njëjtin PaymentIntent
    const existing = await prisma.donation.findUnique({ where: { stripePaymentIntentId } });
    if (existing) {
      res.json({ ok: true, duplicate: true });
      return;
    }

    let donorDbId: string | null = null;
    if (donorClerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId: donorClerkId } });
      donorDbId = user?.id ?? null;
    }

    const donation = await prisma.donation.create({
      data: {
        campaignId,
        donorId:               donorDbId,
        amount:                Number(amount),
        isAnonymous:           Boolean(isAnonymous),
        message:               message ?? null,
        guestName:             guestName ?? null,
        stripePaymentIntentId,
        status:                "SUCCEEDED",
      },
    });

    // Përditëso currentAmount (increment i sigurt)
    await prisma.campaign.update({
      where: { id: campaignId },
      data:  { currentAmount: { increment: Number(amount) } },
    });

    // Njoftim te krijuesi
    await prisma.notification.create({
      data: {
        userId:     campaign.creatorId,
        title:      "Donacion i ri!",
        message:    `€${amount} nga ${isAnonymous ? "Anonim" : guestName || "një donator"}`,
        type:       "DONATION",
        targetType: "Campaign",
        targetId:   campaignId,
      },
    }).catch(() => null);

    res.json({ ok: true, donationId: donation.id });
  } catch (err) {
    console.error("record donation error:", err);
    res.status(500).json({ error: "Gabim duke ruajtur donacionin" });
  }
});

export default router;
