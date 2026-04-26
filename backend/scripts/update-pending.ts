import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  // Fshij kampanjat PENDING ekzistuese dhe rikrijoji të plota
  await prisma.campaign.deleteMany({
    where: { slug: { in: ["ndihmo-familjen-murati", "bursa-per-studentet-rome", "pajisje-mjekesore-spitali-gjakove"] } },
  })
  console.log("🗑️  Kampanjat e vjetra PENDING u fshinë")

  const admin = await prisma.user.findFirst({ where: { clerkId: "user_3Cu0sxxSfYebIs0NjfWcBTbGrhz" } })
  if (!admin) { console.error("Admin user nuk u gjet"); process.exit(1) }

  const arta   = await prisma.user.findFirst({ where: { clerkId: "demo_user_arta" } })
  const besnik = await prisma.user.findFirst({ where: { clerkId: "demo_user_besnik" } })
  const gjyle  = await prisma.user.findFirst({ where: { clerkId: "demo_user_gjyle" } })

  if (!arta || !besnik || !gjyle) { console.error("Demo userat nuk u gjetën — ekzekuto seed.ts fillimisht"); process.exit(1) }

  await prisma.campaign.createMany({
    data: [
      {
        slug: "ndihmo-familjen-murati",
        title: "Ndihmo Familjen Murati pas zjarrit",
        description: `Natën e 15 prillit 2026, familja Murati nga lagja Kodra e Trimave në Mitrovicë humbi gjithçka nga një zjarr i shkaktuar nga një defekt elektrik. Shtëpia 4-dhomëshe u dogj tërësisht brenda 40 minutave. Babai Agim (47 vjeç), nëna Lirije (44 vjeç) dhe katër fëmijët e tyre — Erza (16), Ardiani (13), Rona (9) dhe Blendi (5) — arritën të shpëtojnë vetëm me rrobat e trupit.

Familja aktualisht jeton tek të afërmit, por kjo situatë nuk mund të zgjasë. Kanë nevojë urgjente për:
• Qiranë 6-mujore të një apartamenti (3,200€)
• Mobilim bazë — krevate, tavolinë, karrige (2,000€)
• Pajisje shtëpiake — frigorifer, lavatrice, sobë (1,500€)
• Rroba dhe këpucë për të gjithë familjen (800€)
• Materiale shkollore dhe çanta për fëmijët (500€)

Çdo euro dhuruar do të ndihmojë drejtpërdrejt këtë familje të rindërtojë jetën e saj.`,
        shortDescription: "Familje e dëmtuar nga zjarri — kanë nevojë urgjente për strehim dhe bazike.",
        images: [
          "https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?w=800&q=80",
          "https://images.unsplash.com/photo-1584467735871-8e4ef5e2c5e8?w=800&q=80",
          "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
        ],
        targetAmount: 8000,
        currentAmount: 0,
        category: "EMERGENCY",
        location: "Mitrovicë, Kosovë",
        isUrgent: true,
        status: "PENDING",
        problemStatement: "Zjarri shkatërroi tërësisht banesën dhe të gjitha pasuritë e familjes Murati. 4 fëmijë dhe 2 të rritur janë pa strehë të sigurt.",
        targetGroup: "Familje me 4 fëmijë të moshës 5-16 vjeç, pa strehë pas zjarrit",
        urgency: 10,
        expectedOutcome: "Familja do të ketë apartament me qira për 6 muaj, mobilim bazë dhe pajisje shtëpiake. Fëmijët do të mund të vazhdojnë shkollën pa ndërprerje.",
        verificationPlan: "Dokumentat e zjarrit nga zjarrfikëset dhe policia janë gati. Kontratat e qirasë do të ngarkohen pas grumbullimit të fondeve.",
        budgetBreakdown: JSON.stringify({
          items: [
            { label: "Qira apartamenti 6 muaj", amount: 3200, percent: 40 },
            { label: "Mobilim bazë", amount: 2000, percent: 25 },
            { label: "Pajisje shtëpiake", amount: 1500, percent: 19 },
            { label: "Rroba dhe këpucë", amount: 800, percent: 10 },
            { label: "Materiale shkollore", amount: 500, percent: 6 },
          ],
        }),
        faqs: JSON.stringify([
          { question: "Si do të shpërndahen fondet?", answer: "Direkt te familja — pagesa qiraje dhe blerje nga dyqanet lokale me fatura." },
          { question: "A mund të dhurojmë rroba dhe mobilje fizike?", answer: "Po! Kontaktoni organizatën për koordinimin e donacioneve fizike." },
          { question: "Si mund të verifikohet historia?", answer: "Dokumentat zyrtare nga policia dhe zjarrfikëset janë të disponueshme." },
        ]),
        partners: "Kryqi i Kuq Kosovë, Bashkia e Mitrovicës",
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        creatorId: arta.id,
      },
      {
        slug: "bursa-per-studentet-rome",
        title: "Bursa arsimore për 20 studentë rom",
        description: `Komuniteti rom në Shqipëri ka një nga normat më të ulëta të pjesëmarrjes universitare — vetëm 3% e të rinjve rom arrijnë të diplomohen. Pengesat janë financiare, jo të mungesës së talentit apo ambicies.

Programi "Drita e Dijes" ka identifikuar 20 studentë të talentuar me nota mesatare mbi 8.5, që kanë kaluar provimet e maturës me sukses por nuk mund të paguajnë shkollimin universitar.

**Çfarë përfshin bursa:**
• Tarifat e plotë universitare (1 vit akademik)
• Libra dhe materiale mësimore
• Laptop për studime
• Mentorim individual nga profesionistë

**Profilet e studentëve:**
Elona M. (Tiranë) — dëshiron të studiojë Mjekësi
Artan B. (Fier) — ka kaluar provimin e inxhinierisë
Diona S. (Shkodër) — aspiron të bëhet mësuese
...dhe 17 të tjerë me histori të ngjashme.

Arsimi është rruga e vetme e qëndrueshme drejt barazisë. Me bursën tuaj, ju ndryshoni jo vetëm jetën e një personi, por të gjithë familjes dhe komunitetit.`,
        shortDescription: "Bursa të plota universitare për 20 studentë të komunitetit rom me rezultate shkëlqyese.",
        images: [
          "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
          "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80",
        ],
        targetAmount: 15000,
        currentAmount: 0,
        category: "EDUCATION",
        location: "Shqipëri (Tiranë, Fier, Shkodër)",
        isUrgent: false,
        status: "PENDING",
        problemStatement: "Vetëm 3% e të rinjve rom arrijnë diplomë universitare për shkak të pengesave financiare, jo mungesës së aftësive.",
        targetGroup: "20 studentë rom me maturë të kaluar dhe mesatare mbi 8.5, familje me të ardhura nën 30,000 lekë/muaj",
        urgency: 7,
        expectedOutcome: "20 studentë do të ndjekin universitetin për 1 vit të plotë. Synimi afatgjatë: 80% do të diplomohen dhe punësohen brenda 4 viteve.",
        verificationPlan: "Çdo student do të kalojë process seleksioni me dokumente: çertifikata e maturës, vërtetim familjeje, intervistë. Raportime tremujore mbi performancën.",
        budgetBreakdown: JSON.stringify({
          items: [
            { label: "Tarifa universitare (20 studentë)", amount: 10000, percent: 67 },
            { label: "Laptop dhe pajisje (20 copë)", amount: 3000, percent: 20 },
            { label: "Libra dhe materiale", amount: 1200, percent: 8 },
            { label: "Kosto administrative dhe mentorim", amount: 800, percent: 5 },
          ],
        }),
        faqs: JSON.stringify([
          { question: "Si zgjidhen studentët?", answer: "Proces transparent me kriter: nota, gjendje ekonomike, intervistë dhe letër motivuese." },
          { question: "Çfarë ndodh nëse studenti abandon?", answer: "Bursa transferohet te studenti i radhës nga lista pritëse." },
          { question: "A ka raportim mbi përdorimin e fondeve?", answer: "Po — raport tremujor publik me fatura dhe progres akademik." },
        ]),
        partners: "Universiteti i Tiranës, Roma Aktive Albania, UNICEF Albania",
        endsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        creatorId: besnik.id,
      },
      {
        slug: "pajisje-mjekesore-spitali-gjakove",
        title: "Pajisje mjekësore moderne për spitalin e Gjakovës",
        description: `Spitali Rajonal i Gjakovës shërben një popullsi prej 120,000 banorësh dhe është institucioni shëndetësor kryesor për 5 komuna. Njësia e Kujdesit Intensiv (ICU) aktualisht operon me pajisje 15-vjeçare që dështojnë rregullisht, duke krijuar situata të rrezikshme për jetën.

**Situata aktuale:**
Aparati i vetëm EKG është jashtë funksionit 3-4 herë në muaj. Muajin e kaluar, një pacient me infarkt priu 40 minuta pa monitorim kardiak për shkak të dështimit teknik. Mjekët po bëjnë mrekulli me pajisje të vjetruara.

**Çfarë duhet blerë:**
• 1 aparat EKG 12-kanalësh GE Healthcare (8,500€)
• 4 monitorë multiparametrikë Philips IntelliVue (9,200€)
• 1 defibrillator/AED Zoll (4,300€)

**Ndikimi:**
Me këto pajisje, ICU do të mund të trajtojë 40% më shumë pacientë kritikë me standarde europiane të kujdesit. Çdo vit kalohen rreth 800 pacientë nëpër ICU.

Donacioni juaj shpëton jetë konkrete — jo statistika abstrakte.`,
        shortDescription: "Aparat EKG, monitorë ICU dhe defibrillator për spitalin rajonal që shërben 120,000 banorë.",
        images: [
          "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
          "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80",
          "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80",
        ],
        targetAmount: 22000,
        currentAmount: 0,
        category: "MEDICAL",
        location: "Gjakovë, Kosovë",
        isUrgent: true,
        status: "PENDING",
        problemStatement: "Pajisjet 15-vjeçare të ICU dështojnë rregullisht duke rrezikuar jetën e pacientëve kritikë. Spitali shërben 120,000 banorë pa alternativa të afërta.",
        targetGroup: "Pacientët e njësisë ICU të Spitalit Rajonal të Gjakovës — rreth 800 raste/vit",
        urgency: 9,
        expectedOutcome: "ICU me pajisje moderne europiane. 40% rritje kapaciteti trajtimi. Zero dështime teknike gjatë procedurave kritike.",
        verificationPlan: "Spitali ka lëshuar letër zyrtare nevojash (të ngarkueshme). Blerjet do të bëhen direkt nga furnitorët e certifikuar me fatura publike.",
        budgetBreakdown: JSON.stringify({
          items: [
            { label: "Aparat EKG 12-kanalësh GE Healthcare", amount: 8500, percent: 39 },
            { label: "4 × Monitorë Philips IntelliVue", amount: 9200, percent: 42 },
            { label: "Defibrillator/AED Zoll", amount: 4300, percent: 19 },
          ],
        }),
        faqs: JSON.stringify([
          { question: "A ka spitali leje për pranimin e donacioneve?", answer: "Po — letra zyrtare e Ministrisë së Shëndetësisë është e disponueshme." },
          { question: "Si garantohet që pajisjet shkojnë ku duhet?", answer: "Blerje direkte nga furnitori. Fotografi dhe video dokumentojnë instalimin." },
          { question: "Çfarë ndodh nëse mblidhet më shumë se synimi?", answer: "Fondet shtesë do të shkojnë për mirëmbajtje dhe trajnim të stafit." },
        ]),
        partners: "Ministria e Shëndetësisë së Kosovës, Mjekët pa Kufij",
        endsAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        creatorId: gjyle.id,
      },
    ],
  })

  console.log("✅ 3 kampanja PENDING u rikrijuan — të plota me foto, budget, FAQ dhe partners")
  console.log("\n📋 Slug-et:")
  console.log("   • ndihmo-familjen-murati")
  console.log("   • bursa-per-studentet-rome")
  console.log("   • pajisje-mjekesore-spitali-gjakove")
}

main()
  .catch((e) => { console.error("❌ Gabim:", e); process.exit(1) })
  .finally(() => prisma.$disconnect())
