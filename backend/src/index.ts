import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

import { prisma } from "./lib/prisma";
import campaignRoutes from "./routes/campaigns";
import donationRoutes from "./routes/donations";
import volunteerRoutes from "./routes/volunteers";
import applicationRoutes from "./routes/applications";
import userRoutes from "./routes/users";
import messageRoutes from "./routes/messages";
import uploadRoutes from "./routes/uploads";
import adminRoutes from "./routes/admin";
import emailRoutes from "./routes/emails";
import webhookRoutes from "./routes/webhooks";
import blogRoutes from "./routes/blog";
import searchRoutes from "./routes/search";
import notificationRoutes from "./routes/notifications";
import dashboardRoutes from "./routes/dashboard";
import authRoutes from "./routes/auth";

const app = express();
const httpServer = createServer(app);

// Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Stripe webhook needs raw body — must be before express.json()
app.use("/api/webhooks/stripe", express.raw({ type: "application/json" }));

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET /api/stats — Statistikat publike të platformës (homepage)
app.get("/api/stats", async (_req, res) => {
  try {
    const [campaignCount, volunteerCount, donationSum] = await Promise.all([
      prisma.campaign.count({ where: { status: "ACTIVE" } }),
      prisma.volunteerListing.count({ where: { status: "ACTIVE" } }),
      prisma.donation.aggregate({
        where: { status: "SUCCEEDED" },
        _sum: { amount: true },
      }),
    ]);
    res.json({
      campaignCount,
      volunteerCount,
      totalDonated: Math.round(donationSum._sum.amount ?? 0),
    });
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// Routes
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/emails", emailRoutes);
app.use("/api/admin/blog", blogRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/webhooks", webhookRoutes);

// Socket.io — Inbox real-time
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
  });

  socket.on("leave_conversation", (conversationId: string) => {
    socket.leave(conversationId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io };

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
