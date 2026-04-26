import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  // 1. Rregullo currentAmount për ÇDO kampanjë — gjithmonë = SUM i donacioneve SUCCEEDED
  const campaigns = await prisma.campaign.findMany({ select: { id: true, slug: true, currentAmount: true } })

  let fixedCount = 0
  for (const c of campaigns) {
    const agg = await prisma.donation.aggregate({
      where: { campaignId: c.id, status: "SUCCEEDED" },
      _sum: { amount: true },
    })
    const real = agg._sum.amount ?? 0
    if (real !== c.currentAmount) {
      await prisma.campaign.update({ where: { id: c.id }, data: { currentAmount: real } })
      console.log(`  ✅ ${c.slug}: ${c.currentAmount} → ${real}`)
      fixedCount++
    }
  }
  if (fixedCount === 0) console.log("  Të gjitha kampanjat janë të sinkronizuara.")

  // 2. Përditëso foton e kampanjës "Ndihmo Familjen Murati" me foto që përshtaten me përshkrimin
  await prisma.campaign.update({
    where: { slug: "ndihmo-familjen-murati" },
    data: {
      images: [
        "https://images.unsplash.com/photo-1635350736475-c8cef4b21906?w=800&q=80", // shtëpi e djegur
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80", // komunitet ndihmon
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80", // familje në nevojë
      ],
    },
  })
  console.log("\n  ✅ Foto e 'Ndihmo Familjen Murati' u përditësua")

  // 3. Shto donacione demo realiste për kampanjat aktive (nëse nuk kanë)
  const lumDrini = await prisma.campaign.findUnique({ where: { slug: "pastrim-lumi-drini" } })
  const lodrat   = await prisma.campaign.findUnique({ where: { slug: "lodra-per-femije-shtepite" } })
  const kampVeror = await prisma.campaign.findUnique({ where: { slug: "kamp-veror-femije-rural" } })
  const arta     = await prisma.user.findFirst({ where: { clerkId: "demo_user_arta" } })
  const besnik   = await prisma.user.findFirst({ where: { clerkId: "demo_user_besnik" } })
  const flamur   = await prisma.user.findFirst({ where: { clerkId: "demo_user_flamur" } })
  const gjyle    = await prisma.user.findFirst({ where: { clerkId: "demo_user_gjyle" } })
  const drita    = await prisma.user.findFirst({ where: { clerkId: "demo_user_drita" } })

  if (lumDrini && arta && besnik && gjyle) {
    const existing = await prisma.donation.count({ where: { campaignId: lumDrini.id } })
    if (existing < 8) {
      await prisma.donation.createMany({
        skipDuplicates: true,
        data: [
          { stripePaymentIntentId: "demo_lum_01", campaignId: lumDrini.id, donorId: arta.id,   amount: 50,  status: "SUCCEEDED", message: "Suksese!" },
          { stripePaymentIntentId: "demo_lum_02", campaignId: lumDrini.id, donorId: besnik.id, amount: 100, status: "SUCCEEDED", isAnonymous: false },
          { stripePaymentIntentId: "demo_lum_03", campaignId: lumDrini.id, donorId: gjyle.id,  amount: 200, status: "SUCCEEDED", message: "Projekt i rëndësishëm!" },
          { stripePaymentIntentId: "demo_lum_04", campaignId: lumDrini.id,                     amount: 150, status: "SUCCEEDED", isAnonymous: true },
          { stripePaymentIntentId: "demo_lum_05", campaignId: lumDrini.id, donorId: flamur.id, amount: 75,  status: "SUCCEEDED" },
          { stripePaymentIntentId: "demo_lum_06", campaignId: lumDrini.id,                     amount: 500, status: "SUCCEEDED", isAnonymous: true, message: "Mbajeni punën e mirë!" },
          { stripePaymentIntentId: "demo_lum_07", campaignId: lumDrini.id, donorId: drita?.id ?? arta.id, amount: 30, status: "SUCCEEDED" },
          { stripePaymentIntentId: "demo_lum_08", campaignId: lumDrini.id,                     amount: 25,  status: "SUCCEEDED", guestName: "Arbër Lushi" },
        ],
      })
      console.log("  ✅ 8 donacione u shtuan për 'pastrim-lumi-drini'")
    }
  }

  if (lodrat && flamur && arta) {
    const existing = await prisma.donation.count({ where: { campaignId: lodrat.id } })
    if (existing < 6) {
      await prisma.donation.createMany({
        skipDuplicates: true,
        data: [
          { stripePaymentIntentId: "demo_lod_01", campaignId: lodrat.id, donorId: flamur.id, amount: 200, status: "SUCCEEDED", message: "Të gjitha fëmijëve suksese!" },
          { stripePaymentIntentId: "demo_lod_02", campaignId: lodrat.id, donorId: arta.id,   amount: 100, status: "SUCCEEDED" },
          { stripePaymentIntentId: "demo_lod_03", campaignId: lodrat.id,                     amount: 500, status: "SUCCEEDED", isAnonymous: true },
          { stripePaymentIntentId: "demo_lod_04", campaignId: lodrat.id, donorId: gjyle?.id ?? flamur.id, amount: 150, status: "SUCCEEDED", message: "Kauzë e bukur!" },
          { stripePaymentIntentId: "demo_lod_05", campaignId: lodrat.id,                     amount: 1000, status: "SUCCEEDED", isAnonymous: true },
          { stripePaymentIntentId: "demo_lod_06", campaignId: lodrat.id,                     amount: 75,  status: "SUCCEEDED", guestName: "Mimoza Halili" },
        ],
      })
      console.log("  ✅ 6 donacione u shtuan për 'lodra-per-femije-shtepite'")
    }
  }

  if (kampVeror && besnik && flamur) {
    const existing = await prisma.donation.count({ where: { campaignId: kampVeror.id } })
    if (existing < 7) {
      await prisma.donation.createMany({
        skipDuplicates: true,
        data: [
          { stripePaymentIntentId: "demo_kamp_01", campaignId: kampVeror.id, donorId: besnik.id, amount: 500,  status: "SUCCEEDED" },
          { stripePaymentIntentId: "demo_kamp_02", campaignId: kampVeror.id, donorId: flamur.id, amount: 300,  status: "SUCCEEDED", message: "Kauza e duhur!" },
          { stripePaymentIntentId: "demo_kamp_03", campaignId: kampVeror.id,                     amount: 1000, status: "SUCCEEDED", isAnonymous: true },
          { stripePaymentIntentId: "demo_kamp_04", campaignId: kampVeror.id, donorId: arta?.id ?? besnik.id, amount: 200, status: "SUCCEEDED" },
          { stripePaymentIntentId: "demo_kamp_05", campaignId: kampVeror.id,                     amount: 250,  status: "SUCCEEDED", isAnonymous: true },
          { stripePaymentIntentId: "demo_kamp_06", campaignId: kampVeror.id,                     amount: 150,  status: "SUCCEEDED", guestName: "Gent Shala" },
          { stripePaymentIntentId: "demo_kamp_07", campaignId: kampVeror.id, donorId: gjyle?.id ?? flamur.id, amount: 75, status: "SUCCEEDED" },
        ],
      })
      console.log("  ✅ 7 donacione u shtuan për 'kamp-veror-femije-rural'")
    }
  }

  // 4. Rillogarit currentAmount pas donacioneve të reja
  console.log("\n🔄 Rillogarit currentAmount për të gjitha kampanjat...")
  const allCampaigns = await prisma.campaign.findMany({ select: { id: true, slug: true } })
  for (const c of allCampaigns) {
    const agg = await prisma.donation.aggregate({
      where: { campaignId: c.id, status: "SUCCEEDED" },
      _sum: { amount: true },
    })
    const real = agg._sum.amount ?? 0
    await prisma.campaign.update({ where: { id: c.id }, data: { currentAmount: real } })
  }

  // 5. Shfaq gjendjen finale
  console.log("\n📊 Gjendja finale:\n")
  const final = await prisma.campaign.findMany({
    select: { slug: true, title: true, currentAmount: true, targetAmount: true, status: true, _count: { select: { donations: true } } },
    orderBy: { createdAt: "asc" },
  })
  for (const c of final) {
    const pct = Math.round((c.currentAmount / c.targetAmount) * 100)
    console.log(`  ${c.status === "ACTIVE" ? "🟢" : "🟡"} ${c.title.slice(0, 40).padEnd(40)} €${c.currentAmount}/${c.targetAmount} (${pct}%) — ${c._count.donations} donatorë`)
  }
}

main()
  .catch((e) => { console.error("❌", e); process.exit(1) })
  .finally(() => prisma.$disconnect())
