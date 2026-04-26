import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findFirst({ where: { clerkId: "user_3Cu0sxxSfYebIs0NjfWcBTbGrhz" } })
  if (!admin) { console.error("❌ Admin user nuk u gjet"); process.exit(1) }

  const arta   = await prisma.user.findFirst({ where: { clerkId: "demo_user_arta" } })
  const besnik = await prisma.user.findFirst({ where: { clerkId: "demo_user_besnik" } })
  const flamur = await prisma.user.findFirst({ where: { clerkId: "demo_user_flamur" } })
  const gjyle  = await prisma.user.findFirst({ where: { clerkId: "demo_user_gjyle" } })
  const drita  = await prisma.user.findFirst({ where: { clerkId: "demo_user_drita" } })

  if (!arta || !besnik || !flamur || !gjyle || !drita) {
    console.error("❌ Demo userat nuk u gjetën — ekzekuto seed.ts fillimisht")
    process.exit(1)
  }

  // 1. Fshi kampanjat ekzistuese të adminit (me donacionet e tyre)
  const oldCampaigns = await prisma.campaign.findMany({ where: { creatorId: admin.id }, select: { id: true } })
  if (oldCampaigns.length > 0) {
    const ids = oldCampaigns.map((c) => c.id)
    await prisma.donation.deleteMany({ where: { campaignId: { in: ids } } })
    await prisma.campaign.deleteMany({ where: { id: { in: ids } } })
    console.log("🗑️  Kampanjat e vjetra të adminit u fshinë")
  }

  // 2. Krijo 3 kampanja reale për adminit me foto dhe të dhëna të plota
  const c1 = await prisma.campaign.create({
    data: {
      slug: "ndihma-emergjente-termet-2026",
      title: "Ndihma emergjente pas tërmetit — Durrës 2026",
      description: `Tërmeti i 7 majit 2026 me magnitudë 5.8 ka lënë mbi 400 familje pa strehë në rrethin e Durrësit. Shumë ndërtesa janë shpallur të banueshme, por 89 prej tyre janë shembur ose dëmtuar rëndë.

Fondet do të shpenzohen për:
• Strehim të përkohshëm — tende dhe kabina (15,000€)
• Ushqim dhe ujë të pijshëm për 30 ditë (8,000€)
• Mjekime dhe barnatore emergjente (5,000€)
• Transport dhe koordinim logjistik (2,000€)

Çdo donacion shkontribuon direkt në terren brenda 48 orëve.`,
      shortDescription: "400 familje pa strehë pas tërmetit 5.8 — ndihma emergjente urgjente.",
      images: [
        "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80",
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
        "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80",
      ],
      targetAmount: 30000,
      currentAmount: 0,
      category: "EMERGENCY",
      location: "Durrës, Shqipëri",
      isUrgent: true,
      isFeatured: true,
      status: "ACTIVE",
      problemStatement: "Tërmeti shkatërroi 89 ndërtesa dhe la 400 familje pa strehë.",
      targetGroup: "400 familje të shpërngulura, 1,200 persona",
      urgency: 10,
      expectedOutcome: "Strehim i sigurt, ushqim dhe kujdes mjekësor për të gjitha familjet brenda 30 ditëve.",
      verificationPlan: "Koordinim me Kryqin e Kuq dhe ISHSH. Raportime çdo 48 orë me foto nga terreni.",
      budgetBreakdown: JSON.stringify({
        items: [
          { label: "Strehim i përkohshëm", amount: 15000, percent: 50 },
          { label: "Ushqim dhe ujë", amount: 8000, percent: 27 },
          { label: "Mjekime emergjente", amount: 5000, percent: 17 },
          { label: "Logjistikë", amount: 2000, percent: 6 },
        ],
      }),
      faqs: JSON.stringify([
        { question: "Si garantohet shpërndarja e fondeve?", answer: "Bashkëpunojmë me Kryqin e Kuq dhe ISHSH për çdo shpenzim." },
        { question: "Sa shpejt shpërndahen fondet?", answer: "Brenda 48 orëve nga momenti i transferimit." },
      ]),
      partners: "Kryqi i Kuq Shqipëri, ISHSH, Bashkia Durrës",
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      creatorId: admin.id,
    },
  })

  const c2 = await prisma.campaign.create({
    data: {
      slug: "shkolla-digjitale-fshatrat",
      title: "Shkolla digjitale për fshatrat e largëta",
      description: `Projekti synon të pajisë 15 shkolla fillore në fshatrat malore të Shqipërisë dhe Kosovës me kompjuterë, internet dhe kurrikul digjital. Shumë nxënës në këto zona nuk kanë kurrë parë një kompjuter.

Çfarë bëjmë:
• Instalojmë 10 kompjuterë për çdo shkollë (150 total)
• Sigurojmë internet satelitor Starlink ku nuk ka rrjet
• Trajnojmë 45 mësues me certifikim digjital
• Ofrojmë platform mësimi online të personalizuar

Kjo nismë do të ndikojë 2,400 nxënës drejtpërdrejt.`,
      shortDescription: "15 shkolla rurale me kompjuterë, internet Starlink dhe trajnim mësuesish.",
      images: [
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
      ],
      targetAmount: 45000,
      currentAmount: 0,
      category: "EDUCATION",
      location: "Shqipëri & Kosovë (Zona rurale)",
      isUrgent: false,
      isFeatured: true,
      status: "ACTIVE",
      problemStatement: "2,400 nxënës pa akses në teknologji dhe arsim digjital.",
      targetGroup: "Nxënës klasa 1-9 në 15 shkolla rurale malore",
      urgency: 7,
      expectedOutcome: "150 kompjuterë të instaluar, 45 mësues të trajnuar, 2,400 nxënës me akses digjital.",
      verificationPlan: "Foto instalimi, liste nënshkrimi nxënësish, certifikata trajnimi mësuesish.",
      budgetBreakdown: JSON.stringify({
        items: [
          { label: "150 kompjuterë Lenovo", amount: 22500, percent: 50 },
          { label: "15 × Starlink + instalim", amount: 12000, percent: 27 },
          { label: "Trajnim mësuesish (45)", amount: 6750, percent: 15 },
          { label: "Platform mësimi + content", amount: 3750, percent: 8 },
        ],
      }),
      faqs: JSON.stringify([
        { question: "Si zgjidhen shkollat?", answer: "Bazuar në distancën nga qendra, mungesën e infrastrukturës dhe numrin e nxënësve." },
        { question: "A ka mirëmbajtje pas instalimit?", answer: "Po — kontratë 2-vjeçare mirëmbajtjeje përfshihet në buxhet." },
      ]),
      partners: "UNICEF Albania, Ministria e Arsimit, Fondacioni Soros Shqipëri",
      endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      creatorId: admin.id,
    },
  })

  const c3 = await prisma.campaign.create({
    data: {
      slug: "parku-i-ri-pedonale-prishtine",
      title: "Park i ri pedonale — Lagjja Kalabria, Prishtinë",
      description: `Lagjja Kalabria në Prishtinë me 8,000 banorë nuk ka asnjë hapësirë të gjelbër ose park për fëmijë. Fëmijët luajnë në rrugë dhe oborret e bllokuara.

Plani ynë:
• Shndërrimi i një parcele bosh komunale (2,000m²) në park
• Instalim i lojërave për fëmijë 3-12 vjeç
• 40 pemë dhe vegjetacion vendas
• Pista çiklizmi 200m
• Ndriçim solar dhe stola pushimi

Bashkia e Prishtinës ka dhënë leje dhe premtimin për mirëmbajtje afatgjatë.`,
      shortDescription: "Park 2,000m² me lojëra, pista çiklizmi dhe 40 pemë për 8,000 banorë.",
      images: [
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
        "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      ],
      targetAmount: 18000,
      currentAmount: 0,
      category: "COMMUNITY",
      location: "Prishtinë, Kosovë",
      isUrgent: false,
      isFeatured: false,
      status: "ACTIVE",
      problemStatement: "8,000 banorë pa asnjë hapësirë të gjelbër ose park fëmijësh.",
      targetGroup: "Familjet dhe fëmijët e lagjes Kalabria, Prishtinë",
      urgency: 6,
      expectedOutcome: "Park 2,000m² i hapur për publikun, 40 pemë të mbjella, 200m pistë çiklizmi.",
      verificationPlan: "Leja bashkiake e disponueshme. Kontratë ndërtimi me firmë lokale. Video-dokumentim i punimeve.",
      budgetBreakdown: JSON.stringify({
        items: [
          { label: "Lojëra fëmijësh dhe pajisje", amount: 7200, percent: 40 },
          { label: "40 pemë + vegjetacion", amount: 3600, percent: 20 },
          { label: "Rrugëzime dhe pista çiklizmi", amount: 3600, percent: 20 },
          { label: "Ndriçim solar", amount: 2160, percent: 12 },
          { label: "Stola dhe infrastrukturë", amount: 1440, percent: 8 },
        ],
      }),
      faqs: JSON.stringify([
        { question: "A ka leje bashkiake?", answer: "Po — leja është siguruar. Bashkia merr përsipër mirëmbajtjen pas hapjes." },
        { question: "Kur fillon ndërtimi?", answer: "Brenda 2 javësh nga arritja e synimit financiar." },
      ]),
      partners: "Bashkia e Prishtinës, Arkitektë pa Kufij, Shoqata e banorëve Kalabria",
      endsAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      creatorId: admin.id,
    },
  })

  console.log("✅ 3 kampanja u krijuan për adminit")

  // 3. Shto donacione realiste nga demo userat
  const now = new Date()
  const donations = [
    // Tërmeti — 18 donacione
    { pid: "adm_ter_01", cId: c1.id, dId: arta.id,   amount: 500,  msg: "Shpejt! Zoti i bekoftë!" },
    { pid: "adm_ter_02", cId: c1.id, dId: besnik.id, amount: 1000, msg: "Suksese në terren!" },
    { pid: "adm_ter_03", cId: c1.id, dId: flamur.id, amount: 300,  msg: null },
    { pid: "adm_ter_04", cId: c1.id,                 amount: 2000, anon: true, msg: "Nga diaspora shqiptare." },
    { pid: "adm_ter_05", cId: c1.id, dId: gjyle.id,  amount: 150,  msg: "Shpresoj të ndihmojë!" },
    { pid: "adm_ter_06", cId: c1.id,                 amount: 5000, anon: true },
    { pid: "adm_ter_07", cId: c1.id, dId: drita.id,  amount: 200,  msg: null },
    { pid: "adm_ter_08", cId: c1.id,                 amount: 100,  guest: "Arben Maloku" },
    { pid: "adm_ter_09", cId: c1.id, dId: arta.id,   amount: 750,  msg: "Ndihma e dytë — ju inkurajoj!" },
    { pid: "adm_ter_10", cId: c1.id,                 amount: 500,  guest: "Vjosa Kelmendi" },
    { pid: "adm_ter_11", cId: c1.id, dId: besnik.id, amount: 250,  msg: null },
    { pid: "adm_ter_12", cId: c1.id,                 amount: 3000, anon: true, msg: "Forcë!" },
    { pid: "adm_ter_13", cId: c1.id, dId: flamur.id, amount: 400,  msg: "Bashkë jemi më të fortë!" },
    { pid: "adm_ter_14", cId: c1.id,                 amount: 1500, guest: "Genc Bylykbashi" },
    { pid: "adm_ter_15", cId: c1.id, dId: gjyle.id,  amount: 200,  msg: "Suksese!" },
    { pid: "adm_ter_16", cId: c1.id,                 amount: 800,  anon: true },
    { pid: "adm_ter_17", cId: c1.id, dId: drita.id,  amount: 350,  msg: null },
    { pid: "adm_ter_18", cId: c1.id,                 amount: 600,  guest: "Mimoza Halili" },

    // Shkolla digjitale — 14 donacione
    { pid: "adm_shk_01", cId: c2.id, dId: besnik.id, amount: 2000, msg: "Investimi më i mirë — arsimi!" },
    { pid: "adm_shk_02", cId: c2.id, dId: arta.id,   amount: 500,  msg: null },
    { pid: "adm_shk_03", cId: c2.id,                 amount: 5000, anon: true, msg: "Nga kompania jonë." },
    { pid: "adm_shk_04", cId: c2.id, dId: flamur.id, amount: 300,  msg: "Kauzë e shkëlqyer!" },
    { pid: "adm_shk_05", cId: c2.id,                 amount: 1000, guest: "Liridon Berisha" },
    { pid: "adm_shk_06", cId: c2.id, dId: gjyle.id,  amount: 750,  msg: "Suksese nga Zvicra!" },
    { pid: "adm_shk_07", cId: c2.id,                 amount: 3000, anon: true },
    { pid: "adm_shk_08", cId: c2.id, dId: drita.id,  amount: 200,  msg: "Pak por me zemër." },
    { pid: "adm_shk_09", cId: c2.id,                 amount: 1500, guest: "Teuta Shala" },
    { pid: "adm_shk_10", cId: c2.id, dId: arta.id,   amount: 400,  msg: null },
    { pid: "adm_shk_11", cId: c2.id,                 amount: 2500, anon: true, msg: "Ndërtoni të ardhmen!" },
    { pid: "adm_shk_12", cId: c2.id, dId: besnik.id, amount: 1000, msg: null },
    { pid: "adm_shk_13", cId: c2.id,                 amount: 600,  guest: "Artan Brahimi" },
    { pid: "adm_shk_14", cId: c2.id, dId: flamur.id, amount: 800,  msg: "E dyta kontribut!" },

    // Parku — 10 donacione
    { pid: "adm_prk_01", cId: c3.id, dId: gjyle.id,  amount: 500,  msg: "Laguera jone meritton!" },
    { pid: "adm_prk_02", cId: c3.id, dId: arta.id,   amount: 200,  msg: null },
    { pid: "adm_prk_03", cId: c3.id,                 amount: 1000, anon: true },
    { pid: "adm_prk_04", cId: c3.id, dId: drita.id,  amount: 150,  msg: "Fëmijët e mi do ta shijojnë!" },
    { pid: "adm_prk_05", cId: c3.id,                 amount: 2000, guest: "Nexhat Osmani" },
    { pid: "adm_prk_06", cId: c3.id, dId: besnik.id, amount: 300,  msg: null },
    { pid: "adm_prk_07", cId: c3.id,                 amount: 500,  anon: true, msg: "Për lagjen tonë!" },
    { pid: "adm_prk_08", cId: c3.id, dId: flamur.id, amount: 250,  msg: "Suksese!" },
    { pid: "adm_prk_09", cId: c3.id,                 amount: 750,  guest: "Dafina Kryeziu" },
    { pid: "adm_prk_10", cId: c3.id, dId: gjyle.id,  amount: 400,  msg: null },
  ]

  // Shto donacionet me data të ndryshme (6 muajt e fundit)
  for (let i = 0; i < donations.length; i++) {
    const d = donations[i]
    const daysAgo = Math.floor(Math.random() * 150) // deri 5 muaj mbrapa
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    await prisma.donation.upsert({
      where: { stripePaymentIntentId: d.pid },
      update: {},
      create: {
        stripePaymentIntentId: d.pid,
        campaignId: d.cId,
        donorId: (d as any).dId ?? undefined,
        amount: d.amount,
        status: "SUCCEEDED",
        message: (d as any).msg ?? null,
        isAnonymous: (d as any).anon ?? false,
        guestName: (d as any).guest ?? null,
        createdAt,
      },
    })
  }
  console.log("✅ 42 donacione demo u shtuan")

  // 4. Rillogarit currentAmount
  for (const c of [c1, c2, c3]) {
    const agg = await prisma.donation.aggregate({
      where: { campaignId: c.id, status: "SUCCEEDED" },
      _sum: { amount: true },
    })
    const real = agg._sum.amount ?? 0
    await prisma.campaign.update({ where: { id: c.id }, data: { currentAmount: real } })
  }

  // 5. Shto shpallje vullnetare për adminit
  const existingListings = await prisma.volunteerListing.count({ where: { ownerId: admin.id } })
  if (existingListings === 0) {
    await prisma.volunteerListing.createMany({
      data: [
        {
          title: "Koordinator vullnetar terren — Durrës",
          description: "Koordinon shpërndarjen e ndihmave në terren. Nevojitet 2 javë prezencë fizike.",
          subtype: "SERVICE",
          category: "EMERGENCY",
          kind: "VOLUNTEER_CONTRIBUTION",
          location: "Durrës, Shqipëri",
          status: "ACTIVE",
          isAnonymous: false,
          ownerId: admin.id,
          images: ["https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80"],
          conditions: "Disponueshëm 2 javë, me makinë personale",
        },
        {
          title: "Fotograf/Videograf dokumentarist",
          description: "Dokumenton punimet e parkut dhe ndikimin në komunitet. Projekti zgjat 3 muaj.",
          subtype: "SERVICE",
          category: "COMMUNITY",
          kind: "VOLUNTEER_CONTRIBUTION",
          location: "Prishtinë, Kosovë",
          status: "ACTIVE",
          isAnonymous: false,
          ownerId: admin.id,
          images: ["https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80"],
          conditions: "Kamera profesionale e nevojshme",
        },
        {
          title: "Mësues IT për shkollat rurale",
          description: "Trajnon mësuesit e shkollave rurale në përdorimin e kompjuterit dhe platformave online.",
          subtype: "SERVICE",
          category: "EDUCATION",
          kind: "VOLUNTEER_CONTRIBUTION",
          location: "Shqipëri (Zona rurale)",
          status: "ACTIVE",
          isAnonymous: false,
          ownerId: admin.id,
          images: ["https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"],
          conditions: "Eksperiencë me IT dhe dëshirë për të udhëtuar",
        },
      ],
    })
    console.log("✅ 3 shpallje vullnetare u shtuan")
  }

  // 6. Shto aplikime demo
  const listings = await prisma.volunteerListing.findMany({ where: { ownerId: admin.id } })
  for (const listing of listings) {
    const count = await prisma.application.count({ where: { listingId: listing.id } })
    if (count === 0) {
      await prisma.application.createMany({
        data: [
          { listingId: listing.id, applicantId: arta.id,   reason: "Kam eksperiencë në fushë dhe dëshiroj të kontribuoj.", status: "PENDING" },
          { listingId: listing.id, applicantId: besnik.id, reason: "I dedikuar dhe i disponueshëm menjëherë.",             status: "ACCEPTED" },
          { listingId: listing.id, applicantId: flamur.id, reason: "Kjo kauzë është afër zemrës sime.",                    status: "PENDING" },
        ],
      })
    }
  }
  console.log("✅ Aplikime demo u shtuan")

  // 7. Shfaq rezultatin
  console.log("\n📊 Dashboard i adminit tani ka:")
  for (const c of [c1, c2, c3]) {
    const updated = await prisma.campaign.findUnique({ where: { id: c.id }, select: { title: true, currentAmount: true, targetAmount: true, _count: { select: { donations: true } } } })
    if (updated) {
      const pct = Math.round((updated.currentAmount / updated.targetAmount) * 100)
      console.log(`  🟢 ${updated.title.slice(0, 45).padEnd(45)} €${updated.currentAmount}/${updated.targetAmount} (${pct}%) — ${updated._count.donations} donatorë`)
    }
  }
  console.log(`\n  📋 ${listings.length} shpallje vullnetare`)
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1) })
  .finally(() => prisma.$disconnect())
