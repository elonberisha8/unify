export interface BlogPostSection {
  heading: string
  paragraphs: string[]
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  imageUrl: string
  featured?: boolean
  tags: string[]
  sections: BlogPostSection[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "si-te-krijosh-nje-kampanje-te-besueshme",
    title: "Si të krijosh një kampanjë të besueshme që njerëzit duan ta mbështesin",
    excerpt:
      "Nga titulli te milestones, këto janë elementet që e bëjnë një kampanjë të duket reale, e qartë dhe e besueshme.",
    category: "Udhëzues",
    author: "Ekipi Unify",
    publishedAt: "24 Prill 2026",
    readTime: "6 min",
    imageUrl:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    tags: ["Kampanja", "Transparencë", "Këshilla"],
    sections: [
      {
        heading: "Fillo me një histori të qartë",
        paragraphs: [
          "Njerëzit nuk dhurojnë vetëm për një shumë target. Ata dhurojnë për një histori që kuptojnë dhe me të cilën lidhen emocionalisht.",
          "Shpjego kush ka nevojë për ndihmë, pse tani është moment kritik dhe si do të përdoren fondet që mblidhen.",
        ],
      },
      {
        heading: "Përdor foto reale dhe dokumente mbështetëse",
        paragraphs: [
          "Pamjet reale rrisin besimin menjëherë. Nëse ke raporte mjekësore, dokumente pranimi ose prova të tjera, përmendi qartë në përshkrim.",
          "Qëllimi nuk është të ngarkosh përdoruesin me shumë informacione, por t'i japësh arsye të besojë se kampanja është autentike.",
        ],
      },
      {
        heading: "Milestones e bëjnë progresin të dukshëm",
        paragraphs: [
          "Kur target-i duket i madh, ndaje në hapa. Për shembull: analiza, operacioni, rikuperimi, ose pagesa e semestrit, strehimi dhe transporti.",
          "Kjo i ndihmon donatorët të kuptojnë se çfarë ndryshimi sjell edhe një shumë e vogël.",
        ],
      },
    ],
  },
  {
    slug: "cfare-do-te-thote-verified-creator",
    title: "Çfarë do të thotë “Verified Creator” dhe pse është e rëndësishme",
    excerpt:
      "Verifikimi nuk është vetëm një badge. Është një shtresë besimi që mbron si krijuesit ashtu edhe donatorët.",
    category: "Siguri",
    author: "Ekipi Unify",
    publishedAt: "22 Prill 2026",
    readTime: "4 min",
    imageUrl:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    tags: ["Verifikim", "Stripe", "Siguri"],
    sections: [
      {
        heading: "Verifikim i identitetit për më shumë besueshmëri",
        paragraphs: [
          "Përmes Stripe Identity, krijuesit konfirmojnë identitetin e tyre përpara se të mbledhin fonde. Kjo ul ndjeshëm rrezikun e mashtrimeve dhe llogarive false.",
          "Kur donatorët shohin që një krijues është i verifikuar, vendimi për të dhuruar bëhet shumë më i lehtë.",
        ],
      },
      {
        heading: "Mbrojtje për komunitetin",
        paragraphs: [
          "Një platformë komunitare funksionon vetëm kur njerëzit besojnë te njëri-tjetri. Verifikimi ndihmon që çdo kampanjë serioze të ketë një standard minimal transparence.",
          "Ky proces nuk zëvendëson kujdesin personal, por e bën ekosistemin më të sigurt për të gjithë.",
        ],
      },
    ],
  },
  {
    slug: "si-ndikon-diaspora-ne-kauzat-lokale",
    title: "Si mund të ndikojë diaspora shqiptare në kauzat lokale",
    excerpt:
      "Për shumë familje dhe iniciativa në Kosovë e Shqipëri, mbështetja nga diaspora është dallimi mes pritjes dhe veprimit.",
    category: "Komuniteti",
    author: "Ekipi Unify",
    publishedAt: "19 Prill 2026",
    readTime: "5 min",
    imageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    tags: ["Diaspora", "Komuniteti", "Solidaritet"],
    sections: [
      {
        heading: "Afërsia emocionale mbetet e fortë",
        paragraphs: [
          "Edhe kur jetojnë larg, shumë shqiptarë jashtë vendit e ndjejnë si obligim moral të ndihmojnë familjet, qytetet dhe komunitetet e tyre.",
          "Një platformë digjitale e bën këtë mbështetje më të shpejtë, më të matshme dhe më transparente.",
        ],
      },
      {
        heading: "Jo vetëm para, por edhe rrjet dhe zë",
        paragraphs: [
          "Diaspora shpesh mund të ndihmojë edhe duke shpërndarë kampanjën te rrjetet e veta profesionale e sociale.",
          "Kjo e kthen një kauzë lokale në një çështje me mbështetje globale.",
        ],
      },
    ],
  },
  {
    slug: "5-gabime-qe-duhet-ti-shmangesh-ne-nje-faqe-kontakti",
    title: "5 gabime që duhet t’i shmangësh kur prezanton një kauzë online",
    excerpt:
      "Mesazhe të paqarta, mungesë transparence dhe thirrje të dobëta për veprim mund ta dëmtojnë edhe kauzën më të mirë.",
    category: "Këshilla",
    author: "Ekipi Unify",
    publishedAt: "17 Prill 2026",
    readTime: "4 min",
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    tags: ["Këshilla", "Komunikim", "Storytelling"],
    sections: [
      {
        heading: "Mos e lër qëllimin në mjegull",
        paragraphs: [
          "Kur nuk është e qartë saktësisht për çfarë po mblidhen fondet, njerëzit hezitojnë. Shuma target duhet të lidhet me nevoja konkrete.",
          "Sa më e qartë të jetë arsyeja, aq më i fortë bëhet besimi.",
        ],
      },
      {
        heading: "Mos e tepro me emocione pa fakte",
        paragraphs: [
          "Empatia është e rëndësishme, por pa prova dhe kontekst ajo mund të duket si manipulim.",
          "Balanca më e mirë vjen kur historia njerëzore mbështetet nga detaje konkrete dhe progres i raportuar rregullisht.",
        ],
      },
    ],
  },
]

export const BLOG_CATEGORIES = [
  { label: "Udhëzues", count: 6 },
  { label: "Siguri", count: 4 },
  { label: "Komuniteti", count: 3 },
  { label: "Këshilla", count: 5 },
]

export const BLOG_TAGS = [
  "Diaspora",
  "Kampanja",
  "Transparencë",
  "Siguri",
  "Storytelling",
  "Komuniteti",
]

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug)
}
