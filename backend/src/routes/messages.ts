import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { sendNewMessageEmail } from "../lib/resend";
import { io } from "../index";

const router = Router();

const SendMessageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1).max(1000),
});

const StartConversationSchema = z.object({
  username: z.string().min(3).max(30),
  content: z.string().min(1).max(1000).optional(),
});

function orderedPair(a: string, b: string) {
  return a < b ? [a, b] : [b, a];
}

// Helper: Mapo Conversation (DM ose GROUP) në strukturën që pret frontend-i
async function mapConversation(conversation: {
  id: string;
  type: "DIRECT" | "GROUP";
  name: string | null;
  image: string | null;
  user1?: { id: string; name: string; image: string | null; username: string | null } | null;
  user2?: { id: string; name: string; image: string | null; username: string | null } | null;
  participants?: Array<{ user: { id: string; name: string; image: string | null; username: string | null } }>;
  messages: Array<{ id: string; content: string; senderId: string; createdAt: Date; sender?: { username: string | null } | null }>;
  updatedAt: Date;
}, currentUserId: string) {
  // Përfundim listë participants — DIRECT përdor user1/user2, GROUP përdor relation
  let participants: Array<{ id: string; username: string; name: string; image: string | null }> = [];
  if (conversation.type === "GROUP") {
    participants = (conversation.participants ?? []).map((p) => ({
      id: p.user.id,
      username: p.user.username ?? "",
      name: p.user.name,
      image: p.user.image,
    }));
  } else {
    if (conversation.user1) participants.push({
      id: conversation.user1.id,
      username: conversation.user1.username ?? "",
      name: conversation.user1.name,
      image: conversation.user1.image,
    });
    if (conversation.user2) participants.push({
      id: conversation.user2.id,
      username: conversation.user2.username ?? "",
      name: conversation.user2.name,
      image: conversation.user2.image,
    });
  }

  const last = conversation.messages[0];
  const lastMessage = last
    ? {
        id: last.id,
        content: last.content,
        senderId: last.senderId,
        senderUsername: last.sender?.username ?? "",
        createdAt: last.createdAt.toISOString(),
      }
    : null;

  return {
    id: conversation.id,
    type: conversation.type,
    name: conversation.name,
    image: conversation.image,
    participants,
    lastMessage,
    unreadCount: 0, // TODO: count messages > readAt për këtë user
    updatedAt: conversation.updatedAt.toISOString(),
  };
}

// GET /api/messages/conversations — Lista e bisedave (DM + GROUP)
router.get("/conversations", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Përdoruesi nuk u gjet" }); return; }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: user.id },
          { user2Id: user.id },
          { participants: { some: { userId: user.id } } },
        ],
      },
      include: {
        user1: { select: { id: true, name: true, image: true, username: true } },
        user2: { select: { id: true, name: true, image: true, username: true } },
        participants: {
          include: { user: { select: { id: true, name: true, image: true, username: true } } },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: { username: true } } },
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const mapped = await Promise.all(conversations.map((c) => mapConversation(c as never, user.id)));
    res.json(mapped);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// POST /api/messages/groups — Krijo grup
const CreateGroupSchema = z.object({
  name: z.string().min(1).max(80),
  memberIds: z.array(z.string()).min(2).max(50),
  firstMessage: z.string().min(1).max(1000).optional(),
});

router.post("/groups", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, memberIds, firstMessage } = CreateGroupSchema.parse(req.body);

    const creator = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!creator) { res.status(404).json({ error: "Krijuesi nuk u gjet" }); return; }

    // Validimi: memberIds mund të mos përfshijnë vetë-krijuesin (do shtohet automatikisht)
    const allMemberIds = Array.from(new Set([creator.id, ...memberIds]));

    // Verifiko që të gjithë useri-t ekzistojnë
    const validUsers = await prisma.user.findMany({
      where: { id: { in: allMemberIds }, isBanned: false },
      select: { id: true },
    });
    if (validUsers.length !== allMemberIds.length) {
      res.status(400).json({ error: "Disa anëtarë nuk u gjetën ose janë të bllokuar" });
      return;
    }

    // Krijo grupin
    const conversation = await prisma.conversation.create({
      data: {
        type: "GROUP",
        name: name.trim(),
        participants: {
          create: allMemberIds.map((uid) => ({
            userId: uid,
            isAdmin: uid === creator.id,
          })),
        },
      },
      include: {
        user1: { select: { id: true, name: true, image: true, username: true } },
        user2: { select: { id: true, name: true, image: true, username: true } },
        participants: {
          include: { user: { select: { id: true, name: true, image: true, username: true } } },
        },
        messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: { select: { username: true } } } },
      },
    });

    if (firstMessage?.trim()) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: creator.id,
          content: firstMessage.trim(),
        },
      });
    }

    const mapped = await mapConversation(conversation as never, creator.id);
    res.status(201).json({ conversation: mapped });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    console.error("create group error:", err);
    res.status(500).json({ error: "Gabim" });
  }
});

// GET /api/messages/conversations/:conversationId — Mesazhet e bisedës
// POST /api/messages/start - Fillo DM duke perdorur username unik
router.post("/start", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, content } = StartConversationSchema.parse(req.body);

    const sender = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!sender) { res.status(404).json({ error: "Derguesi nuk u gjet" }); return; }

    const receiver = await prisma.user.findUnique({ where: { username: username.trim().toLowerCase() } });
    if (!receiver) { res.status(404).json({ error: "Nuk u gjet perdorues me kete username" }); return; }
    if (receiver.id === sender.id) { res.status(400).json({ error: "Nuk mund t'i shkruash vetes" }); return; }

    const [user1Id, user2Id] = orderedPair(sender.id, receiver.id);
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: sender.id, user2Id: receiver.id },
          { user1Id: receiver.id, user2Id: sender.id },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({ data: { user1Id, user2Id } });
    }

    let message = null;
    if (content?.trim()) {
      message = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: sender.id,
          content: content.trim(),
        },
        include: {
          sender: { select: { id: true, name: true, image: true, username: true } },
        },
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });

      io.to(conversation.id).emit("new_message", message);

      if (receiver.email) {
        await sendNewMessageEmail(receiver.email, sender.name);
      }
    }

    const fullConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        user1: { select: { id: true, name: true, image: true, username: true } },
        user2: { select: { id: true, name: true, image: true, username: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        _count: { select: { messages: true } },
      },
    });

    res.status(201).json({ conversation: fullConversation, message });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: "Gabim" });
  }
});

// Helper: kontrollon nëse useri është pjesë e bisedës (DM ose GROUP)
async function userInConversation(userId: string, conversationId: string): Promise<boolean> {
  const c = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: { where: { userId } } },
  });
  if (!c) return false;
  if (c.type === "DIRECT") {
    return c.user1Id === userId || c.user2Id === userId;
  }
  return c.participants.length > 0;
}

router.get("/conversations/:conversationId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!user) { res.status(404).json({ error: "Përdoruesi nuk u gjet" }); return; }

    if (!(await userInConversation(user.id, req.params.conversationId))) {
      res.status(403).json({ error: "Pa leje" });
      return;
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.conversationId },
      include: {
        sender: { select: { id: true, name: true, image: true, username: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch {
    res.status(500).json({ error: "Gabim" });
  }
});

// POST /api/messages/conversations/:id — Dërgo mesazh (DM ose GROUP)
router.post("/conversations/:conversationId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const content = z.string().min(1).max(1000).parse(req.body.content);
    const sender = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!sender) { res.status(404).json({ error: "Derguesi nuk u gjet" }); return; }

    if (!(await userInConversation(sender.id, req.params.conversationId))) {
      res.status(403).json({ error: "Pa leje" });
      return;
    }

    const message = await prisma.message.create({
      data: {
        conversationId: req.params.conversationId,
        senderId: sender.id,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, image: true, username: true } },
      },
    });

    await prisma.conversation.update({
      where: { id: req.params.conversationId },
      data: { updatedAt: new Date() },
    });

    io.to(req.params.conversationId).emit("new_message", message);
    res.status(201).json(message);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: "Gabim" });
  }
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { receiverId, content } = SendMessageSchema.parse(req.body);

    const sender = await prisma.user.findUnique({ where: { clerkId: req.userId } });
    if (!sender) { res.status(404).json({ error: "Dërguesi nuk u gjet" }); return; }

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) { res.status(404).json({ error: "Marrësi nuk u gjet" }); return; }

    // Gjej ose krijo bisedë
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: sender.id, user2Id: receiverId },
          { user1Id: receiverId, user2Id: sender.id },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { user1Id: sender.id, user2Id: receiverId },
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: sender.id,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    // Përditëso updatedAt të bisedës
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    // Emit Socket.io event
    io.to(conversation.id).emit("new_message", message);

    // Email njoftim
    if (receiver.email) {
      await sendNewMessageEmail(receiver.email, sender.name);
    }

    res.status(201).json(message);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors });
      return;
    }
    res.status(500).json({ error: "Gabim" });
  }
});

export default router;
