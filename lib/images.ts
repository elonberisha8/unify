// ============================================================
// IMAGES — Cloudinary paths për të gjitha imazhet e Unify
// Cloud: dyimfvnv3
// ============================================================
// Si funksionon:
//   1. Skripti `scripts/upload-figma-images.js` ngarkon imazhet nga Figma
//   2. Imazhet ruhen në Cloudinary me këto public IDs
//   3. CLD.hero("unify/hero/main") → URL e optimizuar automatikisht
// ============================================================

import { CLD } from "@/lib/cloudinary"

export const IMAGES = {

  // ============================================================
  // HERO — Faqja kryesore, Rreth Nesh
  // Cloudinary path: unify/hero/main
  // ============================================================
  hero: {
    main:    CLD.hero("unify/hero/main"),
  },

  // ============================================================
  // KAMPANJAT — Cover images për kartat e kampanjave
  // Cloudinary paths: unify/campaigns/campaign-{1,2,3}
  // ============================================================
  campaigns: {
    campaign1: CLD.campaign("unify/campaigns/campaign-1"),  // Ujë i Pastër — Lipjan
    campaign2: CLD.campaign("unify/campaigns/campaign-2"),  // Libra Shkollore
    campaign3: CLD.campaign("unify/campaigns/campaign-3"),  // Spitali — Vullnetar
  },

  // ============================================================
  // GALERIA — Seksioni i galerie në homepage
  // Cloudinary paths: unify/gallery/img-{1,2,3,4}
  // ============================================================
  gallery: {
    img1: CLD.gallery("unify/gallery/img-1"),
    img2: CLD.gallery("unify/gallery/img-2"),
    img3: CLD.gallery("unify/gallery/img-3"),
    img4: CLD.gallery("unify/gallery/img-4"),
  },

  // ============================================================
  // SEKSIONET — Imazhe për seksione specifike
  // ============================================================
  sections: {
    featureCta:  CLD.hero("unify/sections/feature-cta"),    // Seksioni blu CTA
    rrethNesh:   CLD.hero("unify/sections/rreth-nesh"),     // Faqja Rreth Nesh
    vullnetare:  CLD.hero("unify/sections/vullnetare"),     // Seksioni vullnetarë
    bamiresiCta: CLD.hero("unify/sections/bamiresi-cta"),   // Seksioni bamirësi
  },

  // ============================================================
  // EKIPI — Portretet e vullnetarëve/ekipit
  // Cloudinary paths: unify/team/{name}
  // ============================================================
  team: {
    albertAliu:    CLD.avatar("unify/team/albert-aliu"),
    rilindKrasniqi: CLD.avatar("unify/team/rilind-krasniqi"),
    deaKrasniqi:   CLD.avatar("unify/team/dea-krasniqi"),
    besaAjeti:     CLD.avatar("unify/team/besa-ajeti"),
  },

}

// ============================================================
// Fallback — avatar default kur useri nuk ka foto profili
// ============================================================
export const DEFAULT_AVATAR = CLD.avatar("unify/team/albert-aliu")
export const DEFAULT_CAMPAIGN_COVER = IMAGES.campaigns.campaign1
export const DEFAULT_BLOG_COVER = IMAGES.sections.rrethNesh
