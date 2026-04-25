/**
 * Username utilities — validimi + formatimi i @username
 * Rregullat:
 *   • 3–24 karaktere
 *   • Vetëm a-z, 0-9, underscore _
 *   • Nuk fillon me numër
 *   • Reservohen disa fjalë (admin, support, etj.)
 */

const RESERVED = new Set([
  "admin",
  "administrator",
  "support",
  "help",
  "unify",
  "official",
  "team",
  "moderator",
  "mod",
  "system",
  "root",
  "api",
  "www",
  "mail",
  "info",
  "contact",
  "anonymous",
  "deleted",
  "user",
  "guest",
])

const USERNAME_RE = /^[a-z][a-z0-9_]{2,23}$/

export type UsernameValidation =
  | { ok: true }
  | { ok: false; reason: string }

export function validateUsername(input: string): UsernameValidation {
  const u = input.trim().toLowerCase()
  if (!u) return { ok: false, reason: "Username kërkohet" }
  if (u.length < 3) return { ok: false, reason: "Min 3 karaktere" }
  if (u.length > 24) return { ok: false, reason: "Max 24 karaktere" }
  if (!USERNAME_RE.test(u)) {
    return {
      ok: false,
      reason: "Vetëm shkronja të vogla, numra dhe _ — duhet të fillojë me shkronjë",
    }
  }
  if (RESERVED.has(u)) {
    return { ok: false, reason: "Ky username është i rezervuar" }
  }
  return { ok: true }
}

export function normalizeUsername(input: string): string {
  return input.trim().toLowerCase().replace(/^@/, "")
}

export function formatUsername(username: string | null | undefined): string {
  if (!username) return ""
  const u = username.trim().replace(/^@/, "")
  return `@${u}`
}

export function profileUrl(username: string | null | undefined): string {
  if (!username) return "/profili"
  return `/profili/${normalizeUsername(username)}`
}
