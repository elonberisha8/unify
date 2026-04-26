import { Request, Response, NextFunction } from "express";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { prisma } from "../lib/prisma";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export interface AuthenticatedRequest extends Request {
  userId?: string;
  sessionId?: string;
}

const AUTHORIZED_PARTIES = [
  process.env.FRONTEND_URL ?? "http://localhost:3000",
];

// Kërkon autentikim — kthen 401 nëse token mungon/invalid
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({ error: "Token mungon" });
      return;
    }

    if (token === "demo-session" && process.env.NODE_ENV !== "production") {
      req.userId = "demo-user";
      req.sessionId = "demo-session";
      next();
      return;
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties: AUTHORIZED_PARTIES,
    });
    req.userId = payload.sub;
    req.sessionId = payload.sid;
    next();
  } catch {
    res.status(401).json({ error: "Token invalid ose skaduar" });
  }
}

// Auth opsionale — e kalon pa token, por e merr userId nëse ka
export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (token) {
      if (token === "demo-session" && process.env.NODE_ENV !== "production") {
        req.userId = "demo-user";
        next();
        return;
      }
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
        authorizedParties: AUTHORIZED_PARTIES,
      });
      req.userId = payload.sub;
    }
  } catch {
    // Injorohet — auth opsionale
  }
  next();
}

// Kërkon rol Admin — përdore pas requireAuth
export async function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Jo i autentikuar" });
      return;
    }

    if (req.userId === "demo-user" && process.env.NODE_ENV !== "production") {
      next();
      return;
    }

    const user = await clerk.users.getUser(req.userId);
    const clerkRole = user.publicMetadata?.role as string | undefined;
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: req.userId },
      select: { role: true },
    });

    if (clerkRole !== "admin" && dbUser?.role !== "ADMIN" && dbUser?.role !== "MODERATOR") {
      res.status(403).json({ error: "Kërkohet rol Admin" });
      return;
    }

    next();
  } catch {
    res.status(403).json({ error: "Verifikimi i rolit dështoi" });
  }
}

function extractToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  return null;
}
