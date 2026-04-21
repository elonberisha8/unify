// ============================================================
// CLOUDINARY — URL Builder + Transformations
// Cloud name: dyimfvnv3
// Dashboard: console.cloudinary.com
// ============================================================

export const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dyimfvnv3"

/**
 * Ndërtoji URL e Cloudinary me transformime
 * @param publicId  — Cloudinary public ID (p.sh. "unify/hero/main")
 * @param transforms — Transformation string (p.sh. "w_800,h_600,c_fill")
 */
export function cldUrl(publicId: string, transforms = "q_auto,f_auto"): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}

// ============================================================
// PRESETS — Dimensione të predefinuara për çdo tip fotoje
// ============================================================
export const CLD = {
  /** Kampanja cover — 800×600 */
  campaign: (id: string) => cldUrl(id, "w_800,h_600,c_fill,q_auto,f_auto"),
  /** Hero kryesor — 1200×800 */
  hero:     (id: string) => cldUrl(id, "w_1200,h_800,c_fill,q_auto,f_auto"),
  /** Blog cover — 800×500 */
  blog:     (id: string) => cldUrl(id, "w_800,h_500,c_fill,q_auto,f_auto"),
  /** Avatar rrethore — 300×300 */
  avatar:   (id: string) => cldUrl(id, "w_300,h_300,c_fill,q_auto,f_auto,r_max"),
  /** Galeria — 600×400 */
  gallery:  (id: string) => cldUrl(id, "w_600,h_400,c_fill,q_auto,f_auto"),
  /** Shpallje vullnetare — 800×600 */
  volunteer:(id: string) => cldUrl(id, "w_800,h_600,c_fill,q_auto,f_auto"),
  /** Thumbnail i vogël — 200×200 */
  thumb:    (id: string) => cldUrl(id, "w_200,h_200,c_fill,q_auto,f_auto"),
}
