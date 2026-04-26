/**
 * Seed script — të dhëna demo për Unify
 * Ekzekuto: npx tsx scripts/seed.ts [clerk-id-yt]
 *
 * Argumenti opsional: Clerk ID i userit tënd (p.sh. user_2xyz...)
 * Nëse nuk e jep, useri i parë ekzistues me email pronar bëhet ADMIN.
 */

import { PrismaClient, CampaignCategory, CampaignStatus, VolunteerStatus, VolunteerSubtype, ListingKind } from "@prisma/client"
import * as dotenv from "dotenv"
dotenv.config()

const prisma = new PrismaClient()

const YOUR_CLERK_ID = process.argv[2] ?? null

async function main() {
  console.log("🌱 Duke filluar seed-in...\n")

  // ── 1. ADMIN USER ──────────────────────────────────────────────────────────
  let adminUser = YOUR_CLERK_ID
    ? await prisma.user.upsert({
        where: { clerkId: YOUR_CLERK_ID },
        update: { role: "ADMIN" },
        create: {
          clerkId: YOUR_CLERK_ID,
          email: "admin@unify.al",
          name: "Unify Admin",
          username: "unify_admin",
          role: "ADMIN",
          isVerified: true,
        },
      })
    : await prisma.user.findFirst({ where: { role: "ADMIN" } }) ??
      await prisma.user.findFirst({ orderBy: { createdAt: "asc" } })

  if (!adminUser) {
    // Krijoj admin placeholder nëse databaza është bosh
    adminUser = await prisma.user.create({
      data: {
        clerkId: "placeholder_admin_replace_me",
        email: "admin@unify.al",
        name: "Unify Admin",
        username: "unify_admin",
        role: "ADMIN",
        isVerified: true,
      },
    })
    console.log("⚠️  U krijua admin placeholder. Ekzekuto sërish me Clerk ID-në tënde: npx tsx scripts/seed.ts user_XXXX\n")
  } else {
    await prisma.user.update({ where: { id: adminUser.id }, data: { role: "ADMIN" } })
    console.log(`✅ Admin: ${adminUser.name} (${adminUser.email}) — roli u vendos ADMIN`)
  }

  // ── 2. DEMO USERAT ─────────────────────────────────────────────────────────
  const demoUsers = await Promise.all([
    prisma.user.upsert({
      where: { clerkId: "demo_user_arta" },
      update: {},
      create: {
        clerkId: "demo_user_arta",
        email: "arta.berisha@demo.al",
        name: "Arta Berisha",
        username: "arta_berisha",
        bio: "Aktiviste sociale nga Prishtina.",
        location: "Prishtinë",
        isVerified: true,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { clerkId: "demo_user_besnik" },
      update: {},
      create: {
        clerkId: "demo_user_besnik",
        email: "besnik.gashi@demo.al",
        name: "Besnik Gashi",
        username: "besnik_gashi",
        bio: "Mjek familjar, vullnetar i dedikuar.",
        location: "Tiranë",
        isVerified: true,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { clerkId: "demo_user_drita" },
      update: {},
      create: {
        clerkId: "demo_user_drita",
        email: "drita.hoxha@demo.al",
        name: "Drita Hoxha",
        username: "drita_hoxha",
        bio: "Mësuese dhe organizatore eventesh.",
        location: "Shkodër",
        isVerified: false,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { clerkId: "demo_user_flamur" },
      update: {},
      create: {
        clerkId: "demo_user_flamur",
        email: "flamur.krasniqi@demo.al",
        name: "Flamur Krasniqi",
        username: "flamur_krasniqi",
        bio: "Inxhinier dhe dashamirës i kauzave mjedisore.",
        location: "Prizren",
        isVerified: true,
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { clerkId: "demo_user_gjyle" },
      update: {},
      create: {
        clerkId: "demo_user_gjyle",
        email: "gjyle.morina@demo.al",
        name: "Gjylë Morina",
        username: "gjyle_morina",
        bio: "Punonjëse sociale, fokusohet tek fëmijët.",
        location: "Gjakovë",
        isVerified: true,
        role: "USER",
      },
    }),
  ])
  console.log(`✅ ${demoUsers.length} usera demo u krijuan/përditësuan`)

  const [arta, besnik, drita, flamur, gjyle] = demoUsers

  // ── 3. KAMPANJAT PENDING (për aprovim) ────────────────────────────────────
  const pendingCampaigns = await Promise.all([
    prisma.campaign.upsert({
      where: { slug: "ndihmo-familjen-murati" },
      update: {},
      create: {
        slug: "ndihmo-familjen-murati",
        title: "Ndihmo Familjen Murati pas zjarrit",
        description: "Familja Murati nga Mitrovica humbi gjithçka nga një zjarr tragjik natën e 15 prillit. Kanë nevojë urgjente për strehim dhe furnizime bazë. Katër fëmijë dhe dy të moshuar janë pa çati mbi kokë.",
        shortDescription: "Familje e dëmtuar nga zjarri — kanë nevojë urgjente për strehim.",
        images: ["https://images.unsplash.com/photo-1584467735871-8e4ef5e2c5e8?w=800"],
        targetAmount: 8000,
        currentAmount: 0,
        category: CampaignCategory.EMERGENCY,
        location: "Mitrovicë",
        isUrgent: true,
        status: CampaignStatus.PENDING,
        problemStatement: "Zjarri shkatërroi gjithçka — shtëpinë, rrobat dhe dokumentat.",
        expectedOutcome: "Familja do të ketë strehim të sigurt dhe furnizime bazë për 6 muajt e ardhshëm.",
        creatorId: arta.id,
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.campaign.upsert({
      where: { slug: "bursa-per-studentet-rome" },
      update: {},
      create: {
        slug: "bursa-per-studentet-rome",
        title: "Bursa arsimore për studentët rom",
        description: "Programi jonë synon të mbështesë 20 studentë të komunitetit rom me bursa të plota vjetore. Shumë prej tyre kanë rezultate shkëlqyese por nuk kanë mundësi financiare për të vazhduar studimet universitare.",
        shortDescription: "20 bursa universitare për studentë të komunitetit rom.",
        images: ["https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800"],
        targetAmount: 15000,
        currentAmount: 0,
        category: CampaignCategory.EDUCATION,
        location: "Shqipëri",
        isUrgent: false,
        status: CampaignStatus.PENDING,
        problemStatement: "Studentët me rezultate të mira nuk kanë akses financiar në arsim universitar.",
        expectedOutcome: "20 studentë do të marrin bursa vjetore dhe do të mbarojnë universitetin.",
        creatorId: besnik.id,
        endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.campaign.upsert({
      where: { slug: "pajisje-mjekesore-spitali-gjakove" },
      update: {},
      create: {
        slug: "pajisje-mjekesore-spitali-gjakove",
        title: "Pajisje mjekësore për spitalin e Gjakovës",
        description: "Spitali rajonal i Gjakovës ka nevojë urgjente për një aparat EKG të ri dhe monitorë të shtretërve të kujdesit intensiv. Pajisjet aktuale janë 15 vjeçare dhe dështojnë rregullisht duke rrezikuar jetën e pacientëve.",
        shortDescription: "Aparat EKG dhe monitorë për njësinë e kujdesit intensiv.",
        images: ["https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800"],
        targetAmount: 22000,
        currentAmount: 0,
        category: CampaignCategory.MEDICAL,
        location: "Gjakovë",
        isUrgent: true,
        status: CampaignStatus.PENDING,
        problemStatement: "Pajisjet e vjetra rrezikojnë trajtimin e pacientëve kritikë.",
        expectedOutcome: "Spitali do të ketë pajisje moderne që do të shpëtojnë jetë.",
        creatorId: gjyle.id,
        endsAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
    }),
  ])
  console.log(`✅ ${pendingCampaigns.length} kampanja PENDING u krijuan (gati për aprovim)`)

  // ── 4. KAMPANJAT AKTIVE (të aprovuara, të shfaqura publikisht) ────────────
  const activeCampaigns = await Promise.all([
    prisma.campaign.upsert({
      where: { slug: "pastrim-lumi-drini" },
      update: {},
      create: {
        slug: "pastrim-lumi-drini",
        title: "Pastrim i lumit Drini — bashkë mundemi!",
        description: "Projekti ynë synon të pastrojë 15km të bregut të lumit Drini nga mbeturinat plastike. Kemi planifikuar 3 aksione masive me vullnetarë nga gjithë rajoni. Fondet do të përdoren për pajisje pastrimi, kamion transporti dhe trajtim të mbeturinave.",
        shortDescription: "Pastrim 15km bregut të lumit Drini me aksione vullnetare.",
        images: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800"],
        targetAmount: 5000,
        currentAmount: 2340,
        category: CampaignCategory.ENVIRONMENT,
        location: "Shkodër",
        isUrgent: false,
        isFeatured: true,
        status: CampaignStatus.ACTIVE,
        problemStatement: "Lumi Drini është ndotuar rëndë nga mbeturinat plastike.",
        expectedOutcome: "15km bregut të pastër, 3 aksione vullnetare, rritje ndërgjegjësimi.",
        creatorId: drita.id,
        endsAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.campaign.upsert({
      where: { slug: "lodra-per-femije-shtepite" },
      update: {},
      create: {
        slug: "lodra-per-femije-shtepite",
        title: "Lodra dhe libra për fëmijët e shtëpive",
        description: "Dhurojmë lodra, libra dhe materiale shkollore për 150 fëmijë në shtëpitë e fëmijëve të Kosovës. Çdo fëmijë meriton gëzim dhe mundësi të mësuarit. Bashkohuni me ne për të ndriçuar fytyrat e tyre!",
        shortDescription: "Lodra dhe libra për 150 fëmijë të shtëpive.",
        images: ["https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800"],
        targetAmount: 3500,
        currentAmount: 3500,
        category: CampaignCategory.COMMUNITY,
        location: "Kosovë",
        isUrgent: false,
        isFeatured: true,
        status: CampaignStatus.ACTIVE,
        problemStatement: "Fëmijët e shtëpive nuk kanë lodra dhe materiale shkollore.",
        expectedOutcome: "150 fëmijë do të marrin lodra, libra dhe material shkollor.",
        creatorId: flamur.id,
        endsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.campaign.upsert({
      where: { slug: "kamp-veror-femije-rural" },
      update: {},
      create: {
        slug: "kamp-veror-femije-rural",
        title: "Kamp veror për fëmijët e zonave rurale",
        description: "Organizojmë kampin e parë veror falas për 80 fëmijë të zonave rurale të Shqipërisë. 10 ditë aktivitete, sport, arte dhe miqësi. Shumë prej tyre kurrë nuk kanë dalë nga fshati.",
        shortDescription: "10 ditë kamp veror falas për 80 fëmijë rural.",
        images: ["https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800"],
        targetAmount: 12000,
        currentAmount: 7800,
        category: CampaignCategory.EDUCATION,
        location: "Tiranë",
        isUrgent: false,
        isFeatured: false,
        status: CampaignStatus.ACTIVE,
        problemStatement: "Fëmijët rural nuk kanë akses në aktivitete verore dhe socializim.",
        expectedOutcome: "80 fëmijë do të marrin pjesë në kamp falas me aktivitete të ndryshme.",
        creatorId: besnik.id,
        endsAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      },
    }),
  ])
  console.log(`✅ ${activeCampaigns.length} kampanja AKTIVE u krijuan`)

  // ── 5. DONACIONE DEMO (për kampanjat aktive) ─────────────────────────────
  const [lumDrini, lodrat, kampVeror] = activeCampaigns
  await Promise.all([
    prisma.donation.upsert({
      where: { stripePaymentIntentId: "demo_pi_001" },
      update: {},
      create: {
        amount: 50,
        status: "SUCCEEDED",
        stripePaymentIntentId: "demo_pi_001",
        message: "Suksese me projektin!",
        donorId: arta.id,
        campaignId: lumDrini.id,
      },
    }),
    prisma.donation.upsert({
      where: { stripePaymentIntentId: "demo_pi_002" },
      update: {},
      create: {
        amount: 100,
        status: "SUCCEEDED",
        stripePaymentIntentId: "demo_pi_002",
        isAnonymous: true,
        campaignId: lumDrini.id,
      },
    }),
    prisma.donation.upsert({
      where: { stripePaymentIntentId: "demo_pi_003" },
      update: {},
      create: {
        amount: 200,
        status: "SUCCEEDED",
        stripePaymentIntentId: "demo_pi_003",
        message: "Të gjitha fëmijëve suksese!",
        donorId: flamur.id,
        campaignId: lodrat.id,
      },
    }),
    prisma.donation.upsert({
      where: { stripePaymentIntentId: "demo_pi_004" },
      update: {},
      create: {
        amount: 500,
        status: "SUCCEEDED",
        stripePaymentIntentId: "demo_pi_004",
        donorId: besnik.id,
        campaignId: kampVeror.id,
      },
    }),
  ])
  console.log("✅ 4 donacione demo u shtuan")

  // ── 6. VOLUNTEER LISTINGS ─────────────────────────────────────────────────
  await Promise.all([
    prisma.volunteerListing.upsert({
      where: { id: "demo_vol_001" },
      update: {},
      create: {
        id: "demo_vol_001",
        title: "Mësues vullnetar — Matematikë Klasa 6",
        description: "Kemi nevojë për mësues vullnetar të matematikës për fëmijë të klasës 6 çdo të shtunë 10:00-12:00. Njohuritë bazë të matematikës dhe dashuria për fëmijët janë gjithçka që duhet!",
        kind: ListingKind.VOLUNTEER_CONTRIBUTION,
        subtype: VolunteerSubtype.SERVICE,
        category: "Arsim",
        location: "Tiranë",
        organization: "Qendra Arsimore 'Drita'",
        remote: false,
        images: [],
        status: VolunteerStatus.ACTIVE,
        ownerId: drita.id,
      },
    }),
    prisma.volunteerListing.upsert({
      where: { id: "demo_vol_002" },
      update: {},
      create: {
        id: "demo_vol_002",
        title: "Rroba fëmijësh — madhësi 4-10 vjeç",
        description: "Ofrojmë rroba fëmijësh të pastëra dhe në gjendje të mirë, madhësi 4-10 vjeç. Kanë nevojë familje me fëmijë që janë në vështirësi. Mund të tërhiqen çdo ditë pune 9:00-17:00.",
        kind: ListingKind.VOLUNTEER_CONTRIBUTION,
        subtype: VolunteerSubtype.PHYSICAL_ITEM,
        category: "Veshje",
        location: "Prishtinë",
        remote: false,
        images: [],
        status: VolunteerStatus.ACTIVE,
        ownerId: arta.id,
      },
    }),
    prisma.volunteerListing.upsert({
      where: { id: "demo_vol_003" },
      update: {},
      create: {
        id: "demo_vol_003",
        title: "Kërkojmë ndihmë transport për të moshuarin",
        description: "Nënë 78 vjeçare ka nevojë për transport dy herë në javë (të martën dhe të enjten) nga shtëpia deri te klinika për trajtime rutinore. Distanca rreth 5km. Çdo ndihmë pranohet me mirënjohje.",
        kind: ListingKind.SUPPORT_REQUEST,
        subtype: VolunteerSubtype.SERVICE,
        category: "Transport",
        location: "Shkodër",
        remote: false,
        images: [],
        status: VolunteerStatus.PENDING,
        ownerId: gjyle.id,
      },
    }),
  ])
  console.log("✅ 3 volunteer listings u shtuan")

  // ── 7. AUDIT LOG ENTRIES ──────────────────────────────────────────────────
  await prisma.auditLog.createMany({
    skipDuplicates: true,
    data: [
      { id: "demo_audit_001", adminId: adminUser.id, action: "SEED_DATA_CREATED", target: "system", details: "Të dhëna demo u shtuan nga seed script" },
    ],
  })
  console.log("✅ Audit log u regjistrua")

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("🎉 Seed u kompletua!")
  console.log(`   Admin: ${adminUser.name} (${adminUser.email})`)
  console.log(`   Role: ${adminUser.role} → ADMIN`)
  console.log(`   Kampanja PENDING: ${pendingCampaigns.length} (gati për aprovim)`)
  console.log(`   Kampanja AKTIVE:  ${activeCampaigns.length}`)
  console.log(`   Volunteer listings: 3`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("\n▶ Hapi tjetër:")
  console.log("  1. Shko te /admin/kampanjat")
  console.log("  2. Aprovo kampanjat PENDING")
  console.log("  3. Kampanjat do të shfaqen publikisht\n")
}

main()
  .catch((e) => { console.error("❌ Seed dështoi:", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
