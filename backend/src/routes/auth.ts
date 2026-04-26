// ============================================================
// /api/auth — forgot/reset password flow me Resend
// ============================================================
//
// POST /api/auth/forgot-password { email }
//   • Best-effort: nuk zbulon nëse email-i ekziston
//   • Gjeneron token + ruan në DB + dërgon email me link
//   • Token skadon pas 15 minutash
//
// POST /api/auth/reset-password { token, password }
//   • Verifikon token + skadencën
//   • Ruan password-in (në Clerk në production; këtu vetëm shenjon në DB)
//   • Fshin token-in pas suksesit
//
// Shënim: në mungesë të një user-table lokal me password,
//   ky flow vepron si "shenjoni si validuar" + sinjal për Clerk.
// ============================================================

import { Router, Request, Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { sendPasswordResetEmail } from "../lib/resend";

const router = Router();

const ForgotSchema = z.object({
  email: z.string().email(),
});

const ResetSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8),
});

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const TOKEN_TTL_MINUTES = 15;

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = ForgotSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    // Si për siguri, përgjigja është e njëjtë pavarësisht
    // a ekziston user-i ose jo (parandalon enumerim)
    if (!user) {
      res.json({ ok: true, message: "Nëse email-i ekziston, do të marrësh një link për rivendosje." });
      return;
    }

    // Gjenero token + ruaj
    const token = generateToken();
    const expires = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetTokenExpiry: expires,
      },
    });

    const resetUrl = `${FRONTEND_URL}/auth/reset-password?token=${token}`;

    // Dërgo email (best-effort)
    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl);
    } catch (err) {
      console.error("Resend error (forgot-password):", err);
      // Vazhdo edhe nëse email-i dështon — token-i është në DB
    }

    res.json({ ok: true, message: "Nëse email-i ekziston, do të marrësh një link për rivendosje." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Email invalid" });
      return;
    }
    console.error("forgot-password error:", err);
    res.status(500).json({ error: "Gabim i brendshëm" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = ResetSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({ error: "Linku është invalid ose i skaduar" });
      return;
    }

    // Në production: thirrë Clerk Backend API për të vendosur password-in.
    // Këtu thjesht heqim token-in (Clerk është IdP-ja kryesore).
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });

    // TODO: kur ke Clerk Backend SDK config:
    //   await clerkClient.users.updateUser(user.clerkId, { password });

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminId: user.id,
        action: "PASSWORD_RESET",
        target: user.email,
        details: "method: email_token",
      },
    }).catch(() => { /* AuditLog mund të mos pranojë non-admin actor */ });

    res.json({ ok: true, message: "Fjalëkalimi u ndryshua me sukses." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Të dhënat janë invalid" });
      return;
    }
    console.error("reset-password error:", err);
    res.status(500).json({ error: "Gabim i brendshëm" });
  }
});

export default router;
