import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import {
  sendDonationReceivedEmail,
  sendCampaignCompletedEmail,
} from "../lib/resend";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// POST /api/webhooks/stripe — Stripe webhook
// Shënim: body është raw (application/json) — konfiguruar në index.ts
router.post("/stripe", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    res.status(400).json({ error: "Webhook signature invalid" });
    return;
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const { campaignId, donorId, isAnonymous, message, guestName } = pi.metadata;

        const amountEur = pi.amount / 100;

        // Gjej donatorin (nëse ka llogari)
        let donorDbId: string | null = null;
        if (donorId !== "guest") {
          const user = await prisma.user.findUnique({ where: { clerkId: donorId } });
          donorDbId = user?.id || null;
        }

        // Krijo donacionin
        const donation = await prisma.donation.create({
          data: {
            campaignId,
            donorId: donorDbId,
            amount: amountEur,
            isAnonymous: isAnonymous === "true",
            message: message || null,
            guestName: guestName || null,
            stripePaymentIntentId: pi.id,
            status: "SUCCEEDED",
          },
        });

        // Përditëso currentAmount të kampanjës
        const campaign = await prisma.campaign.update({
          where: { id: campaignId },
          data: { currentAmount: { increment: amountEur } },
          include: { creator: true },
        });

        // Dërgo email te krijuesi
        const donorName = isAnonymous === "true"
          ? "Anonim"
          : guestName || (donorDbId
            ? (await prisma.user.findUnique({ where: { id: donorDbId }, select: { name: true } }))?.name || "Anonim"
            : "Anonim");

        if (campaign.creator.email) {
          await sendDonationReceivedEmail(
            campaign.creator.email,
            campaign.title,
            amountEur,
            donorName
          );
        }

        // Kontrollo nëse target u arrit
        if (campaign.currentAmount >= campaign.targetAmount) {
          await prisma.campaign.update({
            where: { id: campaignId },
            data: { status: "COMPLETED" },
          });

          if (campaign.creator.email) {
            await sendCampaignCompletedEmail(
              campaign.creator.email,
              campaign.title,
              campaign.currentAmount
            );
          }
        }

        console.log(`✅ Donation ${donation.id} recorded — €${amountEur} for ${campaignId}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const { campaignId } = pi.metadata;

        await prisma.donation.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { status: "FAILED" },
        }).catch(() => null); // Injorohet nëse nuk ekziston

        console.log(`❌ Payment failed for campaign ${campaignId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Gabim gjatë procesimit të webhook" });
  }
});

export default router;
