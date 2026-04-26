/**
 * test-crud.ts — Test komprehensiv i CRUD-it
 *
 * Krijon user-a të testit direkt në DB (anashkalon Clerk auth)
 * dhe teston flow-in e plotë admin → dashboard → public
 *
 * Përdorim:
 *   cd unify-backend
 *   npx ts-node scripts/test-crud.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE = "http://localhost:4000/api";

interface TestResult {
  name: string;
  ok: boolean;
  detail?: string;
}

const results: TestResult[] = [];

function log(name: string, ok: boolean, detail?: string) {
  results.push({ name, ok, detail });
  const icon = ok ? "✅" : "❌";
  const color = ok ? "\x1b[32m" : "\x1b[31m";
  console.log(`${color}${icon}\x1b[0m ${name}${detail ? ` — ${detail}` : ""}`);
}

async function get(path: string): Promise<{ status: number; data: unknown }> {
  const res = await fetch(`${BASE}${path}`);
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function main() {
  console.log("\n🧪 UNIFY CRUD TEST SUITE\n========================\n");

  // ── 0. Pastrim test data e mëparshme ──────────────────────────
  console.log("📋 Setup: pastim test data...");
  await prisma.application.deleteMany({ where: { listing: { title: { startsWith: "[TEST]" } } } });
  await prisma.donation.deleteMany({ where: { campaign: { title: { startsWith: "[TEST]" } } } });
  await prisma.message.deleteMany({ where: { conversation: { name: { startsWith: "[TEST]" } } } });
  await prisma.conversationParticipant.deleteMany({ where: { conversation: { name: { startsWith: "[TEST]" } } } });
  await prisma.conversation.deleteMany({ where: { name: { startsWith: "[TEST]" } } });
  await prisma.comment.deleteMany({ where: { campaign: { title: { startsWith: "[TEST]" } } } });
  await prisma.bookmark.deleteMany({ where: { campaign: { title: { startsWith: "[TEST]" } } } });
  await prisma.volunteerListing.deleteMany({ where: { title: { startsWith: "[TEST]" } } });
  await prisma.campaign.deleteMany({ where: { title: { startsWith: "[TEST]" } } });
  // Test useri-t mund të kenë audit logs nga rastet e mëparshme
  const oldUsers = await prisma.user.findMany({ where: { email: { contains: "test-crud" } } });
  if (oldUsers.length > 0) {
    const oldIds = oldUsers.map((u) => u.id);
    await prisma.auditLog.deleteMany({ where: { adminId: { in: oldIds } } });
    await prisma.notification.deleteMany({ where: { userId: { in: oldIds } } });
    await prisma.user.deleteMany({ where: { id: { in: oldIds } } });
  }

  // ── 1. Krijim users testues ──────────────────────────────────
  console.log("\n📋 Step 1: Krijim users testues");
  const alice = await prisma.user.create({
    data: {
      clerkId: "test-clerk-alice-" + Date.now(),
      email: "alice-test-crud@example.com",
      name: "Alice Test",
      username: "alice_test_" + Date.now().toString(36),
      role: "USER",
    },
  });
  log("Krijo user Alice (USER)", true, alice.username!);

  const bob = await prisma.user.create({
    data: {
      clerkId: "test-clerk-bob-" + Date.now(),
      email: "bob-test-crud@example.com",
      name: "Bob Test",
      username: "bob_test_" + Date.now().toString(36),
      role: "USER",
    },
  });
  log("Krijo user Bob (USER)", true, bob.username!);

  const adminUser = await prisma.user.create({
    data: {
      clerkId: "test-clerk-admin-" + Date.now(),
      email: "admin-test-crud@example.com",
      name: "Admin Test",
      username: "admin_test_" + Date.now().toString(36),
      role: "ADMIN",
    },
  });
  log("Krijo user Admin (ADMIN)", true, adminUser.username!);

  // ── 2. Public endpoints ──────────────────────────────────────
  console.log("\n📋 Step 2: Public endpoints (pa auth)");
  const stats = await get("/stats");
  log("GET /stats", stats.status === 200, JSON.stringify(stats.data));

  const campaigns = await get("/campaigns");
  const campArr = Array.isArray(campaigns.data) ? campaigns.data : (campaigns.data as { campaigns?: unknown[] })?.campaigns;
  log("GET /campaigns", campaigns.status === 200, `${Array.isArray(campArr) ? campArr.length : "?"} campaigns`);

  const vols = await get("/volunteers");
  const volArr = Array.isArray(vols.data) ? vols.data : (vols.data as { listings?: unknown[] })?.listings;
  log("GET /volunteers", vols.status === 200, `${Array.isArray(volArr) ? volArr.length : "?"} listings`);

  const blog = await get("/blog");
  log("GET /blog", blog.status === 200);

  // ── 3. Username search ────────────────────────────────────────
  console.log("\n📋 Step 3: Users search (frontend → /users/search)");
  const search = await get(`/users/search?q=alice_test`);
  const searchArr = Array.isArray(search.data) ? search.data : [];
  const foundAlice = searchArr.some((u: { username?: string }) => u.username === alice.username);
  log("GET /users/search?q=alice_test gjen Alice", foundAlice, `${searchArr.length} rezultate`);

  // ── 4. Profil publik ──────────────────────────────────────────
  console.log("\n📋 Step 4: Profil publik /users/:username");
  const profile = await get(`/users/${alice.username}`);
  log(
    "GET /users/:username (Alice)",
    profile.status === 200,
    profile.status === 200 ? `Found: ${(profile.data as { name?: string }).name}` : `Status ${profile.status}`
  );

  // ── 5. Reset password flow ────────────────────────────────────
  console.log("\n📋 Step 5: Reset password flow");
  const forgotRes = await fetch(`${BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: alice.email }),
  });
  log("POST /auth/forgot-password", forgotRes.status === 200);

  const aliceWithToken = await prisma.user.findUnique({ where: { id: alice.id } });
  log(
    "Token i ruajtur në DB",
    Boolean(aliceWithToken?.passwordResetToken),
    aliceWithToken?.passwordResetToken ? "token gjeneruar" : "ASGJË"
  );

  if (aliceWithToken?.passwordResetToken) {
    const resetRes = await fetch(`${BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: aliceWithToken.passwordResetToken, password: "newpass1234" }),
    });
    log("POST /auth/reset-password me token valid", resetRes.status === 200);

    const aliceAfter = await prisma.user.findUnique({ where: { id: alice.id } });
    log("Token fshirë pas reset", aliceAfter?.passwordResetToken === null);
  }

  // ── 6. Krijim kampanje (direct DB për shkak Clerk) ───────────
  console.log("\n📋 Step 6: Kampanjë lifecycle (CRUD)");
  const campaign = await prisma.campaign.create({
    data: {
      slug: "test-crud-" + Date.now(),
      title: "[TEST] Kampanja e testit",
      description: "Përshkrimi i testit i kampanjës. Min 50 karaktere blah blah blah.",
      shortDescription: "Test kampanjë e shkurtër",
      images: ["https://example.com/image1.jpg"],
      targetAmount: 1000,
      currentAmount: 0,
      category: "MEDICAL",
      location: "Prishtinë",
      isUrgent: false,
      status: "PENDING",
      creatorId: alice.id,
    },
  });
  log("CREATE Campaign (PENDING)", true, campaign.slug);

  // Public NUK duhet ta shohë (vetëm ACTIVE)
  const publicCampaigns = await get("/campaigns");
  const pubArr = Array.isArray(publicCampaigns.data) ? publicCampaigns.data : (publicCampaigns.data as { campaigns?: unknown[] })?.campaigns ?? [];
  const seenInPublic = (pubArr as { id?: string }[]).some((c) => c.id === campaign.id);
  log("Kampanja PENDING NUK shfaqet në public /campaigns", !seenInPublic);

  // Admin aprovon (direct DB)
  await prisma.campaign.update({ where: { id: campaign.id }, data: { status: "ACTIVE" } });
  log("UPDATE Campaign status → ACTIVE", true);

  // Tani public DUHET ta shohë
  const publicCampaigns2 = await get("/campaigns");
  const pubArr2 = Array.isArray(publicCampaigns2.data) ? publicCampaigns2.data : (publicCampaigns2.data as { campaigns?: unknown[] })?.campaigns ?? [];
  const seenAfterApproval = (pubArr2 as { id?: string }[]).some((c) => c.id === campaign.id);
  log("Kampanja ACTIVE shfaqet në public /campaigns", seenAfterApproval);

  // Donor dhuron
  const donation = await prisma.donation.create({
    data: {
      amount: 50,
      campaignId: campaign.id,
      donorId: bob.id,
      status: "SUCCEEDED",
      message: "Faleminderit!",
    },
  });
  await prisma.campaign.update({ where: { id: campaign.id }, data: { currentAmount: { increment: 50 } } });
  log("CREATE Donation (SUCCEEDED) + currentAmount++", true, `€${donation.amount}`);

  // ── 7. Volunteer Listing lifecycle ───────────────────────────
  console.log("\n📋 Step 7: Volunteer Listing lifecycle");
  const listing = await prisma.volunteerListing.create({
    data: {
      title: "[TEST] Dhuroj kompjuter",
      description: "Përshkrim i shpalljes së testit me min 20 karaktere",
      kind: "VOLUNTEER_CONTRIBUTION",
      subtype: "PHYSICAL_ITEM",
      category: "Pajisje elektronike",
      location: "Prishtinë",
      images: [],
      isAnonymous: false,
      status: "PENDING",
      ownerId: alice.id,
      helpDetails: { quantity: "1 copë", condition: "E mirë", pickupAddress: "Rr. test" },
    },
  });
  log("CREATE VolunteerListing (PENDING) + helpDetails", true);

  await prisma.volunteerListing.update({ where: { id: listing.id }, data: { status: "ACTIVE" } });

  const publicVols2 = await get("/volunteers");
  const volArr2 = Array.isArray(publicVols2.data) ? publicVols2.data : (publicVols2.data as { listings?: unknown[] })?.listings ?? [];
  const seenListing = (volArr2 as { id?: string }[]).some((v) => v.id === listing.id);
  log("Listing ACTIVE shfaqet në /volunteers", seenListing);

  // Bob aplikon
  const application = await prisma.application.create({
    data: {
      reason: "Më duhet kompjuter për fëmijën tim që studion",
      isAnonymous: false,
      applicantId: bob.id,
      listingId: listing.id,
      status: "PENDING",
    },
  });
  log("CREATE Application (Bob → listing)", true);

  // Owner pranon
  await prisma.application.update({ where: { id: application.id }, data: { status: "ACCEPTED" } });
  log("UPDATE Application → ACCEPTED", true);

  // ── 8. Inbox lifecycle (DM + GROUP) ──────────────────────────
  console.log("\n📋 Step 8: Inbox — DM + GROUP");
  const dm = await prisma.conversation.create({
    data: {
      type: "DIRECT",
      user1Id: alice.id,
      user2Id: bob.id,
    },
  });
  log("CREATE DM Conversation (Alice ↔ Bob)", true);

  await prisma.message.create({
    data: { conversationId: dm.id, senderId: alice.id, content: "Përshëndetje Bob!" },
  });
  await prisma.message.create({
    data: { conversationId: dm.id, senderId: bob.id, content: "Përshëndetje Alice!" },
  });
  log("CREATE 2 mesazhe në DM", true);

  const group = await prisma.conversation.create({
    data: {
      type: "GROUP",
      name: "[TEST] Grup testi",
      participants: {
        create: [
          { userId: alice.id, isAdmin: true },
          { userId: bob.id },
          { userId: adminUser.id },
        ],
      },
    },
    include: { participants: true },
  });
  log("CREATE GROUP me 3 participants", group.participants.length === 3, `${group.participants.length} anëtarë`);

  await prisma.message.create({
    data: { conversationId: group.id, senderId: alice.id, content: "Mirë se erdhët në grup!" },
  });
  log("CREATE mesazh në grup", true);

  // ── 9. Bookmark lifecycle ─────────────────────────────────────
  console.log("\n📋 Step 9: Bookmark");
  const bookmark = await prisma.bookmark.create({
    data: { userId: bob.id, campaignId: campaign.id },
  });
  log("CREATE Bookmark (Bob → campaign)", true);

  const bookmarks = await prisma.bookmark.findMany({ where: { userId: bob.id } });
  log("READ Bookmarks për Bob", bookmarks.length > 0, `${bookmarks.length} bookmarks`);

  await prisma.bookmark.delete({ where: { id: bookmark.id } });
  log("DELETE Bookmark", true);

  // ── 10. Comment lifecycle ─────────────────────────────────────
  console.log("\n📋 Step 10: Comments");
  const comment = await prisma.comment.create({
    data: { authorId: bob.id, campaignId: campaign.id, content: "Komenti im i testit" },
  });
  log("CREATE Comment", true);

  const comments = await prisma.comment.findMany({ where: { campaignId: campaign.id } });
  log("READ Comments për kampanjë", comments.length > 0, `${comments.length} komente`);

  // ── 11. Notification ──────────────────────────────────────────
  console.log("\n📋 Step 11: Notifications");
  const notif = await prisma.notification.create({
    data: {
      userId: alice.id,
      title: "Test njoftim",
      message: "Ky është një njoftim testi",
      type: "INFO",
    },
  });
  log("CREATE Notification", true);

  await prisma.notification.update({ where: { id: notif.id }, data: { readAt: new Date() } });
  log("UPDATE Notification → readAt", true);

  // ── 12. Audit Log ─────────────────────────────────────────────
  console.log("\n📋 Step 12: Audit Log");
  await prisma.auditLog.create({
    data: {
      adminId: adminUser.id,
      action: "TEST_ACTION",
      target: campaign.id,
      details: "Test audit entry",
    },
  });
  log("CREATE AuditLog entry", true);

  const logs = await prisma.auditLog.findMany({ where: { adminId: adminUser.id } });
  log("READ AuditLog për admin", logs.length > 0, `${logs.length} log entries`);

  // ── 13. Stats Sync ────────────────────────────────────────────
  console.log("\n📋 Step 13: Sinkronizimi i statistikave (admin ↔ public)");
  const stats2 = await get("/stats");
  log("GET /stats pasi shtuam të dhëna", stats2.status === 200, JSON.stringify(stats2.data));

  // ── Pastrim final ─────────────────────────────────────────────
  console.log("\n📋 Cleanup test data...");
  await prisma.application.deleteMany({ where: { listingId: listing.id } });
  await prisma.donation.deleteMany({ where: { campaignId: campaign.id } });
  await prisma.message.deleteMany({ where: { conversationId: { in: [dm.id, group.id] } } });
  await prisma.conversationParticipant.deleteMany({ where: { conversationId: group.id } });
  await prisma.conversation.deleteMany({ where: { id: { in: [dm.id, group.id] } } });
  await prisma.notification.delete({ where: { id: notif.id } });
  await prisma.comment.deleteMany({ where: { campaignId: campaign.id } });
  await prisma.volunteerListing.delete({ where: { id: listing.id } });
  await prisma.campaign.delete({ where: { id: campaign.id } });
  // Audit logs duhen fshirë para useri-t (FK constraint)
  await prisma.auditLog.deleteMany({ where: { adminId: { in: [alice.id, bob.id, adminUser.id] } } });
  await prisma.user.deleteMany({ where: { id: { in: [alice.id, bob.id, adminUser.id] } } });
  log("Cleanup OK", true);

  // ── PËRMBLEDHJE ───────────────────────────────────────────────
  console.log("\n========================");
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n📊 PËRMBLEDHJE: ${passed} kaluan, ${failed} dështuan`);
  if (failed > 0) {
    console.log("\nFailed tests:");
    results.filter((r) => !r.ok).forEach((r) => console.log(`   ❌ ${r.name}${r.detail ? ` — ${r.detail}` : ""}`));
  }
  console.log("");
  process.exit(failed > 0 ? 1 : 0);
}

main()
  .catch((err) => {
    console.error("❌ FATAL ERROR:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
