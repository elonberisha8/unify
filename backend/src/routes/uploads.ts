import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// GET /api/uploads/signature — Merr signature për Cloudinary upload direkt nga browser
// Cloudinary firmos upload-in në server — frontendi i dërgon direkt te Cloudinary
router.get("/signature", requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const { v2: cloudinary } = await import("cloudinary");

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "unify/campaigns";

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    );

    res.json({
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch {
    res.status(500).json({ error: "Gabim gjatë gjenerimit të signature" });
  }
});

// GET /api/uploads/qr?url=... — Gjenero QR Code me logo Unify
router.get("/qr", async (req, res: Response) => {
  try {
    const { url } = req.query;
    if (!url) { res.status(400).json({ error: "URL kërkohet" }); return; }

    // TODO: Gjenero QR me logo Unify embedded dhe ngarko te Cloudinary
    // Për MVP: kthen placeholder
    res.json({ qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(String(url))}` });
  } catch {
    res.status(500).json({ error: "Gabim gjatë gjenerimit të QR" });
  }
});

export default router;
